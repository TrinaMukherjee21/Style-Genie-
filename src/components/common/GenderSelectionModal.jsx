import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const GenderSelectionModal = ({ isOpen, onClose, onGenderSelect }) => {
  const { setGender } = useUserContext();
  const [selectedGender, setSelectedGender] = useState(null);

  const genderOptions = [
    { value: 'female', label: 'Female', icon: '👩', description: 'Women\'s fashion' },
    { value: 'male', label: 'Male', icon: '👨', description: 'Men\'s fashion' },
    { value: 'non-binary', label: 'Non-Binary', icon: '🌈', description: 'Gender-neutral' },
    { value: 'prefer-not-to-say', label: 'Skip', icon: '✨', description: 'Mixed recommendations' }
  ];

  const handleGenderSelect = (gender) => {
    console.log('GenderSelectionModal: Gender selected:', gender);
    setSelectedGender(gender);
    setGender(gender);
    localStorage.setItem('user_gender_preference', gender);
    console.log('GenderSelectionModal: Gender saved to localStorage:', localStorage.getItem('user_gender_preference'));
    if (onGenderSelect) {
      onGenderSelect(gender);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-navy rounded-2xl border-2 border-purple-500/30 shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                Choose Your Style
              </h2>
              <p className="text-gray-300 text-sm">
                Help us personalize your recommendations
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Gender Options */}
        <div className="p-6 space-y-3">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleGenderSelect(option.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                    {option.label}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <p className="text-gray-500 text-xs text-center">
            You can change this anytime in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderSelectionModal;