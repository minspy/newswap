export function splitTransferInputData(
  input: string,
): { method: string; toAddress: string; amount: string } | undefined {
  // if (!input) return

  const method = input.slice(0, 10)
  const toAddress = input.slice(10, 74).replace(/^0{24}/, '0x')
  const amount = Number(`0x${input.slice(74)}`).toString(10)

  return {
    method,
    toAddress,
    amount,
  }
}
