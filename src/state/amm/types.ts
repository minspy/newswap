export interface State {
  data: {
    ammType: AmmType
  }
}

export const enum AmmType {
  /** 1: 1 */
  Default,
  /** 2: 1 */
  Five,
  /** 3: 4 */
  SevenFive,
}
