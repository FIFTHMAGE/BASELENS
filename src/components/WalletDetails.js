import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function WalletDetails({ walletAddress, onClose }) {
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Helper function to format numbers with proper decimals
  const formatBalance = (value, decimals = 8) => {
    // Handle edge cases
    if (!value || value === '0' || value === '0.00000000' || value === '0.000000') {
      return `0.${'0'.repeat(decimals)}`
    }
    
    // Check if value is a valid number
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      console.warn('⚠️ formatBalance received invalid value:', value, 'Type:', typeof value)
      return `0.${'0'.repeat(decimals)}`
    }
    
    return numValue.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    })
  }

  // Memoize fetchWalletData to avoid dependency issues
  const fetchWalletData = useCallback(async () => {
    setLoading(true)
    setError('')
    
      // Check if Etherscan API key is available
  if (!process.env.REACT_APP_ETHERSCAN_KEY || typeof process.env.REACT_APP_ETHERSCAN_KEY !== 'string' || process.env.REACT_APP_ETHERSCAN_KEY.trim() === '') {
    console.error('❌ Etherscan API key is missing or invalid!')
    setError('Etherscan API key is not configured or invalid. Please check your environment variables.')
    setLoading(false)
    return
  }
  
  console.log('🔑 API Key check:', {
    keyExists: !!process.env.REACT_APP_ETHERSCAN_KEY,
    keyLength: process.env.REACT_APP_ETHERSCAN_KEY?.length,
    keyPreview: process.env.REACT_APP_ETHERSCAN_KEY?.substring(0, 10) + '...',
    keyType: typeof process.env.REACT_APP_ETHERSCAN_KEY
  })
    
    try {
      // Fetch ETH balance using Etherscan API v2 (supports Base chain)
      console.log('📡 Fetching ETH balance for:', walletAddress)
      let balanceResponse
      try {
        balanceResponse = await axios.get('https://api.etherscan.io/v2/api', {
          params: {
            chainid: 8453, // Base Mainnet
            module: 'account',
            action: 'balance',
            address: walletAddress,
            tag: 'latest',
            apikey: process.env.REACT_APP_ETHERSCAN_KEY,
          }
        })
      } catch (err) {
        console.warn('⚠️ Error fetching ETH balance:', err)
        balanceResponse = { data: { status: '0', message: 'Network error', result: null } }
      }
      
      // Check if balance response is valid
      if (balanceResponse.data?.status !== '1') {
        console.warn('⚠️ ETH balance API warning:', balanceResponse.data?.message || 'Unknown error')
        // Don't throw error, just log warning and continue with null value
      }

      // Fetch WETH balance using Etherscan API v2
      let wethResponse
      try {
        wethResponse = await axios.get('https://api.etherscan.io/v2/api', {
          params: {
            chainid: 8453, // Base Mainnet
            module: 'account',
            action: 'tokenbalance',
            address: walletAddress,
            contractaddress: '0x4200000000000000000000000000000000000006', // WETH on Base
            tag: 'latest',
            apikey: process.env.REACT_APP_ETHERSCAN_KEY,
          }
        })
      } catch (err) {
        console.warn('⚠️ Error fetching WETH balance:', err)
        wethResponse = { data: { status: '0', message: 'Network error', result: null } }
      }

      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))

      // Fetch USDC balance using Etherscan API v2
      let usdcResponse
      try {
        usdcResponse = await axios.get('https://api.etherscan.io/v2/api', {
          params: {
            chainid: 8453, // Base Mainnet
            module: 'account',
            action: 'tokenbalance',
            address: walletAddress,
            contractaddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
            tag: 'latest',
            apikey: process.env.REACT_APP_ETHERSCAN_KEY,
          }
        })
      } catch (err) {
        console.warn('⚠️ Error fetching USDC balance:', err)
        usdcResponse = { data: { status: '0', message: 'Network error', result: null } }
      }

      // Log API response statuses for debugging
      console.log('📊 API Response Statuses:', {
        eth: balanceResponse.data?.status,
        weth: wethResponse.data?.status,
        usdc: usdcResponse.data?.status
      })

      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))

      // Fetch recent transactions using Etherscan API v2
      let txsResponse
      try {
        txsResponse = await axios.get('https://api.etherscan.io/v2/api', {
          params: {
            chainid: 8453, // Base Mainnet
            module: 'account',
            action: 'txlist',
            address: walletAddress,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 1,
            sort: 'desc',
            apikey: process.env.REACT_APP_ETHERSCAN_KEY,
          }
        })
      } catch (err) {
        console.warn('⚠️ Error fetching transactions:', err)
        txsResponse = { data: { status: '0', result: [] } }
      }

      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))

      // Fetch token transfers using Etherscan API v2
      let tokenTxsResponse
      try {
        tokenTxsResponse = await axios.get('https://api.etherscan.io/v2/api', {
          params: {
            chainid: 8453, // Base Mainnet
            module: 'account',
            action: 'tokentx',
            address: walletAddress,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: 'desc',
            apikey: process.env.REACT_APP_ETHERSCAN_KEY,
          }
        })
      } catch (err) {
        console.warn('⚠️ Error fetching token transfers:', err)
        tokenTxsResponse = { data: { status: '0', result: [] } }
      }

      // Debug API responses
      console.log('=== API Response Debug ===')
      console.log('Balance response:', balanceResponse.data)
      console.log('WETH response:', wethResponse.data)
      console.log('USDC response:', usdcResponse.data)
      console.log('Transactions response:', txsResponse.data)
      console.log('Token transfers response:', tokenTxsResponse.data)
      console.log('Token transfers result type:', typeof tokenTxsResponse.data?.result)
      console.log('Token transfers result is array:', Array.isArray(tokenTxsResponse.data?.result))
      console.log('================================')
      
      // Validate API response structure
      if (!balanceResponse.data || !wethResponse.data || !usdcResponse.data) {
        console.error('❌ Invalid API response structure')
        throw new Error('Invalid API response structure')
      }

      // Validate and calculate balances with better error handling
      const ethBalanceWei = balanceResponse.data?.status === '1' && balanceResponse.data.result && balanceResponse.data.result !== '' && !balanceResponse.data.result.includes('rate limit') ? balanceResponse.data.result : null
      const wethBalanceWei = wethResponse.data?.status === '1' && wethResponse.data.result && wethResponse.data.result !== '' && !wethResponse.data.result.includes('rate limit') ? wethResponse.data.result : null
      const usdcBalanceWei = usdcResponse.data?.status === '1' && usdcResponse.data.result && usdcResponse.data.result !== '' && !usdcResponse.data.result.includes('rate limit') ? usdcResponse.data.result : null
      
      console.log('💰 Raw balance values:', {
        ethWei: ethBalanceWei,
        wethWei: wethBalanceWei,
        usdcWei: usdcBalanceWei
      })
      
      // Helper function to safely parse and format balance
      const safeParseBalance = (value, decimals, divisor) => {
        if (!value || value === '0') {
          console.log(`🔍 safeParseBalance: ${value} -> 0.${'0'.repeat(decimals)}`)
          return `0.${'0'.repeat(decimals)}`
        }
        
        // Check if the value is a valid number string
        if (isNaN(parseInt(value))) {
          console.warn('⚠️ Invalid balance value, using 0:', value, 'Type:', typeof value)
          return `0.${'0'.repeat(decimals)}`
        }
        
        const parsed = parseInt(value) / divisor
        const result = parsed.toFixed(decimals)
        console.log(`🔍 safeParseBalance: ${value} -> ${parsed} -> ${result}`)
        return result
      }
      
      // Parse balances with error handling
      let ethBalance, wethBalance, usdcBalance
      
      try {
        ethBalance = safeParseBalance(ethBalanceWei, 8, 1e18)
        if (!ethBalance || ethBalance.includes('NaN') || ethBalance.includes('undefined')) {
          console.warn('⚠️ ETH balance parsing resulted in invalid value:', ethBalance)
          ethBalance = '0.00000000'
        }
      } catch (err) {
        console.warn('⚠️ Error parsing ETH balance:', err)
        ethBalance = '0.00000000'
      }
      
      try {
        wethBalance = safeParseBalance(wethBalanceWei, 8, 1e18)
        if (!wethBalance || wethBalance.includes('NaN') || wethBalance.includes('undefined')) {
          console.warn('⚠️ WETH balance parsing resulted in invalid value:', wethBalance)
          wethBalance = '0.00000000'
        }
      } catch (err) {
        console.warn('⚠️ Error parsing WETH balance:', err)
        wethBalance = '0.00000000'
      }
      
      try {
        usdcBalance = safeParseBalance(usdcBalanceWei, 6, 1e6)
        if (!usdcBalance || usdcBalance.includes('NaN') || usdcBalance.includes('undefined')) {
          console.warn('⚠️ USDC balance parsing resulted in invalid value:', usdcBalance)
          usdcBalance = '0.000000'
        }
      } catch (err) {
        console.warn('⚠️ Error parsing USDC balance:', err)
        usdcBalance = '0.000000'
      }
      
      const data = {
        address: walletAddress,
        ethBalance,
        wethBalance,
        usdcBalance,
        lastTx: (() => {
          try {
            if (txsResponse.data?.result?.[0]) {
              const tx = txsResponse.data.result[0]
              return {
                hash: tx.hash || null,
                timestamp: parseInt(tx.timeStamp) * 1000,
                value: (parseInt(tx.value) / 1e18).toFixed(6),
                gasUsed: tx.gasUsed || '0',
                gasPrice: (parseInt(tx.gasPrice) / 1e9).toFixed(2)
              }
            }
            return null
          } catch (err) {
            console.warn('⚠️ Error parsing last transaction:', err)
            return null
          }
        })(),
        recentTokenTxs: (() => {
          try {
            if (Array.isArray(tokenTxsResponse.data?.result)) {
              return tokenTxsResponse.data.result
            }
            return []
          } catch (err) {
            console.warn('⚠️ Error parsing recent token transfers:', err)
            return []
          }
        })()
      }

      console.log('Final data object:', data)
      
      // Validate the data object before setting state
      if (data.ethBalance && data.wethBalance && data.usdcBalance) {
        console.log('✅ All balance values are valid')
      } else {
        console.warn('⚠️ Some balance values are missing or invalid:', {
          ethBalance: data.ethBalance,
          wethBalance: data.wethBalance,
          usdcBalance: data.usdcBalance
        })
      }
      
      // Additional validation to ensure all required fields are present
      if (!data.address || typeof data.address !== 'string') {
        console.error('❌ Data validation failed: missing or invalid address')
        setError('Data validation failed. Please try again.')
        setLoading(false)
        return
      }
      
      // Ensure all balance values are valid strings
      if (typeof data.ethBalance !== 'string' || typeof data.wethBalance !== 'string' || typeof data.usdcBalance !== 'string') {
        console.error('❌ Data validation failed: invalid balance types')
        setError('Data validation failed. Please try again.')
        setLoading(false)
        return
      }
      
      console.log('✅ Data validation passed, setting wallet data')
      setWalletData(data)
    } catch (err) {
      console.error('Error fetching wallet data:', err)
      setError('Failed to fetch wallet data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  // Call fetchWalletData when component mounts or walletAddress changes
  useEffect(() => {
    if (walletAddress && typeof walletAddress === 'string' && walletAddress.trim() !== '') {
      // Basic Ethereum address validation
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
      if (ethAddressRegex.test(walletAddress)) {
        console.log('🔄 Fetching data for wallet:', walletAddress)
        fetchWalletData()
      } else {
        console.warn('⚠️ Invalid Ethereum address format:', walletAddress)
        setError('Invalid Ethereum address format. Please provide a valid 0x-prefixed address.')
        setLoading(false)
      }
    } else {
      console.warn('⚠️ Invalid wallet address:', walletAddress)
      setError('Invalid wallet address provided')
      setLoading(false)
    }
  }, [walletAddress, fetchWalletData])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading wallet data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Wallet Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => {
              try {
                fetchWalletData()
              } catch (err) {
                console.error('❌ Error retrying:', err)
                setError('Failed to retry. Please try again.')
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!walletData || typeof walletData !== 'object') {
    console.warn('⚠️ walletData is invalid:', walletData)
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Wallet Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {/* Wallet Address */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
            {walletData.address && typeof walletData.address === 'string' ? walletData.address : 'Invalid Address'}
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">ETH Balance</h3>
            <div className="text-2xl font-bold text-blue-600">
              {walletData.ethBalance && typeof walletData.ethBalance === 'string' ? 
                formatBalance(walletData.ethBalance, 8) : '0.00000000'} ETH
            </div>
            <div className="text-sm text-blue-600 mt-1">Native Base ETH</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-800">WETH Balance</h3>
            <div className="text-2xl font-bold text-green-600">
              {walletData.wethBalance && typeof walletData.wethBalance === 'string' ? 
                formatBalance(walletData.wethBalance, 8) : '0.00000000'} WETH
            </div>
            <div className="text-sm text-green-600 mt-1">Wrapped ETH on Base</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-800">USDC Balance</h3>
            <div className="text-2xl font-bold text-purple-600">
              {walletData.usdcBalance && typeof walletData.usdcBalance === 'string' ? 
                formatBalance(walletData.usdcBalance, 6) : '0.000000'} USDC
            </div>
            <div className="text-sm text-purple-600 mt-1">USD Coin on Base</div>
          </div>
        </div>

                {/* Last Transaction */}
        {walletData.lastTx && walletData.lastTx.hash && walletData.lastTx.timestamp && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Last Transaction</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                 <div>
                   <div className="font-medium text-gray-600">Hash</div>
                   <div className="font-mono break-all">{walletData.lastTx.hash?.slice(0, 10) || 'Unknown'}...</div>
                 </div>
                <div>
                  <div className="font-medium text-gray-600">Date</div>
                  <div>{walletData.lastTx.timestamp && !isNaN(walletData.lastTx.timestamp) ? 
                    new Date(walletData.lastTx.timestamp).toLocaleString() : 'Unknown'}</div>
                 </div>
                                 <div>
                   <div className="font-medium text-gray-600">Value</div>
                   <div>{walletData.lastTx.value && typeof walletData.lastTx.value === 'string' ? 
                     formatBalance(walletData.lastTx.value, 8) : '0.00000000'} ETH</div>
                 </div>
                <div>
                  <div className="font-medium text-gray-600">Gas Used</div>
                  <div>{walletData.lastTx.gasUsed || 'Unknown'}</div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Token Transfers */}
        {Array.isArray(walletData.recentTokenTxs) && walletData.recentTokenTxs.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recent Token Transfers</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Token</th>
                    <th className="p-3 text-left text-sm font-medium">Value</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                  </tr>
                </thead>
                                 <tbody>
                   {Array.isArray(walletData.recentTokenTxs) ? walletData.recentTokenTxs.slice(0, 5).map((tx, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3 text-sm">
                        <div className="font-medium">{tx.tokenSymbol && typeof tx.tokenSymbol === 'string' ? tx.tokenSymbol : 'Unknown'}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {tx.contractAddress && typeof tx.contractAddress === 'string' ? 
                            tx.contractAddress.slice(0, 8) + '...' : 'Unknown'}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {(() => {
                          try {
                            if (tx.value && tx.tokenDecimal) {
                              const value = parseInt(tx.value)
                              const decimals = parseInt(tx.tokenDecimal) || 18
                              if (!isNaN(value) && !isNaN(decimals)) {
                                return (value / Math.pow(10, decimals)).toFixed(4)
                              }
                            }
                            return '0.0000'
                          } catch (err) {
                            console.warn('⚠️ Error parsing token transfer value:', err)
                            return '0.0000'
                          }
                        })()}
                      </td>
                      <td className="p-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.to && typeof tx.to === 'string' && tx.to.toLowerCase() === walletAddress.toLowerCase() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.to && typeof tx.to === 'string' && tx.to.toLowerCase() === walletAddress.toLowerCase() ? 'Received' : 'Sent'}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        {(() => {
                          try {
                            if (tx.timeStamp) {
                              const timestamp = parseInt(tx.timeStamp)
                              if (!isNaN(timestamp)) {
                                return new Date(timestamp * 1000).toLocaleDateString()
                              }
                            }
                            return 'Unknown'
                          } catch (err) {
                            console.warn('⚠️ Error parsing token transfer timestamp:', err)
                            return 'Unknown'
                          }
                        })()}
                      </td>
                                         </tr>
                   )) : (
                     <tr>
                       <td colSpan="4" className="p-3 text-sm text-gray-500 text-center">
                         No token transfers found
                       </td>
                     </tr>
                   )}
                 </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recent Token Transfers</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
              No token transfers found for this wallet
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (walletData.address && typeof walletData.address === 'string') {
                window.open(`https://basescan.org/address/${walletData.address}`, '_blank')
              } else {
                console.warn('⚠️ Cannot open BaseScan: invalid address')
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!walletData.address || typeof walletData.address !== 'string'}
          >
            View on BaseScan
          </button>
          <button 
            onClick={() => {
              try {
                fetchWalletData()
              } catch (err) {
                console.error('❌ Error refreshing data:', err)
                setError('Failed to refresh data. Please try again.')
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
