import React, { useState } from 'react';
import { Calendar, Clock, Users, TrendingUp, Plus, ArrowRight, DollarSign, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const [stats] = useState({
    totalCasts: 24,
    scheduledCasts: 8,
    publishedCasts: 12,
    draftCasts: 4,
    engagementRate: 87.5
  });

  const [recentCasts] = useState([
    {
      id: 1,
      content: "Just launched our new product! 🚀 Check it out and let me know what you think...",
      scheduledFor: "2024-01-15T10:00:00Z",
      status: "published",
      engagement: 156
    },
    {
      id: 2,
      content: "Building something amazing with the team. Can't wait to share the details...",
      scheduledFor: "2024-01-16T14:30:00Z",
      status: "scheduled",
      engagement: 0
    },
    {
      id: 3,
      content: "Working on some exciting new features. What would you like to see next?",
      scheduledFor: "2024-01-17T09:00:00Z",
      status: "draft",
      engagement: 0
    }
  ]);

  const [quickActions] = useState([
    {
      title: "Schedule New Cast",
      description: "Create and schedule your next Farcaster post",
      icon: Plus,
      action: "schedule",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "View Analytics",
      description: "Check your cast performance metrics",
      icon: TrendingUp,
      action: "analytics",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Manage Queue",
      description: "Organize your scheduled content",
      icon: Clock,
      action: "queue",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "View Pricing",
      description: "Explore our subscription plans and features",
      icon: DollarSign,
      action: "pricing",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "My Subscriptions",
      description: "Manage your USDC subscriptions and billing",
      icon: CreditCard,
      action: "subscriptions",
      color: "from-emerald-500 to-teal-500"
    }
  ]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: "status-badge status-published",
      scheduled: "status-badge status-scheduled",
      draft: "status-badge status-draft"
    };
    
    const statusLabels = {
      published: "Published",
      scheduled: "Scheduled",
      draft: "Draft"
    };

    return (
      <span className={statusClasses[status]}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="glass-card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="card-title">Dashboard</h1>
              <p className="card-subtitle">Welcome back! Here's what's happening with your casts.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Professional Plan
              </div>
              <div className="text-green-400 text-sm">
                ✓ Active Subscription
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalCasts}</div>
          <div className="stat-label">Total Casts</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.scheduledCasts}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.publishedCasts}</div>
          <div className="stat-label">Published</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.engagementRate}%</div>
          <div className="stat-label">Engagement Rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
          <p className="card-subtitle">Get things done faster with these shortcuts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="glass-card p-6 text-left hover:scale-105 transition-transform cursor-pointer group"
                onClick={() => console.log(`Action: ${action.action}`)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Casts */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">Recent Casts</h2>
          <p className="card-subtitle">Your latest content and scheduled posts</p>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Scheduled For</th>
                <th>Status</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {recentCasts.map((cast) => (
                <tr key={cast.id} className="hover:bg-white/5 transition-colors">
                  <td className="max-w-xs">
                    <div className="truncate text-sm">
                      {cast.content}
                    </div>
                  </td>
                  <td className="text-sm text-gray-300">
                    {formatDate(cast.scheduledFor)}
                  </td>
                  <td>
                    {getStatusBadge(cast.status)}
                  </td>
                  <td className="text-sm">
                    {cast.engagement > 0 ? (
                      <span className="text-green-400">+{cast.engagement}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
          <button className="btn-secondary">
            View All Casts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
