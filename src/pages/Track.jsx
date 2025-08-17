import React, { useState, useEffect } from 'react';
import { getWalletBalances, savePortfolioSnapshot, getPortfolioHistory } from '../lib/portfolioService';
import { getWalletsByUserId } from '../lib/walletService';

export default function Track() {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [balances, setBalances] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock user ID - replace with actual user authentication
  const userId = 'mock-user-id';

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const userWallets = await getWalletsByUserId(userId);
      setWallets(userWallets || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  const handleTrackWallet = async (address) => {
    setLoading(true);
    try {
      const balanceData = await getWalletBalances(address);
      setBalances(balanceData);
      setSelectedWallet(address);
      
      // Save portfolio snapshot
      if (balanceData.data && balanceData.data.items) {
        for (const item of balanceData.data.items) {
          await savePortfolioSnapshot(
            'wallet-id', // Replace with actual wallet ID
            item.contract_ticker_symbol,
            item.balance
          );
        }
      }
      
      // Load portfolio history
      const history = await getPortfolioHistory('wallet-id'); // Replace with actual wallet ID
      setPortfolioHistory(history || []);
    } catch (error) {
      console.error('Error tracking wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Track Wallets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Wallets</h2>
          {wallets.length === 0 ? (
            <p className="text-gray-500">No wallets found. Add a wallet in your profile.</p>
          ) : (
            <div className="space-y-2">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTrackWallet(wallet.address)}
                >
                  <div className="font-medium">{wallet.basename || 'Unnamed Wallet'}</div>
                  <div className="text-sm text-gray-500">{wallet.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Display */}
        <div>
          <h2 className="text-xl font-bold mb-4">Portfolio</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : selectedWallet && balances ? (
            <div>
              <h3 className="font-medium mb-2">Wallet: {selectedWallet}</h3>
              {balances.data && balances.data.items ? (
                <div className="space-y-2">
                  {balances.data.items.map((item, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.contract_ticker_symbol}</span>
                        <span>{parseFloat(item.balance).toFixed(6)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ${parseFloat(item.quote || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No balance data available</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a wallet to view portfolio</p>
          )}
        </div>
      </div>

      {/* Portfolio History */}
      {portfolioHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Portfolio History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Token</th>
                  <th className="border p-2 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {portfolioHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="border p-2">
                      {new Date(record.recorded_at).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{record.token_symbol}</td>
                    <td className="border p-2">{record.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
