import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const StyleDNA = () => {
  const { userProfile, getUserDisplayName } = useUserContext();

  if (!userProfile) return null;

  return (
    <div className="text-center mb-8">
      <div className="w-24 h-24 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Your Style DNA</h2>
      <p className="text-brand-gold opacity-50 text-xl font-semibold mb-4">{userProfile.personalityType}</p>
      <p className="text-gray-300 max-w-2xl mx-auto">
        {userProfile.tasteProfile}
      </p>
    </div>
  );
};

export default StyleDNA;