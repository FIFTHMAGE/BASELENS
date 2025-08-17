import React from 'react';
import BuyUSDC from '../components/BuyUSDC';
import ErrorBoundary from '../components/ErrorBoundary';
import ConfigChecker from '../components/ConfigChecker';

export default function Buy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Buy USDC</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert airtime, mobile money, or fiat currency to USDC on the Base network. 
            USDC is a stablecoin pegged to the US dollar, perfect for DeFi and payments.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Buy Interface */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <BuyUSDC />
            </ErrorBoundary>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Configuration Checker */}
            <ConfigChecker />

            {/* What is USDC */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is USDC?</h3>
              <p className="text-gray-600 text-sm mb-3">
                USDC (USD Coin) is a stablecoin that maintains a 1:1 peg with the US dollar. 
                It's backed by cash and short-term U.S. government obligations.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>1 USDC = $1.00 USD</strong><br/>
                  Always redeemable for US dollars
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Buy USDC?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Stable value - no volatility like other cryptocurrencies
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Fast transfers on Base network
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Low transaction fees
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Widely accepted in DeFi protocols
                </li>
              </ul>
            </div>

            {/* Supported Networks */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Supported Networks</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Base</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Ethereum</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Methods</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📱</span>
                  <span>Airtime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">💳</span>
                  <span>Mobile Money</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">🏦</span>
                  <span>Bank Transfer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">💵</span>
                  <span>Cash</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Security & Compliance</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Regulated by US authorities</p>
                <p>• Regular audits and transparency</p>
                <p>• Backed by cash reserves</p>
                <p>• KYC/AML compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you encounter any issues or have questions about buying USDC, 
              please check our documentation or contact support.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://fonbnk.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Fonbnk Documentation
              </a>
              <a 
                href="https://www.circle.com/en/usdc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                USDC Information
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
