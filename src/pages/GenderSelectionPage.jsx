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
    <div className="min-h-screen pt-16 bg-brand-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-pink-900/20 to-[#c0a0e6]/5/30"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 text-brand-gold opacity-40 ">🌟</div>
      <div className="absolute top-32 right-20 w-6 h-6 text-brand-goldLight opacity-40 " style={{animationDelay: '1s'}}>✨</div>
      <div className="absolute bottom-40 left-20 w-10 h-10 text-brand-gold opacity-40 " style={{animationDelay: '2s'}}>💫</div>
      <div className="absolute top-1/2 right-10 w-12 h-12 text-brand-gold opacity-30 " style={{animationDelay: '3s'}}>🎨</div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-8 w-full z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 bg-clip-text text-transparent ">
              Welcome to StyleGenie
            </h1>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto font-body font-medium">
              Let's personalize your fashion journey! Choose your style preference to get the most relevant recommendations.
            </p>
          </div>
        </div>

        {/* Gender Selector */}
        <div className="mb-8">
          <GenderSelector 
            onGenderSelect={handleGenderSelect}
            selectedGender={selectedGender}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedGender}
            className={`
              px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
              ${selectedGender
                ? 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue to Style Quiz →
          </button>
          
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-300 underline underline-offset-4"
          >
            Skip for now
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12">
          <div className="card-premium backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/30 shadow-lg">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body mb-2">Personalized Recommendations</h4>
                  <p className="text-gray-300 text-sm">Get fashion suggestions tailored to your style preferences</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-500/30">
                  <span className="text-2xl">🧬</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body mb-2">AI Style Analysis</h4>
                  <p className="text-gray-300 text-sm">Our AI analyzes your preferences to understand your unique style DNA</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body mb-2">Smart Shopping</h4>
                  <p className="text-gray-300 text-sm">Discover pieces that match your aesthetic and lifestyle</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            🔒 Your preferences are private and secure. You can change them anytime in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderSelectionPage;