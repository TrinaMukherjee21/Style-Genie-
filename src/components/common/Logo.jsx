import React from 'react';

const StyleGenieLogo = ({ size = 'md', animated = true, showText = true }) => {
  const sizes = {
    sm: { container: 'w-10 h-10', width: '32', textStyle: 'text-2xl', textGenie: 'text-sm', sub: 'text-[0.5rem]' },
    md: { container: 'w-14 h-14', width: '48', textStyle: 'text-3xl', textGenie: 'text-lg', sub: 'text-xs' },
    lg: { container: 'w-18 h-18', width: '64', textStyle: 'text-5xl', textGenie: 'text-2xl', sub: 'text-sm' },
    xl: { container: 'w-28 h-28', width: '96', textStyle: 'text-7xl', textGenie: 'text-4xl', sub: 'text-base' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center space-x-4">
      {/* Golden Genie Lamp Logo */}
      <div className={`${currentSize.container} relative flex-shrink-0 flex items-center justify-center`}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${animated ? 'animate-fade-in' : ''}`}
        >
          {/* Golden Smoke flowing up */}
          <path 
            d="M50 85 C40 70, 60 55, 50 40 C45 30, 50 20, 50 15" 
            stroke="#d4af37" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-40"
          />
          <path 
            d="M50 85 C45 75, 55 60, 50 45 C48 35, 50 20, 50 15" 
            stroke="#eacc6e" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="opacity-60"
          />
          
          {/* Hanger integrated into smoke */}
          <path 
            d="M25 40 L50 25 L75 40" 
            stroke="#d4af37" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M50 25 C50 18, 56 18, 56 14 C56 10, 50 12, 50 12" 
            stroke="#d4af37" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none" 
          />
          
          {/* Sun/Starburst at the top */}
          <circle cx="50" cy="5" r="3" fill="#eacc6e" />
          <path d="M50 -2 L50 1 M50 9 L50 12 M43 5 L46 5 M54 5 L57 5" stroke="#eacc6e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M45 0 L47 2 M53 10 L55 12 M55 0 L53 2 M45 10 L47 8" stroke="#eacc6e" strokeWidth="1" strokeLinecap="round" />

          {/* Golden Diamonds */}
          <path d="M75 15 L78 22 L75 29 L72 22 Z" fill="#d4af37" className="opacity-80" />
          <path d="M65 25 L67 30 L65 35 L63 30 Z" fill="#eacc6e" className="opacity-90" />

          {/* Lamp Base */}
          <ellipse cx="50" cy="95" rx="30" ry="12" fill="#d4af37" />
          <path d="M20 95 C20 85, 30 75, 50 75 C70 75, 80 85, 80 95 Z" fill="#eacc6e" />
          {/* Handle */}
          <path d="M80 90 C90 90, 95 95, 80 100" stroke="#d4af37" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Spout */}
          <path d="M20 92 C12 90, 8 95, 10 98" stroke="#d4af37" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* App Name Typography - All Gold */}
      {showText && (
        <div className="flex flex-col justify-center translate-y-1">
          <span 
            className={`${currentSize.textStyle} font-serif italic text-brand-gold leading-none tracking-tight`}
            style={{ textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)' }}
          >
            Style
          </span>
          <span className={`${currentSize.textGenie} font-sans font-medium text-brand-goldLight tracking-[0.2em] leading-tight uppercase mt-1`}>
            Genie
          </span>

        </div>
      )}
    </div>
  );
};

export default StyleGenieLogo;