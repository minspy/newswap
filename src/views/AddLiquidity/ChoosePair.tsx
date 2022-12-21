import { Currency } from '@pancakeswap/sdk'
import { Box, Text, AddIcon, CardBody, Button, CardFooter } from '@pancakeswap/uikit'
import { CurrencySelect } from 'components/CurrencySelect'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppHeader } from '../../components/App'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import { CommonBasesType } from '../../components/SearchModal/types'

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  return (
    <>
      <AppHeader
        title={t('Add Liquidity')}
        subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
        helper={t(
          'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
        )}
        backTo="/liquidity"
      />
      <CardBody>
        <Box>
          <Text textTransform="uppercase" color="secondary" bold small pb="24px" style={{ fontSize: '12px' }}>
            {t('Choose a valid pair')}
          </Text>
          <FlexGap gap="30px">
            <Text />
            <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>X(发行的代币）</Text>
            <AddIcon color="textSubtle" />
            <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Y(募集的代币）</Text>
          </FlexGap>
          <FlexGap gap="4px">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={currencyA}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <AddIcon color="textSubtle" />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={currencyB}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
          </FlexGap>
        </Box>
      </CardBody>
      <CardFooter>
        {/* exp diff */}
        <Text textAlign="center" style={{ fontSize: '14px' }}>
          恒定乘积公式 XY^0.5=K
        </Text>
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button
            data-test="choose-pair-next"
            width="100%"
            variant={!isValid ? 'danger' : 'primary'}
            onClick={onNext}
            style={{ marginTop: '10px' }}
            disabled={!isValid}
          >
            {error ?? t('Add Liquidity')}
          </Button>
        )}
      </CardFooter>
    </>
  )
}
