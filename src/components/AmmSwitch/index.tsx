import React from 'react'
// import styled from 'styled-components'
import { Button , NotificationDot , ArrowBackIcon, IconButton } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { changeAmmType } from 'state/amm/reducer'
import { AmmType } from 'state/amm/types'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import Link from 'next/link'
import Transactions from '../App/Transactions'
import { SettingsMode } from '../Menu/GlobalSettings/types'

interface Props {
  swapSelect: number
  setSwapSelect:((any)=> void)
}
const AmmSwitch: React.FC<React.PropsWithChildren<Props>> = ({swapSelect, setSwapSelect, backTo} : any) => {
  const dispatch = useAppDispatch()
  const [expertMode] = useExpertModeManager()
  const setAmmType = (ammType: AmmType) => {
    dispatch(changeAmmType(ammType))
  }

  return (
    <div style={{display: 'flex', flexWrap: 'nowrap', padding: '17px 15px', justifyContent: 'space-between', alignItems: 'center'}}>
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
      <div style={{background: '#F2F2F4', display: 'flex', borderRadius: '30px'}}>
      <Button
        style={{
          background: swapSelect === 1 ? 'white' :'transparent',
          color: swapSelect === 1 ? '#111526' : '#75798C',
          border: swapSelect === 1 ? '1px solid #111': '',
          borderRadius: '30px',
          padding: '0 10px',
          height: '32px',
          outline: 'none',
          boxShadow: 'none',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px'
        }}
        onClick={() => {
          setAmmType(AmmType.Default)
          setSwapSelect(1)
        }}
      >
        SWAP1
      </Button>
      <Button
        style={{
          background: swapSelect === 2 ? 'white' :'transparent',
          color: swapSelect === 2 ? '#111526' : '#75798C',
          border: swapSelect === 2 ? '1px solid #111': '',
          borderRadius: '30px',
          padding: '0 10px',
          height: '32px',
          outline: 'none',
          boxShadow: 'none',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px'
        }}
        onClick={() => {
          setAmmType(AmmType.SevenFive)
          setSwapSelect(2)
        }}
      >
        SWAP2
      </Button>
      <Button
        style={{
          background: swapSelect === 3 ? 'white' :'transparent',
          color: swapSelect === 3 ? '#111526' : '#75798C',
          border: swapSelect === 3 ? '1px solid #111': '',
          borderRadius: '30px',
          padding: '0 10px',
          height: '32px',
          outline: 'none',
          boxShadow: 'none',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px'
        }}
        onClick={() => {
          setAmmType(AmmType.Five)
          setSwapSelect(3)
        }}
      >
        SWAP3
      </Button>
      </div>
    </div>
  )
}

export default AmmSwitch
