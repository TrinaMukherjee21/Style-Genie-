import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const StyleDNA = () => {
  const { userProfile } = useUserContext();

  if (!userProfile) return null;

  return (
    <div className="text-center mb-10">
      <div className="w-28 h-28 bg-[#FFF5F7] border-2 border-[#FFD1DC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(255,192,203,0.2)]">
        <User className="w-14 h-14 text-[#D48898]" />
      </div>
      <h2 className="text-3xl lg:text-4xl font-black text-black mb-3">Your Style DNA</h2>
      <div className="inline-flex items-center gap-2 bg-[#FFF5F7] px-4 py-2 rounded-full border border-[#FFD1DC]/50 mb-6">
        <Sparkles className="w-4 h-4 text-[#D48898]" />
        <p className="text-[#D48898] font-bold tracking-wide uppercase">{userProfile.personalityType}</p>
        <Sparkles className="w-4 h-4 text-[#D48898]" />
      </div>
      <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
        {userProfile.tasteProfile}
      </p>
    </div>
  );
};

export default StyleDNA;