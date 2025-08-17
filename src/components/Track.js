import { useEffect, useState, useCallback } from 'react'
import { getRecentTokenTx } from '../lib/basescan'
import { addTrackedWallet, getTrackedWallets, supabase, testDatabaseSchema } from '../lib/supabase'
import WalletDetails from './WalletDetails'

export default function Track({ user }) {
  const [inputWallet, setInputWallet] = useState('')
  const [tracked, setTracked] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')
  const [selectedWallet, setSelectedWallet] = useState(null)

  const refreshTracked = useCallback(async () => {
    if (user?.id) {
      setDebug(`Refreshing tracked wallets for user: ${user.id}`)
      try {
        const rows = await getTrackedWallets(user.id)
        setDebug(`Got ${rows?.length || 0} tracked wallets`)
        setTracked(rows || [])
      } catch (err) {
        setError(`Failed to get tracked wallets: ${err.message}`)
        setDebug(`Error: ${err.message}`)
      }
    } else {
      setDebug('No user ID available')
    }
  }, [user?.id])

  useEffect(() => { refreshTracked() }, [refreshTracked])

  async function handleAddTrack() {
    if (!inputWallet) return
    if (!user?.id) {
      setError('No user ID available. Please connect wallet first.')
      return
    }

    setError('')
    setDebug(`Adding wallet: ${inputWallet} for user: ${user.id}`)
    
    try {
      console.log('=== Adding Tracked Wallet ===')
      console.log('User ID:', user.id)
      console.log('Wallet Address:', inputWallet)
      console.log('Supabase client available:', !!supabase)
      
      const result = await addTrackedWallet(user.id, inputWallet)
      console.log('Add result:', result)
      setDebug(`Add result: ${JSON.stringify(result)}`)
      
      if (result) {
        await refreshTracked()
        setInputWallet('')
        setDebug('Wallet added successfully')
      } else {
        setError('Failed to add wallet - no result returned')
      }
    } catch (err) {
      console.error('Add wallet error:', err)
      setError(`Failed to add wallet: ${err.message}`)
      setDebug(`Error: ${err.message}`)
    }
  }

  async function handleInspect(addr) {
    setSelectedWallet(addr)
  }

  async function handleShowTransactions(addr) {
    setLoading(true)
    setError('')
    try {
      const txs = await getRecentTokenTx(addr)
      setRecent(txs.slice(0, 12)) // latest 12 token transfers
      setDebug(`Got ${txs.length} transactions for ${addr}`)
    } catch (err) {
      setError(`Failed to get transactions: ${err.message}`)
      setDebug(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-4">
      <h2 className="text-lg font-semibold">Track Wallets (Base)</h2>
      
      {/* Debug Info */}
      <div className="p-3 bg-gray-100 rounded text-xs">
        <div><strong>User ID:</strong> {user?.id || 'Not connected'}</div>
        <div><strong>Debug:</strong> {debug}</div>
        {error && <div className="text-red-500"><strong>Error:</strong> {error}</div>}
        <button 
          onClick={() => testDatabaseSchema()} 
          className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Database Schema
        </button>
      </div>

      <div className="flex gap-2">
        <input 
          className="border rounded p-2 flex-1" 
          placeholder="0x... wallet to track" 
          value={inputWallet} 
          onChange={e => setInputWallet(e.target.value)} 
        />
        <button 
          onClick={handleAddTrack} 
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={!user?.id}
        >
          Add
        </button>
      </div>

      <div>
        <h3 className="font-medium mb-2">Your Tracked Wallets ({tracked.length})</h3>
        <div className="flex flex-wrap gap-2">
          {tracked.map(row => (
            <div key={row.id} className="flex gap-1">
              <button 
                onClick={() => handleInspect(row.tracked_wallet)} 
                className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
                title="View wallet details"
              >
                {row.tracked_wallet.slice(0,6)}…{row.tracked_wallet.slice(-4)}
              </button>
              <button 
                onClick={() => handleShowTransactions(row.tracked_wallet)} 
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs"
                title="Show transactions"
              >
                📊
              </button>
            </div>
          ))}
          {tracked.length === 0 && (
            <div className="text-gray-500 text-sm">No wallets tracked yet</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Recent Token Transfers {loading && '(loading...)'}</h3>
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Token</th>
                <th className="p-2">Value (raw)</th>
                <th className="p-2">From → To</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{t.tokenSymbol}</td>
                  <td className="p-2">{t.value}</td>
                  <td className="p-2">{t.from.slice(0,6)}… → {t.to.slice(0,6)}…</td>
                  <td className="p-2">{new Date(Number(t.timeStamp)*1000).toLocaleString()}</td>
                </tr>
              ))}
              {!recent.length && !loading && (
                <tr><td className="p-2 text-gray-500" colSpan={4}>Select a wallet above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Details Modal */}
      {selectedWallet && (
        <WalletDetails 
          walletAddress={selectedWallet} 
          onClose={() => setSelectedWallet(null)} 
        />
      )}
    </div>
  )
}
