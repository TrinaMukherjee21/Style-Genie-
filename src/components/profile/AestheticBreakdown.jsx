import React from 'react';
import { useUserContext } from '../../context/UserContext';
import { useProfile } from '../../hooks/useProfile';

const AestheticBreakdown = () => {
  const { userProfile } = useUserContext();
  const { getAestheticColor } = useProfile();

  if (!userProfile?.aesthetics) return null;

  const aesthetics = Object.entries(userProfile.aesthetics)
    .sort(([, a], [, b]) => b - a)
    .filter(([, percentage]) => percentage > 0);

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Aesthetic Breakdown</h3>
      <div className="space-y-4">
        {aesthetics.map(([aesthetic, percentage]) => (
          <div key={aesthetic}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300 capitalize">{aesthetic}</span>
              <span className="text-brand-gold opacity-50 font-bold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${getAestheticColor(aesthetic)} h-3 rounded-full transition-all duration-1000`}
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