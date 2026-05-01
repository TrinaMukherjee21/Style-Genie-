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
    <div className="bg-white rounded-[3rem] p-10 border border-brand-gray shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full transition-all duration-1000 group-hover:scale-150"></div>
      <h3 className="text-2xl font-serif font-bold text-brand-dark mb-10 flex items-center gap-4 relative z-10">
        <Star className="w-6 h-6 text-brand-pink" />
        Atelier Metrics
      </h3>
      
      <div className="space-y-5 relative z-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-brand-cream/20 p-5 rounded-2xl border border-brand-gray/50 hover:bg-white hover:border-brand-pink/30 hover:shadow-2xl transition-all duration-500 group/stat">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="p-3 rounded-xl bg-brand-dark text-white shadow-lg group-hover/stat:bg-brand-pink transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-brand-sage font-black uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                    <div className="text-[9px] text-brand-dark font-bold opacity-40 uppercase tracking-widest">{stat.change}</div>
                  </div>
                </div>
                <div className="font-serif font-bold text-xl text-brand-dark group-hover/stat:text-brand-pink transition-colors">
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Weekly Summary */}
      <div className="mt-10 p-8 bg-brand-dark rounded-[2rem] shadow-2xl relative overflow-hidden group/weekly">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/10 to-transparent opacity-0 group-hover/weekly:opacity-100 transition-opacity duration-1000"></div>
        <h4 className="text-white font-serif font-bold mb-6 text-base flex items-center gap-3 relative z-10">
          <Calendar className="w-5 h-5 text-brand-pink" />
          The Weekly Cycle
        </h4>
        <div className="grid grid-cols-2 gap-5 relative z-10">
          <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Curation</div>
            <div className="text-brand-pink font-serif font-bold text-2xl">18</div>
          </div>
          <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Precision</div>
            <div className="text-brand-pink font-serif font-bold text-2xl">94%</div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="mt-8 p-5 bg-brand-cream border border-brand-pink/10 rounded-2xl text-center shadow-inner group/badge overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-pink/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="text-brand-dark font-black text-[10px] uppercase tracking-[0.3em]">Signature Master</div>
          <div className="text-brand-pink font-bold text-[9px] mt-1 uppercase tracking-widest opacity-60">Unlocked in this cycle</div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;