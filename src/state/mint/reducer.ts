import { createReducer } from '@reduxjs/toolkit'
import { Field, resetMintState, typeInput } from './actions'

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
  readonly customPrice: string
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
  customPrice: '',
}

export default createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (field === Field.PRICE) {
        return {
          ...state,
          customPrice: typedValue,
        }
      }
      // 这次修改的代币都作为独立的代币，另一个代币都作为依赖的代币
      if (noLiquidity) {
        // 如果没有流动性，判断当此修改的和之前修改的是否一致，如果一致那么只要修改typeValue就好了
        // 如果不一致，就要把这次修改的作为新的typeValue，并且把之前的typeValue作为otherTypedValue
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value

        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        }
      }
      // 如果已经有流动性了，只需要记录当前修改了哪个代币，以及修改后的金额，另一个代币的数量就可以通过公式直接算出来
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      }
    }),
)
