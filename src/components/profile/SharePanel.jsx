import React from 'react';
import { Share2, Download, Copy } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { generateShareText } from '../../utils/helpers';

const SharePanel = () => {
  const { userProfile } = useUserContext();

  if (!userProfile) return null;

  const handleShare = async () => {
    const shareText = generateShareText(userProfile);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My StyleGenie DNA',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + ` ${window.location.origin}`);
        alert('Share text copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleDownload = () => {
    const profileData = `
StyleGenie Profile
=================

Personality Type: ${userProfile.personalityType}
Clout Score: ${userProfile.cloutScore}
Style Streak: ${userProfile.styleStreak} days

Aesthetic Breakdown:
${Object.entries(userProfile.aesthetics)
  .sort(([, a], [, b]) => b - a)
  .map(([aesthetic, percentage]) => `${aesthetic}: ${percentage}%`)
  .join('\n')}

Taste Profile: ${userProfile.tasteProfile}
    `;

    const blob = new Blob([profileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stylegenie-profile.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyProfile = async () => {
    const shareText = generateShareText(userProfile);
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Profile summary copied to clipboard!');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="text-center bg-brand-cream/20 rounded-[3rem] p-10 border border-brand-pink/10 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full"></div>
      <h3 className="text-2xl font-serif font-bold text-brand-dark mb-10 relative z-10 tracking-tight">Broadcast Your <span className="text-brand-pink italic">DNA</span></h3>
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <button
          onClick={handleShare}
          className="bg-brand-dark text-white px-10 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-black hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 shadow-xl"
        >
          <Share2 className="w-5 h-5 text-brand-pink" />
          <span>Broadcast</span>
        </button>
        
        <button
          onClick={handleCopyProfile}
          className="bg-white hover:bg-brand-cream text-brand-sage border border-brand-gray px-10 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 hover:border-brand-pink/30 hover:text-brand-dark"
        >
          <Copy className="w-5 h-5" />
          <span>Replicate</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="bg-white hover:bg-brand-cream text-brand-sage border border-brand-gray px-10 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 hover:border-brand-pink/30 hover:text-brand-dark"
        >
          <Download className="w-5 h-5" />
          <span>Archive</span>
        </button>
      </div>
    </div>
  );
};

export default SharePanel;