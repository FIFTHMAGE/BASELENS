import React, { useState, useEffect } from 'react';
import WalletDetails from '../components/WalletDetails';

const Profile = () => {
  const [userProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalTransactions: '156',
    memberLevel: 'Gold',
    avatar: '👤'
  });

  const [wallets] = useState([
    { id: 1, name: 'Main Wallet', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', balance: '$12,345.67', status: 'active' },
    { id: 2, name: 'Trading Wallet', address: '0x8ba1f109551bA432bdf5c3c92bdb5a8e8b3db4b6', balance: '$8,901.23', status: 'active' },
    { id: 3, name: 'Savings Wallet', address: '0x1234567890abcdef1234567890abcdef12345678', balance: '$3,456.78', status: 'active' }
  ]);

  const [securitySettings] = useState([
    { name: 'Two-Factor Authentication', status: 'enabled', icon: '🔐' },
    { name: 'Email Notifications', status: 'enabled', icon: '📧' },
    { name: 'SMS Notifications', status: 'disabled', icon: '📱' },
    { name: 'Transaction Alerts', status: 'enabled', icon: '🚨' }
  ]);

  const [preferences] = useState([
    { name: 'Dark Mode', status: 'enabled', icon: '🌙' },
    { name: 'Price Alerts', status: 'enabled', icon: '💰' },
    { name: 'News Updates', status: 'disabled', icon: '📰' },
    { name: 'Market Analysis', status: 'enabled', icon: '📊' }
  ]);

  const [recentActivity] = useState([
    { action: 'Wallet Added', details: 'Trading Wallet connected', time: '2 hours ago', status: 'success' },
    { action: 'USDC Purchase', details: 'Bought 500 USDC', time: '1 day ago', status: 'success' },
    { action: 'Token Swap', details: 'ETH → LINK swap completed', time: '2 days ago', status: 'success' },
    { action: 'Security Update', details: '2FA enabled', time: '1 week ago', status: 'info' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white/30">
              {userProfile.avatar}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{userProfile.name}</h1>
            <p className="text-xl text-indigo-100 mb-6">{userProfile.email}</p>
            
            {/* Profile Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-indigo-200">{userProfile.totalTransactions}</div>
                <div className="text-sm text-indigo-100">Transactions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-200">{userProfile.memberLevel}</div>
                <div className="text-sm text-purple-100">Member Level</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-pink-200">{userProfile.joinDate}</div>
                <div className="text-sm text-pink-100">Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Management */}
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">💼</span>
                  Wallet Management
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage your connected wallets and view balances
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-bold">W</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{wallet.name}</div>
                            <div className="text-sm text-gray-600 font-mono">{wallet.address}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{wallet.balance}</div>
                          <span className="status-success">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full btn-outline mt-4">
                    <span className="mr-2">➕</span>
                    Add New Wallet
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">🔒</span>
                  Security Settings
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage your account security and privacy preferences
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {securitySettings.map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{setting.icon}</span>
                        <span className="font-medium text-gray-900">{setting.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`status-${setting.status === 'enabled' ? 'success' : 'warning'}`}>
                          {setting.status === 'enabled' ? 'Enabled' : 'Disabled'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {setting.status === 'enabled' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Preferences */}
            <div className="card card-hover">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">⚙️</span>
                  Preferences
                </h2>
                <p className="text-gray-600 mt-2">
                  Customize your app experience and notifications
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {preferences.map((pref, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{pref.icon}</span>
                        <span className="font-medium text-gray-900">{pref.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`status-${pref.status === 'enabled' ? 'success' : 'warning'}`}>
                          {pref.status === 'enabled' ? 'Enabled' : 'Disabled'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {pref.status === 'enabled' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <button className="w-full btn-primary">
                    <span className="mr-2">🔐</span>
                    Security Settings
                  </button>
                  <button className="w-full btn-outline">
                    <span className="mr-2">📊</span>
                    Export Data
                  </button>
                  <button className="w-full btn-secondary">
                    <span className="mr-2">📧</span>
                    Contact Support
                  </button>
                  <button className="w-full btn-secondary">
                    <span className="mr-2">📖</span>
                    Help Center
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                        <div className="text-xs text-gray-600">{activity.details}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Account Info</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User ID:</span>
                    <span className="text-sm font-medium text-gray-900">#12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="status-success">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Login:</span>
                    <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IP Address:</span>
                    <span className="text-sm font-medium text-gray-900">192.168.1.1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-sm font-medium text-blue-900">24/7 Support</div>
                    <div className="text-xs text-blue-700">We're here to help</div>
                  </div>
                  
                  <button className="w-full btn-primary">
                    <span className="mr-2">📞</span>
                    Contact Support
                  </button>
                  
                  <button className="w-full btn-outline">
                    <span className="mr-2">📖</span>
                    View FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Profile Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Security Features</h2>
            <p className="text-lg text-gray-600">Advanced protection for your digital assets</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Two-Factor Authentication</h3>
              <p className="text-gray-600">
                Add an extra layer of security with 2FA using authenticator apps or SMS
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Device Management</h3>
              <p className="text-gray-600">
                Monitor and control which devices have access to your account
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Alerts</h3>
              <p className="text-gray-600">
                Get instant notifications about suspicious account activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
