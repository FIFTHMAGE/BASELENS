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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Better sizing and spacing */}
          <div className="flex items-center">
            <Logo size="large" className="mr-6" />
          </div>

          {/* Desktop Navigation - Better spacing */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side - Better button spacing */}
          <div className="flex items-center space-x-4">
            <button className="btn-primary px-6 py-3 text-base">
              <Plus className="w-5 h-5 mr-3" />
              New Cast
            </button>
            
            {/* User Menu - Better spacing */}
            <div className="relative ml-4">
              <button className="flex items-center space-x-3 text-base text-white hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-base font-medium">JD</span>
                </div>
                <span className="hidden xl:block font-medium">John Doe</span>
              </button>
            </div>

            {/* Mobile menu button - Better positioning */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-lg text-white hover:bg-white/10 transition-colors ml-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Better spacing */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass-card mb-6 mt-4">
            <div className="px-4 py-4 space-y-3">
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
                    <Icon className="w-5 h-5 mr-3" />
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
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
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
