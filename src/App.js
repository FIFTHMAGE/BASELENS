import { useState } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import Onramp from './components/Onramp'
import Swap from './components/Swap'
import Track from './components/Track'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 border-b bg-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Base MiniApp</h1>
              <nav className="text-sm flex gap-3">
                <Link to="/buy">Buy</Link>
                <Link to="/swap">Swap</Link>
                <Link to="/track">Track</Link>
              </nav>
            </div>
            <Login setUser={setUser} />
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 space-y-6">
          {!user ? (
            <div className="p-6 rounded-2xl bg-white shadow">Connect your wallet to begin.</div>
          ) : (
            <Routes>
              <Route path="/" element={<div className="p-6 rounded-2xl bg-white shadow">Choose a tab above.</div>} />
              <Route path="/buy" element={<Onramp />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/track" element={<Track user={user} />} />
            </Routes>
          )}
        </main>
      </div>
    </HashRouter>
  )
}
