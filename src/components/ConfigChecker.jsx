import React, { useState, useEffect } from 'react';
import { validateApiKey, checkFonbnkHealth } from '../lib/fonbnk';

export default function ConfigChecker() {
  const [configStatus, setConfigStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    setLoading(true);
    
    try {
      // Check API key
      const keyValidation = validateApiKey();
      
      // Check service health
      let serviceHealth = { status: 'unknown', error: 'Not checked' };
      if (keyValidation.valid) {
        try {
          serviceHealth = await checkFonbnkHealth();
        } catch (error) {
          serviceHealth = { status: 'error', error: error.message };
        }
      }

      setConfigStatus({
        apiKey: keyValidation,
        service: serviceHealth,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setConfigStatus({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'invalid':
      case 'unreachable':
      case 'error':
      case 'unauthorized':
      case 'forbidden':
        return 'text-red-600 bg-red-100';
      case 'timeout':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
      case 'healthy':
        return '✅';
      case 'invalid':
      case 'unreachable':
      case 'error':
      case 'unauthorized':
      case 'forbidden':
        return '❌';
      case 'timeout':
        return '⚠️';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Checking configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Configuration Status</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* API Key Status */}
      <div className="flex items-center space-x-2 mb-2">
        <span>{getStatusIcon(configStatus.apiKey?.valid ? 'valid' : 'invalid')}</span>
        <span className="text-sm">API Key</span>
        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(configStatus.apiKey?.valid ? 'valid' : 'invalid')}`}>
          {configStatus.apiKey?.valid ? 'Valid' : 'Invalid'}
        </span>
      </div>

      {/* Service Status */}
      {configStatus.service && (
        <div className="flex items-center space-x-2 mb-2">
          <span>{getStatusIcon(configStatus.service.status)}</span>
          <span className="text-sm">Service</span>
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(configStatus.service.status)}`}>
            {configStatus.service.status}
          </span>
        </div>
      )}

      {/* Environment */}
      <div className="flex items-center space-x-2 mb-3">
        <span>🌍</span>
        <span className="text-sm">Environment</span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {configStatus.environment || 'Unknown'}
        </span>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {configStatus.apiKey && (
            <div className="text-xs">
              <strong>API Key:</strong> {configStatus.apiKey.valid ? configStatus.apiKey.apiKey : 'Not configured'}
            </div>
          )}
          
          {configStatus.service && (
            <div className="text-xs">
              <strong>Service Status:</strong> {configStatus.service.status}
              {configStatus.service.error && (
                <div className="text-red-600 mt-1">
                  <strong>Error:</strong> {configStatus.service.error}
                </div>
              )}
            </div>
          )}
          
          {configStatus.timestamp && (
            <div className="text-xs text-gray-500">
              <strong>Last Check:</strong> {new Date(configStatus.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-3">
        <button
          onClick={checkConfiguration}
          className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Recheck Configuration
        </button>
      </div>
    </div>
  );
}
