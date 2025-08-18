import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Coming soon! Account settings and preferences.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
