import { useCallback, useMemo } from 'react';
import { useUserContext } from '../context/UserContext';

export function useProfile() {
  const { userProfile, updateUserProfile } = useUserContext();

  const getAestheticColor = useCallback((aesthetic) => {
    const colors = {
      minimalist: 'from-gray-500 to-slate-600',
      cyberpunk: 'from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5',
      vintage: 'from-amber-500 to-orange-500',
      maximalist: 'from-red-500 to-rose-600',
      gothic: 'from-gray-800 to-black',
      boho: 'from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5',
      preppy: 'from-blue-500 to-indigo-500',
      streetwear: 'from-yellow-500 to-orange-500'
    };
    return colors[aesthetic] || 'from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5';
  }, []);

  const topAesthetics = useMemo(() => {
    if (!userProfile?.aesthetics) return [];
    
    return Object.entries(userProfile.aesthetics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([aesthetic, percentage]) => ({
        name: aesthetic,
        percentage,
        color: getAestheticColor(aesthetic)
      }));
  }, [userProfile?.aesthetics, getAestheticColor]);

  const updateCloutScore = useCallback((increment) => {
    if (userProfile) {
      const updates = {
        cloutScore: userProfile.cloutScore + increment
      };
      updateUserProfile(updates);
    }
  }, [userProfile, updateUserProfile]);

  const updateStyleStreak = useCallback((days) => {
    if (userProfile) {
      const updates = {
        styleStreak: days
      };
      updateUserProfile(updates);
    }
  }, [userProfile, updateUserProfile]);

  const getPersonalityDescription = useCallback(() => {
    if (!userProfile) return '';
    
    const { personalityType, aesthetics } = userProfile;
    const topAesthetic = Object.entries(aesthetics)
      .sort(([, a], [, b]) => b - a)[0];
    
    const descriptions = {
      'Tech-Forward Minimalist': `You're a digital native who believes in "less is more" but with a futuristic twist. Clean lines meet cutting-edge functionality in your world.`,
      'Vintage Maximalist': `You're a curator of the past who believes more is more. Every piece tells a story, and your style is a beautiful collision of eras.`,
      'Cyberpunk Minimalist': `You live in the future but dress for function. Your aesthetic is "what if Apple designed clothes for hackers?"`,
      'Bohemian Dreamer': `You're a free spirit who dresses like poetry looks. Your style flows like your thoughts - organic, artistic, and effortlessly beautiful.`
    };
    
    return descriptions[personalityType] || `You're a unique blend of ${topAesthetic[0]} vibes with your own special twist.`;
  }, [userProfile]);

  return {
    userProfile,
    topAesthetics,
    updateCloutScore,
    updateStyleStreak,
    getPersonalityDescription,
    getAestheticColor
  };
}