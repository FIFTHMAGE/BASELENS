import React, { useState, useEffect } from 'react';
import { saveWallet, getWalletsByUserId } from '../lib/walletService';

export default function Profile() {
  const [basename, setBasename] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock user ID - replace with actual user authentication
  const userId = 'mock-user-id';

  useEffect(() => {
    loadUserWallets();
  }, []);

  const loadUserWallets = async () => {
    try {
      const userWallets = await getWalletsByUserId(userId);
      setWallets(userWallets || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  const handleSaveWallet = async (e) => {
    e.preventDefault();
    
    if (!basename || !walletAddress) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await saveWallet(userId, walletAddress, basename);
      setMessage('Wallet saved successfully!');
      setBasename('');
      setWalletAddress('');
      loadUserWallets(); // Reload the wallet list
    } catch (error) {
      setMessage('Error saving wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        // Implement delete functionality
        console.log('Deleting wallet:', walletId);
        loadUserWallets(); // Reload the list
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Wallet */}
        <div>
          <h2 className="text-xl font-bold mb-4">Add New Wallet</h2>
          <form onSubmit={handleSaveWallet} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Basename</label>
              <input
                type="text"
                value={basename}
                onChange={(e) => setBasename(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="My Wallet"
                required
              />
            </div>
            
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
            
            {message && (
              <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
            >
              {loading ? 'Saving...' : 'Save Wallet'}
            </button>
          </form>
        </div>

        {/* Existing Wallets */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Wallets</h2>
          {wallets.length === 0 ? (
            <p className="text-gray-500">No wallets added yet.</p>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-4 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{wallet.basename}</div>
                      <div className="text-sm text-gray-500 font-mono">{wallet.address}</div>
                      <div className="text-xs text-gray-400">Added: {new Date(wallet.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <input
              type="text"
              value={userId}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Wallets</label>
            <input
              type="text"
              value={wallets.length}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
