import { createAction } from '@reduxjs/toolkit'

export enum OriginField {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
  PRICE = 'PRICE',
}

export const typeInput = createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>('mint/typeInputMint')
export const resetMintState = createAction<void>('mint/resetMintState')
