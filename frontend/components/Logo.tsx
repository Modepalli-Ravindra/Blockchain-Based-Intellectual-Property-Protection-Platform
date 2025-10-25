import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blockchain Network Nodes */}
          <g opacity="0.9">
            {/* Left side nodes */}
            <rect x="5" y="15" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            <rect x="5" y="35" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            <rect x="5" y="55" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            
            {/* Right side nodes */}
            <rect x="25" y="20" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            <rect x="25" y="40" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            <rect x="25" y="60" width="12" height="12" fill="#94a3b8" stroke="#3b82f6" strokeWidth="1" rx="2"/>
            
            {/* Connection lines */}
            <line x1="17" y1="21" x2="25" y2="26" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
            <line x1="17" y1="41" x2="25" y2="46" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
            <line x1="17" y1="61" x2="25" y2="66" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
            <line x1="11" y1="27" x2="11" y2="33" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
            <line x1="31" y1="32" x2="31" y2="38" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
            <line x1="31" y1="52" x2="31" y2="58" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
          </g>
          
          {/* Shield */}
          <g transform="translate(45, 20)">
            <path
              d="M25 5 L45 15 L45 35 L25 45 L5 35 L5 15 Z"
              fill="#3b82f6"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Shield content lines */}
            <line x1="15" y1="20" x2="35" y2="20" stroke="#ffffff" strokeWidth="1.5"/>
            <line x1="15" y1="25" x2="30" y2="25" stroke="#ffffff" strokeWidth="1.5"/>
            <line x1="15" y1="30" x2="35" y2="30" stroke="#ffffff" strokeWidth="1.5"/>
            <line x1="15" y1="35" x2="25" y2="35" stroke="#ffffff" strokeWidth="1.5"/>
            {/* Exclamation mark */}
            <circle cx="18" cy="18" r="1.5" fill="#ffffff"/>
            <line x1="18" y1="21" x2="18" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-blue-600 dark:text-blue-300 ${textSizeClasses[size]}`}>
            Blockchain IP Protect
          </h1>
          <p className={`text-xs text-slate-500 dark:text-slate-400 ${size === 'sm' ? 'hidden' : ''}`}>
            Intellectual Property Protection Platform
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;

