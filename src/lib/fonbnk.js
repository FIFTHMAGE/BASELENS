import axios from 'axios'

const BASE = 'https://api.fonbnk.io'
const TIMEOUT = 10000 // 10 seconds timeout

// Create axios instance with timeout and retry logic
const fonbnkApi = axios.create({
  baseURL: BASE,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor for API key
fonbnkApi.interceptors.request.use((config) => {
  const apiKey = process.env.REACT_APP_FONBNK_KEY
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`
  }
  return config
})

// Add response interceptor for better error handling
fonbnkApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error connecting to Fonbnk API')
      throw new Error('Network error: Unable to connect to Fonbnk service. Please check your internet connection.')
    }
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Fonbnk API request timed out')
      throw new Error('Request timed out: Fonbnk service is taking too long to respond.')
    }
    if (error.response?.status === 401) {
      console.error('🔑 Unauthorized: Invalid Fonbnk API key')
      throw new Error('Authentication failed: Please check your Fonbnk API key configuration.')
    }
    if (error.response?.status === 403) {
      console.error('🚫 Forbidden: Insufficient permissions')
      throw new Error('Access denied: Your API key does not have sufficient permissions.')
    }
    if (error.response?.status >= 500) {
      console.error('🔧 Fonbnk service error:', error.response.status)
      throw new Error('Fonbnk service is currently experiencing issues. Please try again later.')
    }
    throw error
  }
)

// Validate API key format
export function validateApiKey() {
  const apiKey = process.env.REACT_APP_FONBNK_KEY
  if (!apiKey) {
    return { valid: false, error: 'API key is not configured' }
  }
  if (typeof apiKey !== 'string') {
    return { valid: false, error: 'API key must be a string' }
  }
  if (apiKey.trim() === '') {
    return { valid: false, error: 'API key cannot be empty' }
  }
  if (apiKey.length < 10) {
    return { valid: false, error: 'API key appears to be too short' }
  }
  return { valid: true, apiKey: apiKey.substring(0, 10) + '...' }
}

export async function initiateOnramp({ phoneNumber, walletAddress, amount }) {
  try {
    // Validate inputs
    if (!phoneNumber || !walletAddress || !amount) {
      throw new Error('Missing required parameters: phoneNumber, walletAddress, and amount are required')
    }

    // Validate API key
    const keyValidation = validateApiKey()
    if (!keyValidation.valid) {
      throw new Error(`API key validation failed: ${keyValidation.error}`)
    }

    console.log('🚀 Initiating Fonbnk onramp:', {
      phoneNumber,
      walletAddress: walletAddress.slice(0, 10) + '...',
      amount,
      token: 'USDC',
      chain: 'BASE',
      apiKey: keyValidation.apiKey
    })

    const res = await fonbnkApi.post('/transactions/initiate', {
      phoneNumber,
      walletAddress,
      amount,
      token: 'USDC',
      chain: 'BASE',
    })

    console.log('✅ Fonbnk onramp initiated successfully:', res.data)
    return res.data
  } catch (e) {
    console.error('❌ Fonbnk onramp failed:', e)
    throw e
  }
}

// Health check function to test API connectivity
export async function checkFonbnkHealth() {
  try {
    // First validate API key
    const keyValidation = validateApiKey()
    if (!keyValidation.valid) {
      return { status: 'invalid_key', error: keyValidation.error }
    }

    const response = await fonbnkApi.get('/health', { timeout: 5000 })
    return { status: 'healthy', data: response.data }
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return { status: 'unreachable', error: 'Network error' }
    }
    if (error.code === 'ECONNABORTED') {
      return { status: 'timeout', error: 'Request timed out' }
    }
    if (error.response?.status === 401) {
      return { status: 'unauthorized', error: 'Invalid API key' }
    }
    if (error.response?.status === 403) {
      return { status: 'forbidden', error: 'Insufficient permissions' }
    }
    return { status: 'error', error: error.message }
  }
}

// Get supported countries/regions
export async function getSupportedRegions() {
  try {
    const response = await fonbnkApi.get('/regions', { timeout: 5000 })
    return response.data
  } catch (error) {
    console.error('Failed to fetch supported regions:', error)
    return []
  }
}

// Get transaction status
export async function getTransactionStatus(transactionId) {
  try {
    const response = await fonbnkApi.get(`/transactions/${transactionId}`, { timeout: 5000 })
    return response.data
  } catch (error) {
    console.error('Failed to fetch transaction status:', error)
    throw error
  }
}
