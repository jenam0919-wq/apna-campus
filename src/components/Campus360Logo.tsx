import React from 'react';

export interface Campus360LogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  theme?: 'dark' | 'light' | 'colored';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

/**
 * Campus 360 Iconic Symbol
 * Incorporates:
 * 1. 360-degree circular ring forming a subtle 'C'
 * 2. Simplified architectural campus silhouette at center
 * 3. 5 connected service nodes (Student, Faculty, Admin, Hostel, Services)
 * 4. Geometric, scalable, minimal design
 */
export const Campus360Icon: React.FC<{
  size?: number;
  className?: string;
  theme?: 'dark' | 'light' | 'colored';
}> = ({ size = 36, className = '', theme = 'colored' }) => {
  // Theme color definitions
  const ringColor =
    theme === 'dark' ? '#3B82F6' : theme === 'light' ? '#2563EB' : '#2563EB';
  const buildingColor =
    theme === 'dark' ? '#F8FAFC' : theme === 'light' ? '#0F172A' : '#0F172A';
  const nodeColor =
    theme === 'dark' ? '#60A5FA' : theme === 'light' ? '#3B82F6' : '#3B82F6';
  const accentColor = '#38BDF8';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      aria-label="Apna Campus Logo"
    >
      <defs>
        <linearGradient id="c360Gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="c360DarkGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
      </defs>

      {/* 1. Subtle Outer Orbital Ring (360 Concept) */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke={theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.15)'}
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />

      {/* 2. Main Bold 'C' Arc (360-Degree Continuous Connected Circuit) */}
      {/* Starting at ~35deg and sweeping around to ~325deg, creating an open right side for the 'C' shape */}
      <path
        d="M 37 13.5 A 17.5 17.5 0 1 0 37 34.5"
        stroke={theme === 'dark' ? 'url(#c360DarkGrad)' : 'url(#c360Gradient)'}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* 3. Five Campus Service Nodes (Student, Faculty, Admin, Hostel, Services) */}
      {/* Node 1 - Top Center (Student) */}
      <circle cx="24" cy="6.5" r="2.8" fill={nodeColor} />
      <circle cx="24" cy="6.5" r="1.2" fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'} />

      {/* Node 2 - Top Right (Faculty) */}
      <circle cx="37" cy="13.5" r="2.8" fill={accentColor} />
      <circle cx="37" cy="13.5" r="1.2" fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'} />

      {/* Node 3 - Left (Admin) */}
      <circle cx="6.5" cy="24" r="2.8" fill={nodeColor} />
      <circle cx="6.5" cy="24" r="1.2" fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'} />

      {/* Node 4 - Bottom Center (Hostel) */}
      <circle cx="24" cy="41.5" r="2.8" fill={nodeColor} />
      <circle cx="24" cy="41.5" r="1.2" fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'} />

      {/* Node 5 - Bottom Right (Services / Operations) */}
      <circle cx="37" cy="34.5" r="2.8" fill={accentColor} />
      <circle cx="37" cy="34.5" r="1.2" fill={theme === 'dark' ? '#0F172A' : '#FFFFFF'} />

      {/* 4. Architectural Campus Center (Minimal Modern University Pediment & Columns) */}
      {/* Roof Gable / Pediment */}
      <path
        d="M 16 20.5 L 24 15.5 L 32 20.5 Z"
        fill={theme === 'dark' ? '#F8FAFC' : ringColor}
      />
      {/* Archway & Columns Plinth */}
      <path
        d="M 17 22 H 31 V 23.5 H 17 Z"
        fill={theme === 'dark' ? '#94A3B8' : '#64748B'}
      />
      {/* Left Column */}
      <rect
        x="18.5"
        y="23.5"
        width="2.5"
        height="6"
        rx="0.5"
        fill={theme === 'dark' ? '#E2E8F0' : buildingColor}
      />
      {/* Center Arch / Portal */}
      <path
        d="M 22.5 29.5 V 25.5 C 22.5 24.7 23.2 24 24 24 C 24.8 24 25.5 24.7 25.5 25.5 V 29.5 Z"
        fill={theme === 'dark' ? '#60A5FA' : '#2563EB'}
      />
      {/* Right Column */}
      <rect
        x="27"
        y="23.5"
        width="2.5"
        height="6"
        rx="0.5"
        fill={theme === 'dark' ? '#E2E8F0' : buildingColor}
      />
      {/* Base / Foundation Steps */}
      <rect
        x="16"
        y="29.5"
        width="16"
        height="2.5"
        rx="0.8"
        fill={theme === 'dark' ? '#F8FAFC' : buildingColor}
      />
    </svg>
  );
};

export const Campus360Logo: React.FC<Campus360LogoProps> = ({
  variant = 'horizontal',
  theme = 'colored',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  // Size calculations
  const iconSizes = {
    xs: 24,
    sm: 30,
    md: 38,
    lg: 48,
    xl: 60,
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Campus360Icon size={iconSizes[size]} theme={theme} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Icon with container styling */}
      <div
        className={`rounded-xl flex items-center justify-center shrink-0 ${
          isDark
            ? 'bg-slate-900/90 border border-slate-700/80 shadow-inner'
            : 'bg-white border border-slate-200/80 shadow-sm'
        } p-1.5`}
      >
        <Campus360Icon size={iconSizes[size]} theme={theme} />
      </div>

      {/* Brand Text Lockup */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-tight font-sans ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            Apna{' '}
            <span
              className={
                isDark
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300'
                  : 'text-[#2563EB]'
              }
            >
              Campus
            </span>
          </span>
          <span
            className={`font-semibold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
              isDark
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'bg-blue-50 text-[#2563EB] border border-blue-200'
            }`}
          >
            Connect
          </span>
        </div>

        {(showTagline || variant === 'full') && (
          <p
            className={`font-medium tracking-normal mt-1 truncate ${taglineSizes[size]} ${
              isDark ? 'text-slate-400' : 'text-[#64748B]'
            }`}
          >
            One Campus. Everything Connected.
          </p>
        )}
      </div>
    </div>
  );
};
