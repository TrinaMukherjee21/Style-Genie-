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
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText + ` ${window.location.origin}`);
        alert('Share text copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleDownload = () => {
    // Create a simple text file with profile data
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
    <div className="mt-8 text-center">
      <h3 className="text-xl font-bold text-white mb-4">Share Your Style DNA</h3>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleShare}
          className="bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Profile</span>
        </button>
        
        <button
          onClick={handleCopyProfile}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Copy className="w-5 h-5" />
          <span>Copy Summary</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default SharePanel;