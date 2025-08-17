const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function saveWallet(userId, address, basename) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_address: address,
        basename,
        user_id: userId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving wallet:', error);
    throw error;
  }
}

export async function getWalletsByUserId(userId) {
  try {
    // For now, we'll use a mock response since the backend doesn't have this endpoint yet
    // In a real implementation, you'd add this endpoint to the backend
    const response = await fetch(`${API_BASE_URL}/wallets/user/${userId}`);
    
    if (!response.ok) {
      // Fallback to mock data for development
      return [
        {
          id: 'mock-1',
          user_id: userId,
          address: '0x1234567890123456789012345678901234567890',
          basename: 'My Wallet',
          created_at: new Date().toISOString()
        }
      ];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading wallets:', error);
    // Return mock data for development
    return [
      {
        id: 'mock-1',
        user_id: userId,
        address: '0x1234567890123456789012345678901234567890',
        basename: 'My Wallet',
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function getWalletByAddress(address) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${address}/tokens`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting wallet by address:', error);
    throw error;
  }
}

export async function deleteWallet(walletId) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${walletId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}
