import React, { useState, useEffect } from 'react';
import TrackComponent from '../components/Track';

const Track = () => {
  const [portfolioStats] = useState({
    totalValue: '$24,567.89',
    change24h: '+$1,234.56',
    changePercent: '+5.28%',
    totalTokens: '8',
    totalWallets: '3'
  });

  const [topHoldings] = useState([
    { symbol: 'ETH', name: 'Ethereum', value: '$12,345.67', percentage: '50.2%', change: '+3.2%', icon: '🔷' },
    { symbol: 'USDC', name: 'USD Coin', value: '$8,901.23', percentage: '36.2%', change: '+0.0%', icon: '💵' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', value: '$2,345.67', percentage: '9.5%', change: '+2.1%', icon: '🟡' },
    { symbol: 'LINK', name: 'Chainlink', value: '$975.32', percentage: '4.0%', change: '+8.7%', icon: '🔗' }
  ]);

  const [recentTransactions] = useState([
    { type: 'buy', token: 'ETH', amount: '2.5', value: '$8,123.45', time: '2 hours ago', status: 'confirmed' },
    { type: 'swap', token: 'USDC → LINK', amount: '500', value: '$500.00', time: '1 day ago', status: 'confirmed' },
    { type: 'sell', token: 'WBTC', amount: '0.1', value: '$6,789.12', time: '2 days ago', status: 'confirmed' },
    { type: 'buy', token: 'USDC', amount: '1000', value: '$1,000.00', time: '3 days ago', status: 'confirmed' }
  ]);

  const [performanceData] = useState([
    { period: '1D', change: '+2.34%' },
    { period: '1W', change: '+8.76%' },
    { period: '1M', change: '+15.43%' },
    { period: '3M', change: '+28.91%' },
    { period: '1Y', change: '+67.23%' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Portfolio Tracker
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Monitor your DeFi portfolio performance across multiple wallets on Base network
          </p>
          
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-200">{portfolioStats.totalValue}</div>
              <div className="text-sm text-purple-100">Total Value</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-200">{portfolioStats.change24h}</div>
              <div className="text-sm text-green-100">24h Change</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{portfolioStats.changePercent}</div>
              <div className="text-sm text-blue-200">24h %</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-indigo-200">{portfolioStats.totalTokens}</div>
              <div className="text-sm text-indigo-100">Tokens</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-pink-200">{portfolioStats.totalWallets}</div>
              <div className="text-sm text-pink-100">Wallets</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Portfolio Interface */}
          <div className="lg:col-span-2">
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📊</span>
                  Portfolio Overview
                </h2>
                <p className="text-gray-600 mt-2">
                  Track your assets and performance across all connected wallets
                </p>
              </div>
              <div className="card-body">
                <TrackComponent />
              </div>
            </div>

            {/* Top Holdings */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Holdings</h3>
              <div className="space-y-3">
                {topHoldings.map((holding, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{holding.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{holding.symbol}</div>
                          <div className="text-sm text-gray-600">{holding.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{holding.value}</div>
                        <div className="text-sm text-gray-600">{holding.percentage}</div>
                        <div className={`text-sm ${holding.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Over Time</h3>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    {performanceData.map((data, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          index === 2 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {data.period}
                      </button>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">+15.43%</div>
                    <div className="text-sm text-gray-600">Last 30 days</div>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-lg font-medium">Performance Chart</div>
                    <div className="text-sm">Interactive chart coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          tx.type === 'buy' ? 'bg-green-100' : 
                          tx.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <span className={`text-sm font-bold ${
                            tx.type === 'buy' ? 'text-green-600' : 
                            tx.type === 'sell' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {tx.type === 'buy' ? 'B' : tx.type === 'sell' ? 'S' : '↔'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {tx.amount} {tx.token}
                          </div>
                          <div className="text-xs text-gray-500">{tx.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{tx.value}</div>
                        <span className="status-success">Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Insights */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Insights</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">+15.43%</div>
                    <div className="text-sm text-green-700">Portfolio Growth</div>
                    <div className="text-xs text-green-600">Last 30 days</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-lg font-bold text-blue-600">8</div>
                      <div className="text-xs text-blue-700">Active Tokens</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-lg font-bold text-purple-600">3</div>
                      <div className="text-xs text-purple-700">Wallets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <button className="w-full btn-primary">
                    <span className="mr-2">➕</span>
                    Add Wallet
                  </button>
                  <button className="w-full btn-outline">
                    <span className="mr-2">📊</span>
                    Export Data
                  </button>
                  <button className="w-full btn-secondary">
                    <span className="mr-2">⚙️</span>
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Market Overview */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">Base Network</span>
                    <span className="status-success">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">Gas Price</span>
                    <span className="text-sm text-gray-600">5 Gwei</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">Block Height</span>
                    <span className="text-sm text-gray-600">#12,345,678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Portfolio Features</h2>
            <p className="text-lg text-gray-600">Professional tools for serious investors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">
                Get instant updates on your portfolio performance with live price feeds
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transaction History</h3>
              <p className="text-gray-600">
                Complete audit trail of all your DeFi activities and token movements
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-wallet Support</h3>
              <p className="text-gray-600">
                Manage multiple wallets and track their performance in one unified dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
