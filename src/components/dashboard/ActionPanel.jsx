import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search, Settings, Share2, Gift, Zap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useUserContext } from '../../context/UserContext';

const ActionPanel = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserContext();

  const actions = [
    {
      label: 'Browse All',
      icon: Search,
      onClick: () => {
        // Mock function - could navigate to a browse page
        console.log('Browse all recommendations');
      },
      className: 'bg-gray-700 hover:bg-gray-600 text-white',
      description: 'See all recommendations'
    },
    {
      label: 'Share Style',
      icon: Share2,
      onClick: () => {
        // Mock share functionality
        const shareText = `Check out my style on StyleGenie!`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText + ` ${window.location.origin}`);
          alert('Share link copied!');
        } else {
          alert('Share: ' + shareText);
        }
      },
      className: 'bg-gray-700 hover:bg-gray-600 text-white',
      description: 'Show off your fashion vibe'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-brand-gray shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cream/40 blur-3xl rounded-full"></div>
        <h3 className="text-xl font-serif font-bold text-brand-dark mb-8 relative z-10">Quick Directives</h3>
        <div className="space-y-4 relative z-10">
          {[
            {
              label: 'Explore Boutique',
              icon: Search,
              onClick: () => navigate('/products'),
              className: 'bg-brand-dark text-white hover:bg-brand-black shadow-lg',
              description: 'Access the complete curated gallery'
            },
            {
              label: 'Replicate DNA',
              icon: Share2,
              onClick: () => {
                const shareText = `Explore my StyleGenie DNA!`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(shareText + ` ${window.location.origin}`);
                  alert('DNA replication link copied!');
                }
              },
              className: 'bg-white text-brand-sage border border-brand-gray hover:border-brand-pink/30 hover:text-brand-dark',
              description: 'Share your aesthetic signature'
            }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`w-full py-5 px-6 rounded-2xl transition-all duration-500 flex items-center space-x-5 ${action.className} hover:-translate-y-1 hover:shadow-2xl group/btn`}
              >
                <div className={`p-3 rounded-xl transition-all duration-500 ${action.className.includes('bg-brand-dark') ? 'bg-white/10' : 'bg-brand-cream/50'}`}>
                  <Icon className={`w-5 h-5 ${action.className.includes('bg-brand-dark') ? 'text-brand-pink' : 'text-brand-sage group-hover/btn:text-brand-pink'}`} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-xs uppercase tracking-[0.2em] mb-1">{action.label}</div>
                  <div className="text-[10px] opacity-60 font-medium uppercase tracking-widest">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-brand-dark rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-pink/10 blur-[60px] rounded-full animate-pulse"></div>
        <div className="flex items-center gap-5 mb-6 relative z-10">
          <div className="w-12 h-12 bg-brand-pink/20 rounded-2xl flex items-center justify-center border border-brand-pink/30">
            <Zap className="w-6 h-6 text-brand-pink" />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Daily Spark</h3>
        </div>
        <p className="text-white/60 text-sm mb-10 leading-relaxed relative z-10">
          Transcend your comfort zone today. Our Muse detected a "guilty pleasure" silhouette that's 76% divergent from your typical archive.
        </p>
        <button 
          onClick={() => alert('Ascension initiated! Check your narrative for the surprise.')}
          className="w-full bg-brand-pink text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-brand-dark transition-all duration-500 relative z-10 shadow-xl"
        >
          Embrace Transformation
        </button>
      </div>

      {/* Style Tip */}
      <div className="bg-brand-cream/30 rounded-[2rem] p-8 border border-brand-pink/5 relative overflow-hidden">
        <h4 className="text-brand-pink font-black text-[10px] mb-4 uppercase tracking-[0.4em] flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-brand-pink rounded-full"></div>
          Atelier Insight
        </h4>
        <p className="text-brand-sage text-[11px] font-medium leading-relaxed uppercase tracking-wider opacity-80">
          Your aesthetic parallel in Tokyo just curated vintage textures. Consider integrating artisanal linen for your next silhouette.
        </p>
      </div>
    </div>
  );
};

export default ActionPanel;