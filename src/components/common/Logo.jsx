import React from 'react';
import premiumLogo from '../../assets/images/stylegenie_logo_premium.png';

const StyleGenieLogo = ({ size = 'md', animated = true, showText = false }) => {
  const sizes = {
    sm: { container: 'w-28 h-14', textStyle: 'text-lg', textSub: 'text-[0.4rem]', gap: 'space-x-2' },
    md: { container: 'w-32 h-16', textStyle: 'text-2xl', textSub: 'text-[0.55rem]', gap: 'space-x-3' },
    lg: { container: 'w-48 h-24', textStyle: 'text-3xl', textSub: 'text-sm', gap: 'space-x-4' },
    xl: { container: 'w-80 h-40', textStyle: 'text-5xl', textSub: 'text-lg', gap: 'space-x-6' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${animated ? 'animate-fade-in' : ''}`}>
      {/* Premium Image Logo */}
      <div className={`${currentSize.container} relative flex-shrink-0 flex items-center justify-center`}>
        <img 
          src={premiumLogo} 
          alt="StyleGenie Premium" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Optional App Name Typography - Only shown if explicitly requested and size is large enough */}
      {showText && size === 'lg' && (
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-serif text-brand-sage tracking-[0.3em] uppercase">Style</span>
            <span className="text-sm font-serif text-brand-pink tracking-[0.3em] uppercase">Genie</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleGenieLogo;