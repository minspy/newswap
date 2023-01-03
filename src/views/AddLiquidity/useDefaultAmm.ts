import { useMemo } from 'react'
import flatMap from 'lodash/flatMap'

import { Interface } from '@ethersproject/abi'
import { Currency, Token, Pair } from '@pancakeswap/sdk'

import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  ADDITIONAL_BASES,
} from 'config/constants/exchange'
import IPancakePairABI from 'config/abi/IPancakePair.json'

import { wrappedCurrency } from 'utils/wrappedCurrency'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairState, usePairs } from 'hooks/usePairs'

import { useMultipleContractSingleData } from 'state/multicall/hooks'
import { AmmType } from 'state/amm/types'

const PAIR_INTERFACE = new Interface(IPancakePairABI)

const useDefaultAmm = ({
  currencyA,
  currencyB,
}: {
  currencyA: Currency
  currencyB: Currency
  noLiquidity: boolean
}) => {
  const { chainId } = useActiveWeb3React()

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const bases: Token[] = useMemo(() => {
    if (!chainId) return []

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  )

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA_, tokenB_]) => {
              if (!chainId) return true
              const customBases = CUSTOM_BASES[chainId]

              const customBasesA: Token[] | undefined = customBases?.[tokenA_.address]
              const customBasesB: Token[] | undefined = customBases?.[tokenB_.address]

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
              if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId],
  )

  const allPairs = usePairs(allPairCombinations).filter((result): result is [PairState.EXISTS, Pair] => {
    return Boolean(result[0] === PairState.EXISTS && result[1])
  })

  const validPairAddresses = allPairs.map((result) => {
    return Pair.getAddress(result[1].token0, result[1].token1)
  })

  const exponentsResult = useMultipleContractSingleData(validPairAddresses, PAIR_INTERFACE, 'getExponents')

  let ammType = AmmType.Default

  exponentsResult.forEach((result, i) => {
    const { result: exponents, loading } = result

    if (loading) {
      return
    }

    if (!exponents) {
      return
    }

    const { exponent1 } = exponents

    const decimalExponent1 = parseInt(exponent1, 10)

    if (decimalExponent1 === 50) {
      ammType = AmmType.Five
    } else if (decimalExponent1 === 75) {
      ammType = AmmType.SevenFive
    }
  })

  return ammType
}

export default useDefaultAmm
