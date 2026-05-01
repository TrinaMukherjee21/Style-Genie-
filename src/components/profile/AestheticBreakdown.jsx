import React from 'react';
import { useUserContext } from '../../context/UserContext';
import { useProfile } from '../../hooks/useProfile';

const AestheticBreakdown = () => {
  const { userProfile } = useUserContext();

  if (!userProfile?.aesthetics) return null;

  const aesthetics = Object.entries(userProfile.aesthetics)
    .sort(([, a], [, b]) => b - a)
    .filter(([, percentage]) => percentage > 0);

  // Remapping aesthetic colors to the light theme
  const getLightColor = (aesthetic) => {
    const colors = {
      minimalist: 'from-[#FFD1DC] to-[#D48898]',
      vintage: 'from-[#F59E0B] to-[#D97706]',
      streetwear: 'from-[#fca5a5] to-[#ef4444]',
      boho: 'from-[#a78bfa] to-[#8b5cf6]',
      formal: 'from-[#9ca3af] to-[#4b5563]',
      casual: 'from-[#60a5fa] to-[#3b82f6]',
      grunge: 'from-[#d1d5db] to-[#1f2937]',
      maximalist: 'from-[#f472b6] to-[#ec4899]'
    };
    return colors[aesthetic.toLowerCase()] || 'from-[#FFD1DC] to-[#D48898]';
  };

  return (
    <div>
      <h3 className="text-xl font-black text-black mb-6">Aesthetic Breakdown</h3>
      <div className="space-y-5">
        {aesthetics.map(([aesthetic, percentage]) => (
          <div key={aesthetic} className="group">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 font-bold capitalize group-hover:text-black transition-colors">{aesthetic}</span>
              <span className="text-[#D48898] font-black">{percentage}%</span>
            </div>
            <div className="w-full bg-[#FFF5F7] rounded-full h-3.5 border border-[#FFD1DC]/40 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getLightColor(aesthetic)} h-full rounded-full transition-all duration-1000 shadow-inner`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AestheticBreakdown;