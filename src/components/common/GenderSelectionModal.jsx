import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const GenderSelectionModal = ({ isOpen, onClose, onGenderSelect }) => {
  const { setGender } = useUserContext();
  const [selectedGender, setSelectedGender] = useState(null);

  const genderOptions = [
    { value: 'female', label: 'Female', icon: '👩', description: 'Women\'s archives' },
    { value: 'male', label: 'Male', icon: '👨', description: 'Men\'s archives' },
    { value: 'non-binary', label: 'Non-Binary', icon: '🌈', description: 'Neutral archives' },
    { value: 'prefer-not-to-say', label: 'Skip', icon: '✨', description: 'Mixed archives' }
  ];

  const handleGenderSelect = (gender) => {
    console.log('GenderSelectionModal: Gender selected:', gender);
    setSelectedGender(gender);
    setGender(gender);
    localStorage.setItem('user_gender_preference', gender);
    if (onGenderSelect) {
      onGenderSelect(gender);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 transition-all duration-700">
      <div className="bg-white rounded-[3.5rem] border border-brand-gray shadow-2xl max-w-lg w-full mx-auto relative overflow-hidden group">
        {/* Premium brand bloom */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/10 blur-[80px] rounded-full transition-all duration-1000 group-hover:scale-150"></div>
        
        {/* Header */}
        <div className="p-12 pb-6 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">
                Your <span className="text-brand-pink italic">Identity</span>
              </h2>
              <p className="text-brand-sage text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                Tailoring your style narrative
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-4 bg-brand-cream rounded-2xl text-brand-sage hover:text-brand-pink hover:bg-white border border-brand-gray transition-all duration-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Gender Options */}
        <div className="p-12 pt-6 space-y-5 relative z-10">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleGenderSelect(option.value)}
              className="w-full p-8 rounded-3xl border border-brand-gray bg-white hover:bg-brand-cream/30 hover:border-brand-pink/30 transition-all duration-500 text-left group/opt shadow-sm hover:shadow-xl"
            >
              <div className="flex items-center gap-8">
                <div className="text-4xl group-hover/opt:scale-110 transition-transform duration-500">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-brand-dark font-serif font-bold text-xl mb-2 group-hover/opt:text-brand-pink transition-colors">
                    {option.label}
                  </h3>
                  <p className="text-brand-sage text-[11px] font-bold uppercase tracking-widest opacity-60">
                    {option.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-sage/30 group-hover/opt:text-brand-pink group-hover/opt:translate-x-2 transition-all duration-500" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-12 pt-0 relative z-10">
          <p className="text-brand-sage text-[9px] font-black text-center uppercase tracking-[0.5em] opacity-40">
            Securely archived in your settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderSelectionModal;