import React from 'react';

const Logo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow for boomerang */}
          <defs>
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Purple Boomerang */}
          <path
            d="M8 20 Q20 8 32 20 Q20 32 8 20"
            fill="url(#purpleGradient)"
            filter="url(#glow-purple)"
            className="drop-shadow-lg"
          />
          
          {/* Orange Energy Lines */}
          <path
            d="M18 18 Q20 16 22 18"
            stroke="#ff6b35"
            strokeWidth="2"
            filter="url(#glow-orange)"
            className="drop-shadow-lg"
          />
          <path
            d="M18 20 Q20 18 22 20"
            stroke="#ff6b35"
            strokeWidth="2"
            filter="url(#glow-orange)"
            className="drop-shadow-lg"
          />
          <path
            d="M18 22 Q20 20 22 22"
            stroke="#ff6b35"
            strokeWidth="2"
            filter="url(#glow-orange)"
            className="drop-shadow-lg"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      <span className={`ml-3 font-bold text-white ${textSizes[size]} tracking-tight`}>
        Boomerang
      </span>
    </div>
  );
};

export default Logo;
