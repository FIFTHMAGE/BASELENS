import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Wallet, Coins } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [usdcBalance, setUsdcBalance] = useState(0);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 50 : 500, // USDC amounts
      description: 'Perfect for individual creators getting started',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 50 scheduled casts per month',
        'Basic analytics dashboard',
        'Email support',
        'Standard templates',
        'Mobile app access',
        'Basic queue management'
      ],
      popular: false,
      cta: 'Subscribe with USDC'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 150 : 1500, // USDC amounts
      description: 'For serious content creators and small teams',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Up to 500 scheduled casts per month',
        'Advanced analytics & insights',
        'Priority email support',
        'Custom templates & branding',
        'Team collaboration (up to 3 members)',
        'Bulk upload & CSV import',
        'Advanced queue management',
        'API access',
        'White-label options'
      ],
      popular: true,
      cta: 'Subscribe with USDC'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 500 : 5000, // USDC amounts
      description: 'For large teams and agencies',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      features: [
        'Unlimited scheduled casts',
        'Enterprise analytics & reporting',
        '24/7 phone & email support',
        'Custom integrations',
        'Unlimited team members',
        'Advanced automation',
        'Custom workflows',
        'Dedicated account manager',
        'SLA guarantees',
        'On-premise deployment options'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const addons = [
    {
      name: 'Analytics Pro',
      price: billingCycle === 'monthly' ? 100 : 1000, // USDC amounts
      description: 'Advanced analytics and insights',
      features: ['Custom reports', 'Competitor analysis', 'ROI tracking', 'A/B testing']
    },
    {
      name: 'Team Management',
      price: billingCycle === 'monthly' ? 75 : 750, // USDC amounts
      description: 'Enhanced team collaboration features',
      features: ['Role-based permissions', 'Approval workflows', 'Team performance metrics']
    },
    {
      name: 'API Access',
      price: billingCycle === 'monthly' ? 125 : 1250, // USDC amounts
      description: 'Full API access for custom integrations',
      features: ['REST API', 'Webhooks', 'SDK access', 'Custom integrations']
    }
  ];

  // Connect to Farcaster wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // This would integrate with Farcaster's wallet system
      // For now, simulating the connection
      setTimeout(() => {
        setWalletConnected(true);
        setWalletAddress('0x1234...5678');
        setUsdcBalance(2500); // 2500 USDC
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnecting(false);
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (plan) => {
    if (!walletConnected) {
      alert('Please connect your Farcaster wallet first');
      return;
    }

    if (usdcBalance < plan.price) {
      alert(`Insufficient USDC balance. You need ${plan.price} USDC but have ${usdcBalance} USDC`);
      return;
    }

    try {
      // This would integrate with actual USDC payment processing
      alert(`Processing subscription to ${plan.name} plan for ${plan.price} USDC...`);
      // Here you would:
      // 1. Create a subscription record in your database
      // 2. Process the USDC payment
      // 3. Update user permissions
      // 4. Send confirmation
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  // Add addon to subscription
  const addAddon = async (addon) => {
    if (!walletConnected) {
      alert('Please connect your Farcaster wallet first');
      return;
    }

    if (usdcBalance < addon.price) {
      alert(`Insufficient USDC balance. You need ${addon.price} USDC but have ${usdcBalance} USDC`);
      return;
    }

    try {
      alert(`Adding ${addon.name} for ${addon.price} USDC...`);
      // Process addon purchase
    } catch (error) {
      console.error('Addon purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="glass-card text-center">
        <div className="card-header">
          <h1 className="card-title">Choose Your Plan</h1>
          <p className="card-subtitle">Scale your Farcaster presence with our flexible USDC subscription options</p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Yearly
            <span className="ml-1 text-green-400 text-xs">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">🔗 Connect Your Farcaster Wallet</h2>
          <p className="card-subtitle">Connect your wallet to subscribe with USDC</p>
        </div>
        
        {!walletConnected ? (
          <div className="p-6 text-center">
            <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-6">Connect your Farcaster wallet to manage subscriptions and make USDC payments</p>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn-primary"
            >
              {isConnecting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Wallet Connected</p>
                  <p className="text-gray-400 text-sm">{walletAddress}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">USDC Balance</p>
                <p className="text-green-400 text-2xl font-bold">{usdcBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                ✅ Your wallet is connected and ready for USDC payments
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const canAfford = walletConnected && usdcBalance >= plan.price;
          return (
            <div
              key={plan.name}
              className={`glass-card relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Coins className="w-6 h-6 text-yellow-400" />
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-lg">USDC</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'enterprise' ? (
                <button className="btn-secondary w-full">
                  Contact Sales
                </button>
              ) : (
                <button 
                  onClick={() => subscribeToPlan(plan)}
                  disabled={!walletConnected || !canAfford}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  } ${!walletConnected || !canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!walletConnected ? 'Connect Wallet First' : 
                   !canAfford ? `Need ${plan.price - usdcBalance} more USDC` : 
                   plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add-ons */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Premium Add-ons</h2>
          <p className="card-subtitle">Enhance your experience with additional features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addons.map((addon, index) => {
            const canAfford = walletConnected && usdcBalance >= addon.price;
            return (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{addon.description}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{addon.price}</span>
                  <span className="text-gray-400">USDC</span>
                  <span className="text-gray-400 text-sm">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {addon.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => addAddon(addon)}
                  disabled={!walletConnected || !canAfford}
                  className={`btn-secondary w-full ${!walletConnected || !canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!walletConnected ? 'Connect Wallet First' : 
                   !canAfford ? `Need ${addon.price - usdcBalance} more USDC` : 
                   'Add to Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Frequently Asked Questions</h2>
          <p className="card-subtitle">Everything you need to know about our USDC subscriptions</p>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">How do USDC payments work?</h3>
            <p className="text-gray-300 text-sm">All payments are processed in USDC through your connected Farcaster wallet. We use secure smart contracts to handle subscriptions automatically.</p>
          </div>
          
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-300 text-sm">Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately and USDC amounts are adjusted accordingly.</p>
          </div>
          
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">What if I don't have enough USDC?</h3>
            <p className="text-gray-300 text-sm">You'll need sufficient USDC in your connected wallet to subscribe. You can purchase USDC from exchanges or transfer from other wallets.</p>
          </div>
          
          <div className="pb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
            <p className="text-gray-300 text-sm">Yes! All plans come with a 14-day free trial. No USDC required to start - just connect your wallet and begin using the platform.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Scale Your Farcaster Presence?</h2>
        <p className="text-gray-300 text-lg mb-8">Connect your wallet and start your USDC subscription today</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!walletConnected ? (
            <button onClick={connectWallet} className="btn-primary text-lg px-8 py-4">
              <Wallet className="w-6 h-6 mr-2" />
              Connect Wallet
            </button>
          ) : (
            <button className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </button>
          )}
          <button className="btn-secondary text-lg px-8 py-4">Schedule Demo</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
