import React, { useState, useEffect } from 'react';
import BuyUSDC from '../components/BuyUSDC';

const Buy = () => {
  const [stats, setStats] = useState({
    totalVolume: '$2.4M',
    totalUsers: '12.5K',
    successRate: '99.2%',
    avgTime: '2.3 min'
  });

  const [features] = useState([
    {
      icon: '💳',
      title: 'Multiple Payment Methods',
      description: 'Credit cards, bank transfers, and mobile money'
    },
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      description: '256-bit encryption and secure processing'
    },
    {
      icon: '⚡',
      title: 'Instant Settlement',
      description: 'USDC delivered to your wallet in minutes'
    },
    {
      icon: '🌍',
      title: 'Global Coverage',
      description: 'Available in 150+ countries worldwide'
    }
  ]);

  const [benefits] = useState([
    'No hidden fees or charges',
    '24/7 customer support',
    'Regulated and compliant',
    'Best exchange rates'
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Buy USDC on Base Network
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Purchase USDC with fiat currency and start your DeFi journey on Base network
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{stats.totalVolume}</div>
              <div className="text-sm text-blue-100">Total Volume</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{stats.totalUsers}</div>
              <div className="text-sm text-blue-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{stats.successRate}</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-200">{stats.avgTime}</div>
              <div className="text-sm text-blue-100">Avg. Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Buy USDC Widget */}
          <div className="order-2 lg:order-1">
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">💰</span>
                  Purchase USDC
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter the amount you want to buy and choose your payment method
                </p>
              </div>
              <div className="card-body">
                <BuyUSDC />
              </div>
            </div>
          </div>

          {/* Features and Benefits */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {/* Features Grid */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits List */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How It Works */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enter Amount</h4>
                      <p className="text-gray-600">Specify how much USDC you want to purchase</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Choose Payment</h4>
                      <p className="text-gray-600">Select your preferred payment method</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Complete Purchase</h4>
                      <p className="text-gray-600">USDC will be sent to your wallet instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about buying USDC</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What is USDC?</h3>
                <p className="text-gray-600">
                  USDC (USD Coin) is a stablecoin pegged to the US dollar. It's widely used in DeFi applications 
                  and provides stability in the volatile cryptocurrency market.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does it take?</h3>
                <p className="text-gray-600">
                  Most purchases are completed within 2-5 minutes. The exact time depends on your payment method 
                  and network conditions.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Are there any fees?</h3>
                <p className="text-gray-600">
                  We offer transparent pricing with no hidden fees. You'll see the exact amount of USDC you'll 
                  receive before confirming your purchase.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is it safe?</h3>
                <p className="text-gray-600">
                  Yes! We use bank-level security measures and are fully compliant with financial regulations. 
                  Your funds are protected by industry-standard security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
