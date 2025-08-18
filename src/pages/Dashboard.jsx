import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp, Users, Upload, Plus, Play, Pause, Edit } from 'lucide-react';

const Dashboard = () => {
  const [stats] = useState({
    totalCasts: 156,
    scheduledCasts: 23,
    publishedCasts: 133,
    engagementRate: '8.7%'
  });

  const [recentCasts] = useState([
    {
      id: 1,
      content: "Just launched our new product! 🚀 Check it out and let me know what you think...",
      scheduledFor: '2024-01-15 10:00 AM',
      status: 'scheduled',
      engagement: 'High'
    },
    {
      id: 2,
      content: "Building in public is the best way to grow. Here's what I learned this week...",
      publishedAt: '2024-01-14 2:30 PM',
      status: 'published',
      engagement: 'Medium'
    },
    {
      id: 3,
      content: "Quick question for the community: What's your biggest challenge with...",
      scheduledFor: '2024-01-16 3:00 PM',
      status: 'scheduled',
      engagement: 'Low'
    }
  ]);

  const [quickActions] = useState([
    { name: 'Schedule New Cast', icon: Plus, action: () => console.log('Schedule new cast') },
    { name: 'Bulk Upload', icon: Upload, action: () => console.log('Bulk upload') },
    { name: 'Team Settings', icon: Users, action: () => console.log('Team settings') }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'High':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-blue-100 text-lg">
          You have {stats.scheduledCasts} casts scheduled and {stats.publishedCasts} published this month.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Casts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCasts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledCasts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth</p>
              <p className="text-2xl font-bold text-gray-900">{stats.audienceGrowth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Casts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Casts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCasts.map((cast) => (
                  <div key={cast.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-2">{cast.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {cast.status === 'scheduled' ? (
                          <span>Scheduled for {cast.scheduledFor}</span>
                        ) : (
                          <span>Published {cast.publishedAt}</span>
                        )}
                        <span className={`${getEngagementColor(cast.engagement)} font-medium`}>
                          {cast.engagement} Engagement
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cast.status)}`}>
                        {cast.status}
                      </span>
                      {cast.status === 'scheduled' && (
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <action.icon className="w-5 h-5 mr-3 text-gray-400" />
                    {action.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Schedule</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product Launch</p>
                    <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
                  </div>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Community Q&A</p>
                    <p className="text-xs text-gray-500">Jan 16 at 3:00 PM</p>
                  </div>
                  <button className="p-1 text-gray-600 hover:text-gray-800">
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Performance & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best posting time</span>
                <span className="text-sm font-medium text-gray-900">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average engagement</span>
                <span className="text-sm font-medium text-gray-900">8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Audience growth</span>
                <span className="text-sm font-medium text-green-600">+12.3% this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>• Post during peak hours (10 AM - 2 PM) for maximum engagement</p>
            <p>• Use relevant hashtags to increase discoverability</p>
            <p>• Engage with your audience within the first hour of posting</p>
            <p>• Schedule content in advance to maintain consistency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
