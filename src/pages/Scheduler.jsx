import React, { useState } from 'react';
import { Clock, Plus, Upload, Edit, Trash2, Eye } from 'lucide-react';

const Scheduler = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [casts, setCasts] = useState([
    {
      id: 1,
      content: "Product launch announcement coming soon! 🚀",
      scheduledFor: '2024-01-15 10:00 AM',
      status: 'scheduled',
      type: 'announcement'
    },
    {
      id: 2,
      content: "Building in public - here's what I learned this week...",
      scheduledFor: '2024-01-16 2:00 PM',
      status: 'scheduled',
      type: 'educational'
    },
    {
      id: 3,
      content: "Community Q&A session - drop your questions below!",
      scheduledFor: '2024-01-17 6:00 PM',
      status: 'draft',
      type: 'engagement'
    }
  ]);

  const [newCast, setNewCast] = useState({
    content: '',
    scheduledFor: '',
    type: 'general'
  });

  const castTypes = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'educational', label: 'Educational', color: 'bg-green-100 text-green-800' },
    { value: 'engagement', label: 'Engagement', color: 'bg-purple-100 text-purple-800' },
    { value: 'promotional', label: 'Promotional', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleCreateCast = () => {
    if (newCast.content && newCast.scheduledFor) {
      const cast = {
        id: Date.now(),
        ...newCast,
        status: 'scheduled'
      };
      setCasts([...casts, cast]);
      setNewCast({ content: '', scheduledFor: '', type: 'general' });
      setShowCreateModal(false);
    }
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle CSV upload logic here
      console.log('Uploading CSV:', file.name);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    const typeObj = castTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cast Scheduler</h1>
          <p className="text-gray-600">Schedule your Farcaster casts up to 30 days in advance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="btn-secondary flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Cast
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Calendar View</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {/* Calendar Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(2024, 0, i - 2); // January 2024
              const dayCasts = casts.filter(cast => 
                new Date(cast.scheduledFor).toDateString() === date.toDateString()
              );
              
              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                    date.getMonth() === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {date.getDate()}
                  </div>
                  {dayCasts.map(cast => (
                    <div
                      key={cast.id}
                      className={`text-xs p-1 mb-1 rounded ${getTypeColor(cast.type)} cursor-pointer hover:opacity-80`}
                      title={cast.content}
                    >
                      {cast.content.substring(0, 20)}...
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheduled Casts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Casts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {casts.map((cast) => (
              <div key={cast.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-2">{cast.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {cast.scheduledFor}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getTypeColor(cast.type)}`}>
                      {castTypes.find(t => t.value === cast.type)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cast.status)}`}>
                    {cast.status}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Cast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Cast</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cast Content
                </label>
                <textarea
                  value={newCast.content}
                  onChange={(e) => setNewCast({ ...newCast, content: e.target.value })}
                  className="input-field"
                  rows={4}
                  placeholder="What's on your mind?"
                  maxLength={280}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newCast.content.length}/280 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For
                </label>
                <input
                  type="datetime-local"
                  value={newCast.scheduledFor}
                  onChange={(e) => setNewCast({ ...newCast, scheduledFor: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cast Type
                </label>
                <select
                  value={newCast.type}
                  onChange={(e) => setNewCast({ ...newCast, type: e.target.value })}
                  className="input-field"
                >
                  {castTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCast}
                disabled={!newCast.content || !newCast.scheduledFor}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Schedule Cast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload Casts</h3>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Upload a CSV file with your content calendar. The file should include:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Content (cast text)</li>
                  <li>Schedule Date & Time</li>
                  <li>Cast Type</li>
                  <li>Status</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="btn-primary flex-1"
                >
                  Upload & Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
