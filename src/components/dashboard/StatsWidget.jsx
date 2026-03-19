import React from 'react';
import { TrendingUp, Target, Zap, Calendar, Star, Heart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const StatsWidget = () => {
  const { userProfile } = useAppContext();

  const stats = [
    {
      label: 'New Finds',
      value: '3',
      icon: Target,
      color: 'text-brand-gold',
      bgColor: 'from-[#d4af37]/20 border border-[#d4af37]/20 to-[#eacc6e]/5',
      change: '+2 from yesterday'
    },
    {
      label: 'Clout Score',
      value: userProfile?.cloutScore || '847',
      icon: TrendingUp,
      color: 'text-brand-gold',
      bgColor: 'from-[#d4af37]/20 border border-[#d4af37]/20 to-emerald-600',
      change: '↑ +12 today',
      trend: 'up'
    },
    {
      label: 'Style Streak',
      value: `${userProfile?.styleStreak || '12'} days`,
      icon: Zap,
      color: 'text-brand-gold',
      bgColor: 'from-[#c0a0e6]/20 border border-[#c0a0e6]/20 to-[#c0a0e6]/5',
      change: 'Keep it going!'
    },
    {
      label: 'Items Saved',
      value: '28',
      icon: Heart,
      color: 'text-brand-goldLight',
      bgColor: 'from-[#eacc6e]/20 border border-[#eacc6e]/20 to-rose-600',
      change: 'This month'
    }
  ];

  return (
    <div className="card-premium rounded-2xl p-6 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10 animate-card-hover">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Star className="w-5 h-5 mr-2 text-brand-gold " />
        Today's Stats
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-brand-navy/40 backdrop-blur-md p-4 rounded-xl hover:bg-brand-dark transition-all border border-purple-500/10 group shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.bgColor} `}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-bold">{stat.label}</div>
                    <div className="text-xs text-gray-200 group-hover:text-white transition-colors">{stat.change}</div>
                  </div>
                </div>
                <div className={`font-bold text-lg ${stat.color} `}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Weekly Summary */}
      <div className="mt-6 p-4 glass-effect rounded-xl border-2 border-purple-500/30 backdrop-blur-sm bg-gradient-to-r from-[#d4af37]/10 to-[#120D20]">
        <h4 className="text-white font-bold mb-2 text-sm flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-brand-gold " />
          📊 This Week
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 glass-effect rounded-lg">
            <div className="text-white font-medium">Items Found</div>
            <div className="text-brand-gold font-bold text-lg ">18</div>
          </div>
          <div className="text-center p-2 glass-effect rounded-lg">
            <div className="text-white font-medium">Accuracy</div>
            <div className="text-brand-gold font-bold text-lg ">94%</div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl text-center shadow-inner">
        <div className="text-white font-bold text-sm">🏆 Style Master</div>
        <div className="text-brand-goldLight font-semibold text-xs mt-1">Unlocked this week!</div>
      </div>
    </div>
  );
};

export default StatsWidget;