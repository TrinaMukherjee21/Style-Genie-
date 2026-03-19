import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LogIn, UserPlus, Zap, Target, Sparkles, Star, Heart } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import StyleGenieLogo from '../common/Logo';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const floatingElements = [
    { icon: Sparkles, delay: '0s', position: 'top-20 left-20' },
    { icon: Zap, delay: '1s', position: 'top-32 right-32' },
    { icon: Target, delay: '2s', position: 'bottom-40 left-40' },
    { icon: Brain, delay: '1.5s', position: 'bottom-32 right-20' },
    { icon: Star, delay: '0.5s', position: 'top-1/2 left-10' },
    { icon: Heart, delay: '2.5s', position: 'top-1/3 right-10' }
  ];

  return (
    <div className="relative min-h-screen bg-brand-navy overflow-hidden pt-16">
      {/* Subtle Background Effects - Dark Navy and Gold theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-[#120D20] opacity-80"></div>
      
      {/* Static Background Icons - Golden and Distraction-free */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon;
        return (
          <div
            key={index}
            className={`absolute ${element.position} text-brand-gold opacity-50`}
            style={{ 
              filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))'
            }}
          >
            <Icon className="w-12 h-12" strokeWidth={1.5} />
          </div>
        );
      })}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
        
        {/* Huge Logo Placement on Homepage */}
        <div className="mb-12 scale-125 transform">
          <StyleGenieLogo size="xl" showText={false} animated={false} />
        </div>

        <div className="text-center w-full">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-hero font-heading mb-6 tracking-tight">
              <span className="text-white font-medium drop-shadow-sm">
                Stop Searching.
              </span>
              <br />
              <span className="text-white/90 font-heading font-light">Start Being</span>
              <span className="text-brand-gold ml-4 italic drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Found.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-subtitle mb-12 max-w-4xl mx-auto leading-relaxed font-body text-gray-200 brightness-110">
            StyleGenie is your AI fashion assistant that hunts down items you'll love before you even know you want them. 
            Because the best finds happen when you're not even looking.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            {user ? (
              // Authenticated user buttons
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>View My Dashboard</span>
                </button>
                
                <button 
                  onClick={() => navigate('/quiz')}
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 opacity-90 hover:opacity-100"
                >
                  <Brain className="w-6 h-6" />
                  <span>Retake Quiz</span>
                </button>
              </>
            ) : (
              // Non-authenticated user buttons
              <>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
                >
                  <UserPlus className="w-6 h-6" />
                  <span>Get Started - Sign Up Free</span>
                </button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-body">Already have an account?</span>
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Feature Highlight */}
          <div className="feature-highlight rounded-3xl p-10 max-w-3xl mx-auto mb-16 border border-[#d4af37]/20 bg-[#1A162D]">
            <div className="flex items-center justify-center space-x-3 mb-4 text-brand-gold">
              <Zap className="w-6 h-6" />
              <span className="font-semibold text-lg tracking-wide uppercase">Takes 60 seconds • Scarily Accurate</span>
            </div>
            <p className="text-gray-300 text-lg font-body leading-relaxed">
              Our AI analyzes your subconscious style preferences through rapid-fire choices, 
              creating a unique aesthetic DNA that gets sharper with every interaction.
            </p>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-premium p-8 text-center transition-transform hover:-translate-y-2 border border-[#35295D] bg-[#221A3B]">
              <div className="text-4xl font-bold text-brand-gold mb-2 font-heading">10K+</div>
              <div className="text-gray-400 font-body text-sm tracking-wide uppercase">Style Profiles Created</div>
            </div>
            <div className="card-premium p-8 text-center transition-transform hover:-translate-y-2 border border-[#35295D] bg-[#221A3B]">
              <div className="text-4xl font-bold text-brand-goldLight mb-2 font-heading">94%</div>
              <div className="text-gray-400 font-body text-sm tracking-wide uppercase">Accuracy Rate</div>
            </div>
            <div className="card-premium p-8 text-center transition-transform hover:-translate-y-2 border border-[#35295D] bg-[#221A3B]">
              <div className="text-4xl font-bold text-brand-gold mb-2 font-heading">2.3M</div>
              <div className="text-gray-400 font-body text-sm tracking-wide uppercase">Items Discovered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;