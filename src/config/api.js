// API Configuration
const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:5000',
    timeout: 30000
  },
  // Production (update this when you deploy)
  production: {
    baseURL: 'https://your-domain.com',
    timeout: 30000
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export const API_BASE_URL = API_CONFIG[env].baseURL;
export const API_TIMEOUT = API_CONFIG[env].timeout;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  FONBNK_ONRAMP: 'fonbnk/onramp',
  FONBNK_SESSION: (sessionId) => `fonbnk/onramp/${sessionId}`,
  FONBNK_HISTORY: (walletAddress) => `fonbnk/history/${walletAddress}`,
  WALLETS_TRACK: 'wallets/track',
  WALLETS_TOKENS: (address) => `wallets/${address}/tokens`
};

export default API_CONFIG;
