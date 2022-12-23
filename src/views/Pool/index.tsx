import { useMemo,  useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, ArrowBackIcon, IconButton } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@web3-react/core'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }
  const [isAddWhitelist, setIsAddWhitelist] = useState(false)
  const [ isAddWiteListSuccess, setIsAddWiteListSuccess ] = useState(false)
  const [ whiteListInfo, setWhiteListInfo ] = useState({
    whiteListAddress: '',
    contractAddress: ''
  })

  return (
    !isAddWhitelist ? (<Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <div style={{
          fontFamily: 'Inter',
          fontSize: '12px',
          fontStyle: 'normal',
          lineHeight: '15px',
          color: '#111526',
          padding: '0 17px',
          marginBottom: '15px'
        }}>
        首次添加流动性需要代币创建者输入钱包地址和代币合约设置白名单，若代币创建者添加流动性将创建代币的钱包设置为白名单，若其他钱包添加流动性，将对应的钱包设置为白名单。设置白名单后，便可以选择三个swap中的一个添加流动性。
        需要注意的是一个交易对在一个swap中添加流动性后，其他两个swap不能再添加流动性，这样可以防止用户选择错误造成资金损失。
        </div>
        <Body style={{
          background: '#E8F3FF'
        }}>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Link href="/find" passHref>
                <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                  {t('Find other LP tokens')}
                </Button>
              </Link>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/whitelist" passHref>
            <Button id="join-pool-button" width="100%" style={{background: '#4263EB', marginBottom: '16px'}}>
              添加白名单
            </Button>
          </Link>
          <Link href="/add" passHref>
            <Button id="join-pool-button" width="100%" style={{background: '#111526'}} startIcon={<AddIcon color="white"  />}>
              {t('Add Liquidity')}
            </Button>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>)
    : 
    (<Page>
    <AppBody>
      <div style={{
        padding: '0 17px',
        marginBottom: '15px'
      }}>
        <div style={{padding: '22px 0 14px 0'}}>
          <IconButton as="a" scale="sm" onClick={()=>{
            setIsAddWhitelist(false)
          }}>
            <ArrowBackIcon width="22px" />
          </IconButton>
        </div>
        <div style={{
            fontFamily: 'Inter',
            fontSize: '12px',
            fontStyle: 'normal',
            lineHeight: '15px',
            color: '#111526',
          }}>
          首次添加流动性需要代币创建者输入钱包地址和代币合约设置白名单，若代币创建者添加流动性将创建代币的钱包设置为白名单，若其他钱包添加流动性，将对应的钱包设置为白名单。设置白名单后，便可以选择三个swap中的一个添加流动性。
          需要注意的是一个交易对在一个swap中添加流动性后，其他两个swap不能再添加流动性，这样可以防止用户选择错误造成资金损失。
          </div>
      </div>
      <div style={{
        padding: '0 15px'
      }}>
          <div style={{
            color: '#333333',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '15px',
            marginTop: '40px'
          }}>
            <div style={{

            }}>白名单钱包地址</div>
            { !isAddWiteListSuccess ? (<div style={{
              background: '#E8F3FF',
              border: '1px solid #000000',
              borderRadius: '12px',
              padding: '10px 15px',
              marginTop: '10px',
              height: '65px',
            }}>
              <textarea style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                lineHeight: '17px'
              }} 
              onChange={(e)=>{
                setWhiteListInfo({
                  whiteListAddress: e.target.value,
                  contractAddress: whiteListInfo.contractAddress
                })
              }} />
            </div>):
            (<div style={{
              borderRadius: '12px',
              padding: '10px 0px',
              marginTop: '10px',
              wordBreak: 'break-all'
            }}>
              {whiteListInfo.whiteListAddress}
            </div>)}
          </div>
          <div style={{
            color: '#333333',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '15px',
            marginTop: '24px',
            marginBottom: '30px'
          }}>
            <div style={{
            }}>代币合约</div>
            { !isAddWiteListSuccess ? (<div style={{
              background: '#E8F3FF',
              border: '1px solid #000000',
              borderRadius: '12px',
              padding: '10px 15px',
              marginTop: '10px',
              height: '65px'
            }}>
              <textarea style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                lineHeight: '17px'
              }} onChange={(e)=>{
                setWhiteListInfo({
                  whiteListAddress: whiteListInfo.whiteListAddress,
                  contractAddress: e.target.value
                })
              }} />
            </div>):
            (<div style={{
              borderRadius: '12px',
              padding: '10px 0px',
              marginTop: '10px',
              wordBreak: 'break-all'
            }}>
              {whiteListInfo.whiteListAddress}
            </div>)}
            {(!isAddWiteListSuccess && <div style={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '15px',
              color: '#AAAAAA',
              marginTop: '5px'
            }}>
              你是代币创建者，可以设置首次添加流动性的白名单钱包地址， 输入首次添加LP的钱包地址（可以是该地址也可以是其他地址）并支付10u，对应的钱包地址便可以作为首次添加LP的钱包地址，首次添加lp之后其他所有地址都可以添加流动性，当交易额达100000u，以上时我们将会原路退回10u。
            </div>)}
          </div>
        </div>
      <CardFooter style={{ textAlign: 'center' }}>
        {!isAddWiteListSuccess ? (
          <Button id="join-pool-button" width="100%" style={{background: '#111526'}} onClick={()=>{
              setIsAddWiteListSuccess(true)
            }}>
            Supply 10USDC
        </Button>
        )
        :
        (<>
          <Link href="/add" passHref>
            <Button id="join-pool-button" width="100%" style={{background: '#111526'}} startIcon={<AddIcon color="white"  />}>
              {t('Add Liquidity')}
            </Button>
          </Link>
          <Button id="join-pool-button" width="100%" style={{background: 'white', color: 'black', marginTop: '10px', boxShadow: 'none'}} onClick={()=>{

              setIsAddWiteListSuccess(false)
              setWhiteListInfo({
                whiteListAddress: '',
                contractAddress: ''
              })
            }}>
            继续添加
          </Button>
        </>)}
      </CardFooter>
    </AppBody>
  </Page>)
  )
}
