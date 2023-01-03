import React from 'react'
import Link from 'next/link'

import { NotificationDot, ArrowBackIcon, IconButton, Button, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { changeAmmType } from 'state/amm/reducer'
import { AmmType } from 'state/amm/types'
import { useAmmType } from 'state/amm/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import Transactions from 'components/App/Transactions'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'

interface Props {
  backTo: any
  noLiquidity: boolean
}

const AmmSwitch: React.FC<React.PropsWithChildren<Props>> = ({ backTo, noLiquidity }) => {
  const ammType = useAmmType()

  const dispatch = useAppDispatch()

  const [expertMode] = useExpertModeManager()

  const setAmmType = (index: AmmType) => {
    dispatch(changeAmmType(index))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        padding: '17px 15px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {backTo &&
        (typeof backTo === 'string' ? (
          <Link passHref href={backTo}>
            <IconButton as="a" scale="sm">
              <ArrowBackIcon width="22px" />
            </IconButton>
          </Link>
        ) : (
          <IconButton scale="sm" variant="text" onClick={backTo}>
            <ArrowBackIcon width="22px" />
          </IconButton>
        ))}
      <div style={{ background: '#F2F2F4', display: 'flex', borderRadius: '30px' }}>
        <Button
          style={{
            background: ammType === 1 ? 'white' : 'transparent',
            color: ammType === 1 ? '#111526' : '#75798C',
            border: ammType === 1 ? '1px solid #111' : '',
            borderRadius: '30px',
            padding: '0 10px',
            height: '32px',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '15px',
          }}
          onClick={() => {
            setAmmType(AmmType.Default)
          }}
        >
          SWAP1
        </Button>
        <Button
          style={{
            background: ammType === 2 ? 'white' : 'transparent',
            color: ammType === 2 ? '#111526' : '#75798C',
            border: ammType === 2 ? '1px solid #111' : '',
            borderRadius: '30px',
            padding: '0 10px',
            height: '32px',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '15px',
          }}
          onClick={() => {
            setAmmType(AmmType.SevenFive)
          }}
        >
          SWAP2
        </Button>
        <Button
          style={{
            background: ammType === 3 ? 'white' : 'transparent',
            color: ammType === 3 ? '#111526' : '#75798C',
            border: ammType === 3 ? '1px solid #111' : '',
            borderRadius: '30px',
            padding: '0 10px',
            height: '32px',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '15px',
          }}
          onClick={() => {
            setAmmType(AmmType.Five)
          }}
        >
          SWAP3
        </Button>
      </div>
      {/* <ButtonMenu
        activeIndex={ammType - 1}
        onItemClick={(index: number) => {
          setAmmType(index + 1)
        }}
        scale="sm"
        ml="12px"
        disabled={!noLiquidity}
      >
        <ButtonMenuItem textColor="#111526">SWAP1</ButtonMenuItem>
        <ButtonMenuItem>SWAP2</ButtonMenuItem>
        <ButtonMenuItem>SWAP3</ButtonMenuItem>
      </ButtonMenu> */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <NotificationDot show={expertMode}>
          <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} />
        </NotificationDot>
        <Transactions />
      </div>
    </div>
  )
}

export default AmmSwitch
