import React from 'react';
import { TrendingUp, Zap, Calendar, Target } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useProfile } from '../../hooks/useProfile';

const StyleMetrics = () => {
  const { userProfile } = useUserContext();
  const { getPersonalityDescription } = useProfile();

  if (!userProfile) return null;

  const metrics = [
    {
      label: 'Clout Score',
      value: userProfile.cloutScore,
      icon: TrendingUp,
      color: 'text-brand-gold opacity-50',
      bgColor: 'bg-purple-600/20'
    },
    {
      label: 'Style Streak',
      value: `${userProfile.styleStreak} days`,
      icon: Zap,
      color: 'text-brand-gold opacity-50',
      bgColor: 'bg-green-600/20'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Style Metrics</h3>
      <div className="space-y-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`text-center p-4 rounded-xl ${metric.bgColor}`}>
              <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
              <div className={`text-4xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
              <div className="text-gray-300 text-sm">{metric.label}</div>
            </div>
          );
        })}

        <div className="mt-8 p-4 bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] rounded-xl border border-purple-500/30">
          <h4 className="text-white font-bold mb-2">Your Style Superpower:</h4>
          <p className="text-gray-300 text-sm">
            {getPersonalityDescription()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleMetrics;