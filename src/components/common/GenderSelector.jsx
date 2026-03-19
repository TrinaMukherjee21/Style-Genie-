import React from 'react';
import { useUserContext } from '../../context/UserContext';

const GenderSelector = ({ onGenderSelect, selectedGender }) => {
  const { setGender } = useUserContext();

  const handleGenderSelect = (gender) => {
    setGender(gender);
    if (onGenderSelect) {
      onGenderSelect(gender);
    }
  };

  const genderOptions = [
    { value: 'female', label: 'Female', icon: '👩', description: 'Women\'s fashion and style' },
    { value: 'male', label: 'Male', icon: '👨', description: 'Men\'s fashion and style' },
    { value: 'non-binary', label: 'Non-Binary', icon: '🌈', description: 'Gender-neutral fashion' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '✨', description: 'Mixed style recommendations' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 bg-clip-text text-transparent">
          Choose Your Style Journey
        </h2>
        <p className="text-gray-300 text-lg">
          Help us personalize your fashion recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {genderOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleGenderSelect(option.value)}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-300 text-left
              ${selectedGender === option.value
                ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                : 'border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-400/10'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{option.icon}</div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {option.label}
                </h3>
                <p className="text-gray-400 text-sm">
                  {option.description}
                </p>
              </div>
              {selectedGender === option.value && (
                <div className="text-brand-gold opacity-50">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedGender && (
        <div className="mt-6 text-center">
          <p className="text-brand-gold opacity-50 font-medium">
            ✓ Perfect! Your style preferences will be tailored accordingly
          </p>
        </div>
      )}
    </div>
  );
};

export default GenderSelector;