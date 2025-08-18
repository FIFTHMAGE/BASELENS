import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Calendar, CreditCard, Download, Settings, RefreshCw } from 'lucide-react';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Mock subscription data - in real app this would come from your database
  useEffect(() => {
    // Simulate loading subscriptions
    setTimeout(() => {
      setSubscriptions([
        {
          id: 1,
          planName: 'Professional',
          status: 'active',
          startDate: '2024-01-01',
          nextBilling: '2024-02-01',
          amount: 150,
          currency: 'USDC',
          billingCycle: 'monthly',
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
          ]
        }
      ]);
      setLoading(false);
      setWalletConnected(true);
      setWalletAddress('0x1234...5678');
    }, 1000);
  }, []);

  const cancelSubscription = async (subscriptionId) => {
    if (confirm('Are you sure you want to cancel this subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      try {
        // This would integrate with your subscription management system
        setSubscriptions(prev => prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelling' }
            : sub
        ));
        alert('Subscription cancelled successfully. You\'ll have access until the end of your billing period.');
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };

  const upgradePlan = async (subscriptionId) => {
    // Redirect to pricing page for plan upgrade
    window.location.href = '/pricing';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Active' },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Cancelled' },
      cancelling: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Cancelling' },
      expired: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Expired' }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-300">Loading subscriptions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="glass-card">
        <div className="card-header">
          <h1 className="card-title">My Subscriptions</h1>
          <p className="card-subtitle">Manage your USDC subscriptions and billing</p>
        </div>
      </div>

      {/* Wallet Status */}
      {walletConnected && (
        <div className="glass-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Wallet Connected</p>
                  <p className="text-gray-400 text-sm">{walletAddress}</p>
                </div>
              </div>
              <button className="btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Wallet Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      {subscriptions.length > 0 ? (
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="glass-card">
              <div className="p-6">
                {/* Subscription Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{subscription.planName} Plan</h2>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-gray-300">
                      {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing • {subscription.amount} {subscription.currency}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => upgradePlan(subscription.id)}
                      className="btn-primary"
                    >
                      Upgrade Plan
                    </button>
                    {subscription.status === 'active' && (
                      <button 
                        onClick={() => cancelSubscription(subscription.id)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Billing Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300 text-sm">Start Date</span>
                    </div>
                    <p className="text-white font-medium">{formatDate(subscription.startDate)}</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 text-sm">Next Billing</span>
                    </div>
                    <p className="text-white font-medium">{formatDate(subscription.nextBilling)}</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 text-sm">Amount</span>
                    </div>
                    <p className="text-white font-medium">{subscription.amount} {subscription.currency}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex space-x-3">
                    <button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </button>
                    <button className="btn-secondary">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </button>
                  </div>
                  
                  {subscription.status === 'cancelling' && (
                    <div className="text-yellow-400 text-sm">
                      ⚠️ Subscription will end on {formatDate(subscription.nextBilling)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Subscriptions */
        <div className="glass-card text-center py-12">
          <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Active Subscriptions</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            You don't have any active subscriptions yet. Choose a plan to unlock premium features and start scheduling your Farcaster casts.
          </p>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="btn-primary text-lg px-8 py-4"
          >
            View Plans
          </button>
        </div>
      )}

      {/* Billing History */}
      {subscriptions.length > 0 && (
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">Billing History</h2>
            <p className="card-subtitle">Your recent USDC payments and invoices</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Professional Plan - Monthly</p>
                    <p className="text-gray-400 text-sm">{formatDate('2024-01-01')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">150 USDC</p>
                  <p className="text-green-400 text-sm">Paid</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Analytics Pro Add-on</p>
                    <p className="text-gray-400 text-sm">{formatDate('2024-01-15')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">100 USDC</p>
                  <p className="text-green-400 text-sm">Paid</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="btn-secondary">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
