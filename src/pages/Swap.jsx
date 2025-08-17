import React, { useState } from 'react';
import { getSwapQuote, executeSwap } from '../lib/swapService';

export default function Swap() {
  const [sellToken, setSellToken] = useState('USDC');
  const [buyToken, setBuyToken] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetQuote = async () => {
    if (!buyToken || !amount || !walletAddress) {
      alert('Please fill in all fields including wallet address');
      return;
    }
    
    setLoading(true);
    try {
      const quoteData = await getSwapQuote(sellToken, buyToken, amount, walletAddress);
      setQuote(quoteData);
    } catch (error) {
      console.error('Error getting quote:', error);
      alert('Error getting swap quote: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote) return;
    
    setLoading(true);
    try {
      const result = await executeSwap(quote, walletAddress, 'private_key_placeholder');
      console.log('Swap result:', result);
      alert('Swap executed successfully! Transaction Hash: ' + (result.txHash || 'Pending'));
      setQuote(null); // Clear quote after successful swap
    } catch (error) {
      console.error('Error executing swap:', error);
      alert('Error executing swap: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Swap Tokens</h1>
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sell Token</label>
          <input
            type="text"
            value={sellToken}
            onChange={(e) => setSellToken(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="USDC"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Buy Token Address</label>
          <input
            type="text"
            value={buyToken}
            onChange={(e) => setBuyToken(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="1000000"
          />
        </div>
        
        <button
          onClick={handleGetQuote}
          disabled={loading || !buyToken || !amount || !walletAddress}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Get Quote'}
        </button>
        
        {quote && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">Quote Received</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(quote, null, 2)}</pre>
            <button
              onClick={handleSwap}
              disabled={loading}
              className="w-full mt-2 bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
            >
              {loading ? 'Executing...' : 'Execute Swap'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
