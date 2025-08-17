import React, { useState, useEffect } from 'react';
import SwapComponent from '../components/Swap';

const Swap = () => {
  const [popularTokens] = useState([
    { symbol: 'USDC', name: 'USD Coin', price: '$1.00', change: '+0.00%', icon: '💵' },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,245.67', change: '+2.34%', icon: '🔷' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: '$67,890.12', change: '+1.87%', icon: '🟡' },
    { symbol: 'DAI', name: 'Dai', price: '$1.00', change: '+0.01%', icon: '🟢' },
    { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '+0.00%', icon: '💙' },
    { symbol: 'LINK', name: 'Chainlink', price: '$18.45', change: '+5.67%', icon: '🔗' }
  ]);

  const [recentSwaps] = useState([
    { from: 'USDC', to: 'ETH', amount: '500', time: '2 min ago', status: 'completed' },
    { from: 'ETH', to: 'WBTC', amount: '0.5', time: '15 min ago', status: 'completed' },
    { from: 'DAI', to: 'LINK', amount: '1000', time: '1 hour ago', status: 'completed' },
    { from: 'USDT', to: 'USDC', amount: '250', time: '2 hours ago', status: 'completed' }
  ]);

  const [swapStats] = useState({
    totalVolume: '$12.4M',
    totalSwaps: '45.2K',
    avgGasFee: '$0.15',
    successRate: '99.8%'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Swap Tokens on Base
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Exchange tokens instantly with the best rates using UniswapX on Base network
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-200">{swapStats.totalVolume}</div>
              <div className="text-sm text-green-100">Total Volume</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{swapStats.totalSwaps}</div>
              <div className="text-sm text-blue-100">Total Swaps</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-indigo-200">{swapStats.avgGasFee}</div>
              <div className="text-sm text-indigo-100">Avg. Gas Fee</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-200">{swapStats.successRate}</div>
              <div className="text-sm text-purple-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Swap Interface */}
          <div className="lg:col-span-2">
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">🔄</span>
                  Swap Tokens
                </h2>
                <p className="text-gray-600 mt-2">
                  Get the best rates and lowest fees for your token swaps
                </p>
              </div>
              <div className="card-body">
                <SwapComponent />
              </div>
            </div>

            {/* Popular Trading Pairs */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Trading Pairs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTokens.map((token, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{token.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{token.symbol}</div>
                          <div className="text-sm text-gray-600">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{token.price}</div>
                        <div className={`text-sm ${token.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {token.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Swaps */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Swaps</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {recentSwaps.map((swap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {swap.amount} {swap.from} → {swap.to}
                          </div>
                          <div className="text-xs text-gray-500">{swap.time}</div>
                        </div>
                      </div>
                      <span className="status-success">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Swap on Base */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Why Swap on Base?</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 text-xs">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fast & Cheap</h4>
                      <p className="text-sm text-gray-600">Low fees and instant settlements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 text-xs">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Secure</h4>
                      <p className="text-sm text-gray-600">Built on Ethereum's security</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-purple-600 text-xs">🌐</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Interoperable</h4>
                      <p className="text-sm text-gray-600">Works with all Ethereum tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Networks */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Supported Networks</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">Base</span>
                    </div>
                    <span className="status-success">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-400 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-600">Ethereum</span>
                    </div>
                    <span className="status-info">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Token Swapping Works</h2>
            <p className="text-lg text-gray-600">Simple, secure, and efficient token exchange</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Find Best Route</h3>
              <p className="text-gray-600">
                Our smart routing finds the optimal path for your swap across multiple DEXs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Compare Rates</h3>
              <p className="text-gray-600">
                Get real-time quotes and choose the best rate for your transaction
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Execute Swap</h3>
              <p className="text-gray-600">
                Complete your swap with one click and receive tokens instantly
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about swapping tokens</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What are the fees?</h3>
                <p className="text-gray-600">
                  We charge a small fee on each swap. Gas fees are paid to the Base network and vary based on 
                  network congestion.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does a swap take?</h3>
                <p className="text-gray-600">
                  Most swaps complete within 1-2 minutes on Base network. The exact time depends on network 
                  conditions and gas fees.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is it safe?</h3>
                <p className="text-gray-600">
                  Yes! We use industry-standard security measures and all swaps are executed through audited 
                  smart contracts on Base network.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What tokens are supported?</h3>
                <p className="text-gray-600">
                  We support all major ERC-20 tokens on Base network including USDC, ETH, WBTC, DAI, and many more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
