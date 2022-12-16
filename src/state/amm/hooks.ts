import { useSelector } from 'react-redux'
import { State } from '../types'
import { AmmType } from './types'

export const useAmmType = (): AmmType => {
  const ammType = useSelector((state: State) => {
    return state.amm.data.ammType
  })
  return ammType
}
