import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Calendar, Clock, Users, BarChart3, Settings, Plus, DollarSign, CreditCard } from 'lucide-react';
import './App.css';

// Import Farcaster Mini App SDK
import { sdk } from '@farcaster/miniapp-sdk';

// Import components
import Logo from './components/Logo';

// Import pages
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import Queue from './pages/Queue';
import Team from './pages/Team';
import SettingsPage from './pages/Settings';
import Pricing from './pages/Pricing';
import Subscriptions from './pages/Subscriptions';

// Navigation component
function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/scheduler', label: 'Scheduler', icon: Calendar },
    { path: '/queue', label: 'Queue', icon: Clock },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/pricing', label: 'Pricing', icon: DollarSign },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard }
  ];

  return (
    <nav className="nav-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="default" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side - Quick Actions & User */}
          <div className="flex items-center space-x-4">
            <button className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Cast
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-sm text-white hover:text-gray-200 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="hidden md:block font-medium">John Doe</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mb-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item block ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3 inline" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Main App component
function App() {
  // Initialize Farcaster Mini App SDK when app is ready
  useEffect(() => {
    const initializeFarcasterSDK = async () => {
      try {
        // Wait for the app to be fully loaded
        await sdk.actions.ready();
        console.log('Farcaster Mini App SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Farcaster Mini App SDK:', error);
        // Continue loading the app even if SDK fails
      }
    };

    initializeFarcasterSDK();
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </main>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
