import React from 'react';
import { Sparkles } from 'lucide-react';

const ProgressBar = ({ progress, currentItem, totalItems }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Text */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-100 flex items-center space-x-2 brightness-110">
          <Sparkles className="w-4 h-4 text-brand-gold animate-spin" />
          <span>Decoding Your Style DNA</span>
        </span>
        <span className="text-sm font-bold text-brand-goldLight brightness-125">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 via-purple-400 to-[#d4af37]/5 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent "></div>
          </div>
        </div>
      </div>

      {/* Milestone Indicators */}
      <div className="flex justify-between mt-6 relative">
        {Array.from({ length: Math.min(totalItems, 12) }, (_, index) => {
          const itemIndex = Math.floor((index / 11) * (totalItems - 1));
          const isCompleted = itemIndex < currentItem;
          const isCurrent = itemIndex === currentItem - 1;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-brand-gold border-white/50 shadow-[0_0_10px_rgba(212,175,55,0.4)] scale-125' 
                    : isCurrent
                    ? 'bg-brand-goldLight scale-110 shadow-lg shadow-brand-gold/50'
                    : 'bg-gray-600 scale-90'
                } border-2 ${
                  isCompleted || isCurrent ? 'border-white/50' : 'border-gray-700'
                }`}
              >
                {isCompleted && (
                  <div className="w-full h-full rounded-full bg-white/20 animate-ping"></div>
                )}
              </div>
              {(index === 0 || index === Math.min(totalItems, 12) - 1) && (
                <span className={`text-xs font-semibold ${isCompleted || isCurrent ? 'text-brand-gold' : 'text-gray-400'}`}>
                  {index === 0 ? 'Start' : 'Finish'}
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
