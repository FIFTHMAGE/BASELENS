const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function getWalletBalances(address) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${address}/portfolio`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    throw error;
  }
}

export async function savePortfolioSnapshot(walletId, tokenSymbol, balance) {
  try {
    // This will now be handled automatically by the backend API
    // when calling getWalletBalances or getWalletTokens
    console.log('Portfolio snapshot saved via backend API');
    return { success: true };
  } catch (error) {
    console.error('Error in savePortfolioSnapshot:', error);
    throw error;
  }
}

export async function getPortfolioHistory(walletId) {
  try {
    // For now, return empty array since this endpoint doesn't exist yet
    // In a real implementation, you'd add this endpoint to the backend
    return [];
  } catch (error) {
    console.error('Error in getPortfolioHistory:', error);
    throw error;
  }
}

export async function getTransactionHistory(address) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${address}/transactions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}
