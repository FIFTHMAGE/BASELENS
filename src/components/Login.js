import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { upsertUser } from '../lib/supabase'

export default function Login({ setUser }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [error, setError] = useState('')

  useEffect(() => {
    if (isConnected && address) {
      upsertUser(address).then(setUser)
    }
  }, [isConnected, address, setUser])

  const handleConnect = async () => {
    try {
      setError('')
      // Get the first available connector (usually injected/metamask)
      const connector = connectors[0]
      if (connector) {
        await connect({ connector })
      } else {
        setError('No wallet connectors available')
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError('Failed to connect wallet: ' + err.message)
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button 
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" 
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" 
        onClick={handleConnect}
        disabled={isPending}
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <div className="text-red-500 text-sm text-center max-w-xs">
          {error}
        </div>
      )}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        Make sure you have MetaMask or another wallet installed
      </div>
    </div>
  )
}
