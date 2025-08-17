import axios from 'axios'

// USDC on Base:
export const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

export async function getOneInchSwapTx({ fromAddress, toToken, usdcAmount }) {
  // usdcAmount is in human units (e.g., "10" USDC)
  const amountWei = Math.round(Number(usdcAmount) * 1e6) // USDC 6dp

  const url = `https://api.1inch.dev/swap/v5.2/base/swap`
  const { data } = await axios.get(url, {
    params: {
      fromTokenAddress: USDC_BASE,
      toTokenAddress: toToken,
      amount: amountWei,
      fromAddress,
      slippage: 1,
      disableEstimate: false,
    },
    headers: { Authorization: `Bearer ${process.env.REACT_APP_1INCH_KEY}` },
  })
  return data // contains tx data you can send with wallet
}
