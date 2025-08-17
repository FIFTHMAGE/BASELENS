const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function getSwapQuote(sellToken, buyToken, amount, walletAddress) {
  try {
    const response = await fetch(`${API_BASE_URL}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromToken: sellToken,
        toToken: buyToken,
        amount: amount,
        walletAddress: walletAddress,
        slippage: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const quote = await response.json();
    return quote;
  } catch (error) {
    console.error('Error getting swap quote:', error);
    throw error;
  }
}

export async function executeSwap(quote, walletAddress, privateKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/swap/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId: quote.quoteId || quote.id,
        walletAddress: walletAddress,
        privateKey: privateKey
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const swapData = await response.json();
    return swapData;
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
}

export async function getSwapHistory(walletAddress) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${walletAddress}/transactions?type=swap`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching swap history:', error);
    throw error;
  }
}
