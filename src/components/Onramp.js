import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { buildApiUrl, API_ENDPOINTS } from '../config/api'

export default function Onramp() {
  const { address, isConnected } = useAccount()
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [sessionStatus, setSessionStatus] = useState('')

  const validateInputs = () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return false
    }
    if (!phone.trim()) {
      setError('Please enter a valid phone number')
      return false
    }
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    return true
  }

  const formatPhoneNumber = (phone) => {
    // Basic phone number formatting
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 0) return ''
    if (cleaned.length <= 3) return `+${cleaned}`
    if (cleaned.length <= 6) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value)
    }
  }

  async function handleOnramp() {
    setError('')
    setSuccess('')
    setSessionId('')
    setSessionStatus('')
    
    if (!validateInputs()) return

    setLoading(true)
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.FONBNK_ONRAMP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone.trim(),
          walletAddress: address,
          amount: parseFloat(amount),
          fiatCurrency: 'NGN', // Default to Nigerian Naira
          cryptoCurrency: 'USDC',
          network: 'BASE',
          metadata: {
            source: 'web-app',
            userAgent: navigator.userAgent
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate onramp')
      }

      setSessionId(data.sessionId)
      setSessionStatus(data.status)
      setSuccess('Onramp initiated successfully! Check your phone for further instructions.')
      console.log('Onramp response:', data)
      
      // Clear form on success
      setPhone('')
      setAmount('')
      
      // Start polling for status updates
      if (data.sessionId) {
        pollSessionStatus(data.sessionId)
      }
    } catch (e) {
      setError(e.message || 'Onramp failed. Please try again.')
      console.error('Onramp error:', e)
    } finally {
      setLoading(false)
    }
  }

  const pollSessionStatus = async (sessionId) => {
    const maxAttempts = 30 // Poll for up to 5 minutes (10 second intervals)
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        console.log('Stopped polling session status')
        return
      }

      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.FONBNK_SESSION(sessionId)))
        const data = await response.json()

        if (response.ok && data.session) {
          setSessionStatus(data.session.status)
          
          if (data.session.status === 'completed') {
            setSuccess('🎉 USDC purchase completed successfully! Check your wallet.')
            return
          } else if (data.session.status === 'failed') {
            setError('❌ USDC purchase failed. Please try again.')
            return
          }
        }
      } catch (error) {
        console.error('Error polling session status:', error)
      }

      attempts++
      // Poll every 10 seconds
      setTimeout(poll, 10000)
    }

    poll()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'initiated': return 'text-blue-600'
      case 'pending': return 'text-yellow-600'
      case 'processing': return 'text-orange-600'
      case 'completed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'initiated': return 'Initiated'
      case 'pending': return 'Pending Payment'
      case 'processing': return 'Processing'
      case 'completed': return 'Completed'
      case 'failed': return 'Failed'
      default: return 'Unknown'
    }
  }

  if (!isConnected) {
    return (
      <div className="p-6 rounded-2xl shadow bg-white space-y-4 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-gray-700">Connect Your Wallet</h2>
        <p className="text-gray-500">Please connect your wallet to start buying USDC</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl shadow bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Buy USDC with Fonbnk</h2>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Server Integration</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {sessionId && sessionStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm">
                <strong>Session ID:</strong> {sessionId.slice(0, 8)}...
              </p>
              <p className="text-blue-600 text-xs">
                Status: <span className={`font-medium ${getStatusColor(sessionStatus)}`}>
                  {getStatusText(sessionStatus)}
                </span>
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              sessionStatus === 'completed' ? 'bg-green-500' :
              sessionStatus === 'failed' ? 'bg-red-500' :
              sessionStatus === 'processing' ? 'bg-orange-500' :
              'bg-blue-500'
            }`}></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input 
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+234 801 234 5678"
            value={phone}
            onChange={handlePhoneChange}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Enter your phone number to receive USDC</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (NGN)
          </label>
          <input 
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="50000"
            value={amount}
            onChange={handleAmountChange}
            disabled={loading}
            type="text"
          />
          <p className="text-xs text-gray-500 mt-1">Enter the amount in Nigerian Naira you want to convert to USDC</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Wallet Address:</strong> {address?.slice(0, 10)}...{address?.slice(-8)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            USDC will be sent to this wallet address on Base network
          </p>
        </div>
      </div>

      <button 
        disabled={loading}
        onClick={handleOnramp} 
        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          'Start Onramp'
        )}
      </button>

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>Powered by Fonbnk - Convert airtime/fiat to USDC</p>
        <p>Network: Base • Token: USDC • Currency: NGN</p>
        <p className="text-blue-600">Secure server-to-server integration</p>
      </div>
    </div>
  )
}
