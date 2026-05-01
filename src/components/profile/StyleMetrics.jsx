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
      color: 'text-[#D48898]',
      bgColor: 'bg-[#FFF5F7] border border-[#FFD1DC]/50'
    },
    {
      label: 'Style Streak',
      value: `${userProfile.styleStreak} days`,
      icon: Zap,
      color: 'text-[#D48898]',
      bgColor: 'bg-[#FFF5F7] border border-[#FFD1DC]/50'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-black text-black mb-6">Style Metrics</h3>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
                <div key={metric.label} className={`text-center p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow ${metric.bgColor}`}>
                <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-3`} />
                <div className={`text-3xl font-black ${metric.color} mb-1`}>{metric.value}</div>
                <div className="text-gray-500 font-bold text-xs uppercase tracking-widest">{metric.label}</div>
                </div>
            );
            })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-[#FFF5F7] to-white rounded-[2rem] border border-[#FFD1DC]/60 shadow-[0_4px_24px_rgba(255,192,203,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD1DC]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <h4 className="text-black font-black mb-3 text-lg flex items-center gap-2 relative z-10">
             <Zap className="w-5 h-5 text-[#D48898] fill-[#FFD1DC]" />
             Your Style Superpower
          </h4>
          <p className="text-gray-600 font-medium leading-relaxed relative z-10">
            {getPersonalityDescription()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleMetrics;