import React from 'react';
import { Sparkles } from 'lucide-react';

const ProgressBar = ({ progress, currentItem, totalItems }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Text */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[9px] font-black text-brand-pink uppercase tracking-[0.4em]">Engine Active</p>
          <span className="text-sm font-serif font-bold text-brand-dark flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
            <span>Decoding Style Narrative</span>
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[9px] font-black text-brand-sage uppercase tracking-[0.3em] opacity-40">Analysis Depth</p>
          <span className="text-lg font-serif font-bold text-brand-pink italic">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-brand-cream/30 border border-brand-gray rounded-full h-4 overflow-hidden shadow-inner p-1">
          <div 
            className="h-full bg-brand-dark rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 to-transparent"></div>
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ backgroundSize: '200% 100%' }}></div>
          </div>
        </div>
      </div>

      {/* Milestone Indicators */}
      <div className="flex justify-between mt-8 relative px-2">
        {Array.from({ length: Math.min(totalItems, 12) }, (_, index) => {
          const itemIndex = Math.floor((index / 11) * (totalItems - 1));
          const isCompleted = itemIndex < currentItem;
          const isCurrent = itemIndex === currentItem - 1;
          
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-700 relative ${
                  isCompleted
                    ? 'bg-brand-pink shadow-[0_0_20px_rgba(212,136,152,0.4)] scale-125' 
                    : isCurrent
                    ? 'bg-brand-dark scale-110 shadow-xl border-white border-2'
                    : 'bg-brand-gray/50 scale-90 border-transparent'
                }`}
              >
                {isCompleted && (
                  <div className="absolute inset-0 rounded-full bg-brand-pink animate-ping opacity-40"></div>
                )}
                {isCurrent && (
                   <div className="absolute -inset-2 border border-brand-pink/20 rounded-full animate-spin-slow"></div>
                )}
              </div>
              {(index === 0 || index === Math.min(totalItems, 12) - 1) && (
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isCompleted || isCurrent ? 'text-brand-dark' : 'text-brand-sage/40'}`}>
                  {index === 0 ? 'Genesis' : 'Apex'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
