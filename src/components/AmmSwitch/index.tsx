import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { changeAmmType } from 'state/amm/reducer'
import { AmmType } from 'state/amm/types'

const AmmSwitch: React.FC<React.PropsWithChildren> = () => {
  const dispatch = useAppDispatch()

  const setAmmType = (ammType: AmmType) => {
    dispatch(changeAmmType(ammType))
  }

  return (
    <div>
      <Button
        onClick={() => {
          setAmmType(AmmType.Default)
        }}
      >
        SWAP1
      </Button>
      <Button
        onClick={() => {
          setAmmType(AmmType.SevenFive)
        }}
      >
        SWAP2
      </Button>
      <Button
        onClick={() => {
          setAmmType(AmmType.Five)
        }}
      >
        SWAP3
      </Button>
    </div>
  )
}

export default AmmSwitch
