import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import GenderSelector from '../components/common/GenderSelector';

const GenderSelectionPage = () => {
  const navigate = useNavigate();
  const { user, preferences, setGender } = useUserContext();
  const [selectedGender, setSelectedGender] = useState(preferences?.gender || null);

  useEffect(() => {
    // Load saved gender preference
    const savedGender = localStorage.getItem('user_gender_preference');
    if (savedGender && !selectedGender) {
      setSelectedGender(savedGender);
      setGender(savedGender);
    }
  }, [setGender, selectedGender]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setGender(gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      if (user) {
        // User is authenticated, go to quiz
        navigate('/quiz');
      } else {
        // User not authenticated, go to login with gender stored
        localStorage.setItem('pending_gender_selection', selectedGender);
        navigate('/login');
      }
    }
  };

  const handleSkip = () => {
    const defaultGender = 'prefer-not-to-say';
    setGender(defaultGender);
    if (user) {
      navigate('/quiz');
    } else {
      localStorage.setItem('pending_gender_selection', defaultGender);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-white relative overflow-hidden">
      {/* Background Effects - Using new palette */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[130px] rounded-full -z-10"></div>
      
      {/* Floating Background Elements - Muted and elegant */}
      <div className="absolute top-40 left-20 w-8 h-8 text-brand-pink opacity-20 animate-pulse-subtle">✨</div>
      <div className="absolute bottom-60 right-32 w-6 h-6 text-brand-sage opacity-20 animate-pulse-subtle" style={{animationDelay: '1.5s'}}>✨</div>
      
      <div className="relative max-w-5xl mx-auto px-6 py-16 w-full z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl">
          <div className="mb-10 flex justify-center">
            <div className="w-24 h-24 bg-brand-cream border border-brand-gray rounded-[2rem] flex items-center justify-center shadow-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-brand-pink/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
              <span className="text-4xl relative z-10">🎨</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-dark mb-8 tracking-tighter">
            Curate Your <span className="text-brand-pink italic">Vibe</span>
          </h1>
          <p className="text-brand-sage text-xl font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-wider opacity-80">
            Let's personalize your fashion narrative. Choose your preference to discover your unique style DNA.
          </p>
        </div>

        {/* Gender Selector */}
        <div className="w-full mb-16">
          <GenderSelector 
            onGenderSelect={handleGenderSelect}
            selectedGender={selectedGender}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12 w-full max-w-md sm:max-w-none">
          <button
            onClick={handleContinue}
            disabled={!selectedGender}
            className={`
              px-16 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-700 w-full sm:w-auto shadow-2xl
              ${selectedGender
                ? 'bg-brand-dark text-white hover:bg-brand-pink hover:-translate-y-2'
                : 'bg-brand-gray text-brand-sage opacity-40 cursor-not-allowed'
              }
            `}
          >
            {selectedGender ? 'Continue to Discovery →' : 'Select a Style Preference'}
          </button>
          
          <button
            onClick={handleSkip}
            className="px-10 py-4 text-brand-sage hover:text-brand-pink font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 underline underline-offset-8"
          >
            Skip for now
          </button>
        </div>

        {/* Info Section - Premium Cards */}
        <div className="mt-32 w-full">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: '🎯', title: 'Personalized', desc: 'Curated suggestions just for your archive', color: 'brand-pink' },
              { icon: '🧬', title: 'Style DNA', desc: 'Our Muse understands your unique aesthetic', color: 'brand-sage' },
              { icon: '🛍️', title: 'Seamless', desc: 'Acquire from 50+ premium ateliers', color: 'brand-pink' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-brand-gray shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cream opacity-50 blur-2xl rounded-full"></div>
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h4 className="text-brand-dark font-serif font-bold text-xl mb-4 relative z-10">{item.title}</h4>
                <p className="text-brand-sage text-[12px] leading-relaxed font-bold uppercase tracking-widest opacity-60 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-20 text-center">
          <p className="text-brand-sage text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
            🔒 Your preferences are securely archived
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderSelectionPage;