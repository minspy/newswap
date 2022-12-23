import { Currency, Pair, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from '../CurrencyInputPanel/NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  padding-bottom: 5px;
  padding-top: 8px;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;

  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      // background: ${theme.colors.background};
      // border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`
const LabelRow = styled.div`
  display: flex;dinjia
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  padding-top: 8px;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
  background: #e8f3ff;
  border: 1px solid ${({ theme }) => theme.colors.inputCat};
  border-radius: ${({ theme }) => theme.radii.default};
  overflow: hidden;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 0px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface PriceInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
  disableCurrencySelectbBottomToken?: boolean
  onCurrencySelectBottomToken?: (currency: Currency) => void
  currencyBottomToken?: Currency | null
  showCommonBasesBottomToken?: boolean
  commonBasesTypeBottomToken?: string
  otherCurrencyBottomToken?: Currency | null
}
export default function PriceInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  disabled,
  error,
  showBUSD,
  disableCurrencySelectbBottomToken,
  onCurrencySelectBottomToken,
  currencyBottomToken,
  showCommonBasesBottomToken,
  commonBasesTypeBottomToken,
  otherCurrencyBottomToken,
}: PriceInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  const [onPresentCurrencyModalBottomToken] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelectBottomToken}
      selectedCurrency={otherCurrency}
      otherSelectedCurrency={currency}
      showCommonBases={showCommonBasesBottomToken}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box position="relative" id={id}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          {beforeButton}
          {/* <CurrencySelectButton
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton> */}

          {token && tokenAddress ? (
            <Flex style={{ gap: '4px' }} ml="4px" mb="5px" alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={tokenAddress}
                tooltipMessage={t('Token address copied')}
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
              />
              <AddToWalletButton
                variant="text"
                p="0"
                height="auto"
                width="fit-content"
                tokenAddress={tokenAddress}
                tokenSymbol={token.symbol}
                tokenDecimals={token.decimals}
                tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
              />
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error}>
          <LabelRow style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px' }}>定价 1{currency.symbol}=</Text>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
            <Text style={{ fontSize: '12px', marginLeft: '6px', marginTop: '2px' }}>{otherCurrency.symbol}</Text>
          </LabelRow>
          <InputRow selected={disableCurrencySelect} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button
                onClick={onMax}
                scale="xs"
                variant="secondary"
                style={{
                  fontSize: '10px',
                  border: '1px solid #000000',
                  color: '#333333',
                }}
              >
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
            <CurrencySelectButton
              zapStyle={zapStyle}
              className="open-currency-select-button"
              selected={!!currency}
              onClick={() => {
                if (!disableCurrencySelect) {
                  onPresentCurrencyModal()
                }
              }}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '8px' }} />
                ) : null}
                {pair ? (
                  <Text id="pair" bold style={{ fontSize: '12px' }}>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text id="pair" bold style={{ fontSize: '12px' }}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {!disableCurrencySelect && <ChevronDownIcon />}
              </Flex>
            </CurrencySelectButton>
            {/* <Text style={{display: 'flex', alignItems:'center'}} onClick={() => {
                if (!disableCurrencySelectbBottomToken) {
                  onPresentCurrencyModalBottomToken()
                }
              }} >
              <CurrencyLogo currency={otherCurrency} size="24px" style={{ marginRight: '8px' }}/>
            </Text> */}
            <CurrencySelectButton
              zapStyle={zapStyle}
              className="open-currency-select-button"
              selected={!!otherCurrency}
              onClick={() => {
                if (!disableCurrencySelectbBottomToken) {
                  onPresentCurrencyModalBottomToken()
                }
              }}
            >
              <Flex alignItems="center" justifyContent="space-between">
                <CurrencyLogo currency={otherCurrency} size="20px" style={{ marginRight: '8px' }} />
                <Text id="pair" bold style={{ fontSize: '12px' }}>
                  {(otherCurrency && otherCurrency.symbol && otherCurrency.symbol.length > 20
                    ? `${otherCurrency.symbol.slice(0, 4)}...${otherCurrency.symbol.slice(
                        otherCurrency.symbol.length - 5,
                        otherCurrency.symbol.length,
                      )}`
                    : otherCurrency?.symbol) || t('Select a currency')}
                </Text>
                {!disableCurrencySelectbBottomToken && <ChevronDownIcon />}
              </Flex>
            </CurrencySelectButton>
          </InputRow>
        </Container>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}
