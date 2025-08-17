import axios from 'axios'
const API = 'https://api.basescan.org/api'

export async function getRecentTokenTx(address) {
  try {
    const { data } = await axios.get(API, {
      params: {
        module: 'account',
        action: 'tokentx',
        address,
        sort: 'desc',
        apikey: process.env.REACT_APP_BASESCAN_KEY,
      },
    })
    return Array.isArray(data?.result) ? data.result : []
  } catch (e) {
    console.error('BaseScan error:', e?.response?.data || e.message)
    return []
  }
}
