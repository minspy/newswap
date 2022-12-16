import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { State, AmmType } from './types'

const initialState: State = {
  data: {
    ammType: AmmType.Default,
  },
}

export const Amm = createSlice({
  name: 'Amm',
  initialState,
  reducers: {
    changeAmmType: (state, action: PayloadAction<AmmType>) => {
      state.data.ammType = action.payload
    },
  },
})

// Actions
export const { changeAmmType } = Amm.actions

export default Amm.reducer
