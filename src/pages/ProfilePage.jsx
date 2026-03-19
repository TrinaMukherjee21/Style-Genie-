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
  
  console.log('ProfilePage: userProfile =', userProfile);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center pt-16">
        <div className="text-center bg-dark-card p-8 rounded-2xl shadow-lg border-2 border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">No profile found!</h2>
          <p className="text-gray-300 mb-6">Take the Taste Sniffer Quiz to create your profile and discover your style DNA.</p>
          <button 
            onClick={() => navigate('/quiz')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl transition-colors font-medium"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-dark-card rounded-3xl p-8 border-2 border-purple-500/30 shadow-lg">
          <StyleDNA />
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <AestheticBreakdown />
            <StyleMetrics />
          </div>
          
          <SharePanel />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;