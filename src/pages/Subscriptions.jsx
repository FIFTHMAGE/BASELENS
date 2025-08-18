import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Calendar, CreditCard, Download, Settings, RefreshCw } from 'lucide-react';

const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const showMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleCancelClick = (subscription) => {
    setSubscriptionToCancel(subscription);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    if (!subscriptionToCancel) return;
    
    try {
      // This would integrate with your subscription management system
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionToCancel.id 
          ? { ...sub, status: 'cancelling' }
          : sub
      ));
      showMessage('Subscription cancelled successfully. You\'ll have access until the end of your billing period.');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      showMessage('Failed to cancel subscription. Please try again.');
    } finally {
      setShowCancelConfirm(false);
      setSubscriptionToCancel(null);
    }
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
    setSubscriptionToCancel(null);
  };

  const upgradePlan = async (subscriptionId) => {
    // Redirect to pricing page for plan upgrade
    navigate('/pricing');
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-300 text-sm">Loading subscriptions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="glass-card">
        <div className="card-header">
          <h1 className="card-title">Boomerang Subscriptions</h1>
          <p className="card-subtitle">Manage your USDC subscriptions and billing</p>
        </div>
      </div>

      {/* Wallet Status */}
      {walletConnected && (
        <div className="glass-card">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Wallet Connected</p>
                  <p className="text-gray-400 text-xs">{walletAddress}</p>
                </div>
              </div>
              <button className="btn-secondary text-sm py-2 px-3">
                <Settings className="w-3 h-3 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="glass-card">
              <div className="p-4">
                {/* Subscription Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-bold text-white">{subscription.planName} Plan</h2>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-gray-300 text-sm">
                      {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing • {subscription.amount} {subscription.currency}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => upgradePlan(subscription.id)}
                      className="btn-primary text-sm py-2 px-3"
                    >
                      Upgrade
                    </button>
                    {subscription.status === 'active' && (
                      <button 
                        onClick={() => handleCancelClick(subscription)}
                        className="btn-secondary text-sm py-2 px-3"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Billing Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="glass-card p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-xs">Start Date</span>
                    </div>
                    <p className="text-white font-medium text-sm">{formatDate(subscription.startDate)}</p>
                  </div>
                  
                  <div className="glass-card p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-xs">Next Billing</span>
                    </div>
                    <p className="text-white font-medium text-sm">{formatDate(subscription.nextBilling)}</p>
                  </div>
                  
                  <div className="glass-card p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-xs">Amount</span>
                    </div>
                    <p className="text-white font-medium text-sm">{subscription.amount} {subscription.currency}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-white mb-3">Plan Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-xs py-1 px-2">
                      <Download className="w-3 h-3 mr-1" />
                      Invoice
                    </button>
                    <button className="btn-secondary text-xs py-1 px-2">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </button>
                  </div>
                  
                  {subscription.status === 'cancelling' && (
                    <div className="text-yellow-400 text-xs">
                      ⚠️ Ends on {formatDate(subscription.nextBilling)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Subscriptions */
        <div className="glass-card text-center py-8">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">No Active Subscriptions</h2>
          <p className="text-gray-300 mb-6 max-w-sm mx-auto text-sm">
            You don't have any active Boomerang subscriptions yet. Choose a plan to unlock premium features and start scheduling your Farcaster casts.
          </p>
          <button 
            onClick={() => navigate('/pricing')}
            className="btn-primary px-6 py-3"
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
          
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Professional Plan - Monthly</p>
                    <p className="text-gray-400 text-xs">{formatDate('2024-01-01')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium text-sm">150 USDC</p>
                  <p className="text-green-400 text-xs">Paid</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Analytics Pro Add-on</p>
                    <p className="text-gray-400 text-xs">{formatDate('2024-01-15')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium text-sm">100 USDC</p>
                  <p className="text-green-400 text-xs">Paid</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="btn-secondary text-sm py-2 px-4">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showCancelConfirm && subscriptionToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-white mb-3">Confirm Cancellation</h3>
            <p className="text-gray-300 text-sm mb-4">
              Are you sure you want to cancel your "{subscriptionToCancel.planName}" subscription? 
              You will lose access to premium features at the end of your billing period.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={confirmCancel}
                className="btn-primary text-sm py-2 px-4"
              >
                Confirm
              </button>
              <button 
                onClick={cancelCancel}
                className="btn-secondary text-sm py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500/20 text-white px-4 py-2 rounded-md z-40 text-sm">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
