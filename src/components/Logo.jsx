import React from 'react';

const Logo = ({ size = 'default', className = '', showText = true }) => {
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
      {/* Logo Icon - Using exact user image */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <img 
          src="/boomerang-logo.png" 
          alt="Boomerang Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Logo Text - Optional */}
      {showText && (
        <span className={`ml-3 font-bold text-white ${textSizes[size]} tracking-tight`}>
          Boomerang
        </span>
      )}
    </div>
  );
};

export default Logo;
