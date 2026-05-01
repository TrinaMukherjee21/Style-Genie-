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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {genderOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleGenderSelect(option.value)}
            className={`
              p-8 rounded-3xl border-2 transition-all duration-500 text-left group
              ${selectedGender === option.value
                ? 'border-[#DCB5BE] bg-[#EEDFE3]/10 shadow-[0_15px_40px_rgba(220,181,190,0.15)]'
                : 'border-[#EEEDEB] bg-white hover:border-[#DCB5BE]/50 hover:bg-[#F5F4F3]'
              }
            `}
          >
            <div className="flex items-center space-x-5">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{option.icon}</div>
              <div className="flex-1">
                <h3 className={`font-serif font-bold text-lg mb-1 ${selectedGender === option.value ? 'text-[#333333]' : 'text-[#555555]'}`}>
                  {option.label}
                </h3>
                <p className="text-[#8E8E8E] text-xs font-medium uppercase tracking-widest opacity-70">
                  {option.description}
                </p>
              </div>
              {selectedGender === option.value && (
                <div className="text-[#DCB5BE]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedGender && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-[#89A293] font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#89A293] rounded-full"></span>
            Selection captured for your style profile
          </p>
        </div>
      )}
    </div>
  );
};

export default GenderSelector;