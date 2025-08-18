import React, { useState } from 'react';
import { Clock, Play, Pause, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const QueueItem = ({ cast, getPriorityColor, onMoveUp, onMoveDown, onDelete, onEdit, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-1">
          <button 
            onClick={() => onMoveUp(cast.id)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            disabled={cast.position === 1}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onMoveDown(cast.id)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            disabled={cast.position === 3}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-900 mb-2">{cast.content}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {cast.scheduledFor}
            </span>
            <span className={`px-2 py-1 rounded-full ${getPriorityColor(cast.priority)}`}>
              {cast.priority} priority
            </span>
            <span className={`px-2 py-1 rounded-full ${cast.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {cast.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onToggleStatus(cast.id)}
            className={`p-2 rounded-lg ${
              cast.status === 'active' 
                ? 'text-yellow-600 hover:bg-yellow-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {cast.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => onEdit(cast.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(cast.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Queue = () => {
  const [queue, setQueue] = useState([
    {
      id: '1',
      content: "Product launch announcement coming soon! 🚀",
      scheduledFor: '2024-01-15 10:00 AM',
      priority: 'high',
      status: 'active',
      position: 1
    },
    {
      id: '2',
      content: "Building in public - here's what I learned this week...",
      scheduledFor: '2024-01-16 2:00 PM',
      priority: 'medium',
      status: 'active',
      position: 2
    },
    {
      id: '3',
      content: "Community Q&A session - drop your questions below!",
      scheduledFor: '2024-01-17 6:00 PM',
      priority: 'low',
      status: 'paused',
      position: 3
    }
  ]);

  const moveItem = (id, direction) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      const currentIndex = newQueue.findIndex(item => item.id === id);
      
      if (direction === 'up' && currentIndex > 0) {
        [newQueue[currentIndex], newQueue[currentIndex - 1]] = [newQueue[currentIndex - 1], newQueue[currentIndex]];
        newQueue[currentIndex].position = newQueue[currentIndex].position + 1;
        newQueue[currentIndex - 1].position = newQueue[currentIndex - 1].position - 1;
      } else if (direction === 'down' && currentIndex < newQueue.length - 1) {
        [newQueue[currentIndex], newQueue[currentIndex + 1]] = [newQueue[currentIndex + 1], newQueue[currentIndex]];
        newQueue[currentIndex].position = newQueue[currentIndex].position - 1;
        newQueue[currentIndex + 1].position = newQueue[currentIndex + 1].position + 1;
      }
      
      return newQueue;
    });
  };

  const handleMoveUp = (id) => moveItem(id, 'up');
  const handleMoveDown = (id) => moveItem(id, 'down');
  
  const handleDelete = (id) => {
    setQueue(prevQueue => prevQueue.filter(item => item.id !== id));
  };
  
  const handleEdit = (id) => {
    console.log('Edit cast:', id);
    // TODO: Implement edit functionality
  };
  
  const handleToggleStatus = (id) => {
    setQueue(prevQueue => 
      prevQueue.map(item => 
        item.id === id 
          ? { ...item, status: item.status === 'active' ? 'paused' : 'active' }
          : item
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600">Use arrow buttons to reorder your scheduled casts</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">Export Queue</button>
          <button className="btn-primary">Optimize Timing</button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{queue.length}</div>
          <div className="text-sm text-gray-600">Total in Queue</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-600">Scheduled Today</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">23</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cast Queue</h2>
          <p className="text-sm text-gray-600">Use the arrow buttons to reorder your content</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {queue.map((cast) => (
              <QueueItem
                key={cast.id}
                cast={cast}
                getPriorityColor={getPriorityColor}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Queue Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Queue Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-2">Timing Strategy:</p>
            <ul className="space-y-1">
              <li>• Space out high-engagement content</li>
              <li>• Post during peak audience hours</li>
              <li>• Avoid posting too frequently</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Content Mix:</p>
            <ul className="space-y-1">
              <li>• Balance promotional and value content</li>
              <li>• Include engagement posts regularly</li>
              <li>• Plan for special events and launches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;
