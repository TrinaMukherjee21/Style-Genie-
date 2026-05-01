import React from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import StyleDNA from '../components/profile/StyleDNA';
import AestheticBreakdown from '../components/profile/AestheticBreakdown';
import StyleMetrics from '../components/profile/StyleMetrics';
import SharePanel from '../components/profile/SharePanel';

const ProfilePage = () => {
  const { userProfile } = useUserContext();
  const navigate = useNavigate();

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="text-center bg-brand-cream/30 p-16 rounded-[3rem] shadow-2xl border border-brand-gray max-w-lg w-full mx-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full transition-all duration-1000 group-hover:scale-150"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">Archive Empty</h2>
            <p className="text-brand-sage font-medium mb-12 uppercase tracking-[0.2em] text-[11px] leading-relaxed">Illuminate your style narrative by completing the Muse Discovery. We await your aesthetic signature.</p>
            <button 
              onClick={() => navigate('/quiz')}
              className="w-full bg-brand-dark hover:bg-brand-pink text-white px-10 py-5 rounded-2xl transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1"
            >
              Begin Discovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Premium brand bloom */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-pink/10 blur-[120px] rounded-full point-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-brand-gray shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full"></div>
          
          <StyleDNA />
          
          <div className="grid md:grid-cols-2 gap-12 mt-16 pt-12 border-t border-brand-gray/50">
            <AestheticBreakdown />
            <StyleMetrics />
          </div>
          
          <div className="mt-12 pt-12 border-t border-brand-gray/50">
             <SharePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;