import React, { useState, useEffect } from 'react';

const BuyUSDC = () => {
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [showFonbnkWidget, setShowFonbnkWidget] = useState(false);

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', description: 'Stablecoin pegged to USD' },
    { symbol: 'USDT', name: 'Tether', icon: '💙', description: 'Stablecoin pegged to USD' }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'ACH, Wire Transfer' },
    { id: 'mobile', name: 'Mobile Money', icon: '📱', description: 'Apple Pay, Google Pay' }
  ];

  const handlePurchase = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    setShowFonbnkWidget(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleFonbnkPurchase = () => {
    // Open Fonbnk widget in new window
    const fonbnkUrl = `https://sandbox-pay.fonbnk.com/?source=aBnoWFna&signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlcmhpcmhAanJmZWkiLCJuZXR3b3JrIjoiQkFTRSIsImFzc2V0IjoiVVNEQyIsImFtb3VudCI6IjIifQ.V3Tpeui7zZB4VXfex8hzWajt8CQDTXdL2CGFzM9tdKI`;
    
    // Update URL based on selected token
    const updatedUrl = fonbnkUrl.replace('USDC', selectedToken);
    
    window.open(updatedUrl, '_blank', 'width=500,height=700');
  };

  const getEstimatedTokens = () => {
    if (!amount || parseFloat(amount) <= 0) return '0.00';
    const usdAmount = parseFloat(amount);
    // Assuming 1:1 ratio for stablecoins (minus small fee)
    const fee = 0.029; // 2.9% fee
    const tokens = usdAmount * (1 - fee);
    return tokens.toFixed(2);
  };

  const getFeeAmount = () => {
    if (!amount || parseFloat(amount) <= 0) return '0.00';
    const usdAmount = parseFloat(amount);
    const fee = 0.029; // 2.9% fee
    return (usdAmount * fee).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Token Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Token to Purchase
        </label>
        <div className="grid grid-cols-2 gap-3">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token.symbol)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedToken === token.symbol
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{token.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{token.symbol}</div>
                  <div className="text-xs text-gray-600">{token.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-field pl-8"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-xl mb-1">{method.icon}</div>
                <div className="text-sm font-medium text-gray-900">{method.name}</div>
                <div className="text-xs text-gray-600">{method.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Purchase Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fee (2.9%):</span>
              <span className="font-medium">${getFeeAmount()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">You'll receive:</span>
              <span className="font-medium text-green-600">
                {getEstimatedTokens()} {selectedToken}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="spinner w-5 h-5 mr-2"></div>
            Processing...
          </div>
        ) : (
          `Purchase ${selectedToken}`
        )}
      </button>

      {/* Fonbnk Integration */}
      {showFonbnkWidget && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <h4 className="font-semibold text-blue-900 mb-2">Ready to Purchase!</h4>
            <p className="text-sm text-blue-700 mb-4">
              You'll be redirected to Fonbnk's secure payment platform to complete your {selectedToken} purchase.
            </p>
            <button
              onClick={handleFonbnkPurchase}
              className="btn-primary"
            >
              <span className="mr-2">💳</span>
              Continue to Payment
            </button>
            <p className="text-xs text-blue-600 mt-2">
              Powered by Fonbnk • Secure • Fast
            </p>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="text-center text-sm text-gray-500">
        <p>• Secure payment processing</p>
        <p>• Instant {selectedToken} delivery to your wallet</p>
        <p>• Support for multiple payment methods</p>
      </div>
    </div>
  );
};

export default BuyUSDC;
