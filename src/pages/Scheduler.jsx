import React, { useState } from 'react';
import { Calendar, Clock, Hash, AtSign, Send, Save } from 'lucide-react';

const Scheduler = () => {
  const [formData, setFormData] = useState({
    content: '',
    scheduledFor: '',
    priority: 'medium',
    castType: 'general',
    hashtags: '',
    mentions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send data to your Supabase backend
      console.log('Scheduling cast:', formData);
      
      // Reset form
      setFormData({
        content: '',
        scheduledFor: '',
        priority: 'medium',
        castType: 'general',
        hashtags: '',
        mentions: ''
      });
      
      // Show success message (you can use react-hot-toast here)
      alert('Cast scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling cast:', error);
      alert('Failed to schedule cast. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="glass-card">
        <div className="card-header">
          <h1 className="card-title">Schedule New Cast</h1>
          <p className="card-subtitle">Create and schedule your next Farcaster post</p>
        </div>
      </div>

      {/* Scheduling Form */}
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Cast Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-input min-h-[120px] resize-none"
              placeholder="What's on your mind? Share it with the Farcaster community..."
              required
              maxLength={280}
            />
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-400">
                {formData.content.length}/280 characters
              </span>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="scheduledFor" className="form-label">
                <Clock className="w-4 h-4 inline mr-2" />
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                id="scheduledFor"
                name="scheduledFor"
                value={formData.scheduledFor}
                onChange={handleInputChange}
                className="form-input"
                min={getCurrentDateTime()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Cast Type and Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="castType" className="form-label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Cast Type
              </label>
              <select
                id="castType"
                name="castType"
                value={formData.castType}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
                <option value="educational">Educational</option>
                <option value="engagement">Engagement</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hashtags" className="form-label">
                <Hash className="w-4 h-4 inline mr-2" />
                Hashtags
              </label>
              <input
                type="text"
                id="hashtags"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                className="form-input"
                placeholder="farcaster, web3, building"
              />
            </div>
          </div>

          {/* Mentions */}
          <div className="form-group">
            <label htmlFor="mentions" className="form-label">
              <AtSign className="w-4 h-4 inline mr-2" />
              Mentions
            </label>
            <input
              type="text"
              id="mentions"
              name="mentions"
              value={formData.mentions}
              onChange={handleInputChange}
              className="form-input"
              placeholder="@username1 @username2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Schedule Cast
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({
                  content: '',
                  scheduledFor: '',
                  priority: 'medium',
                  castType: 'general',
                  hashtags: '',
                  mentions: ''
                });
              }}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">💡 Pro Tips</h2>
          <p className="card-subtitle">Maximize your cast engagement</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Best Posting Times</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 10:00 AM - 2:00 PM (Peak engagement)</li>
              <li>• 7:00 PM - 9:00 PM (Evening audience)</li>
              <li>• Weekdays perform better than weekends</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Content Strategy</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Ask questions to encourage replies</li>
              <li>• Use relevant hashtags for discoverability</li>
              <li>• Engage with your audience within 1 hour</li>
              <li>• Mix content types for variety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
