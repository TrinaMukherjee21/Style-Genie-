import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LogIn, UserPlus, Sparkles, ArrowRight, Wand2 } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import StyleGenieLogo from '../common/Logo';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <div className="relative bg-transparent overflow-hidden pt-24 flex flex-col items-center justify-center">
      {/* Background blooms - Using palette colors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-pink/5 blur-[150px] rounded-full -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-sage/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-4 md:pb-6 flex flex-col items-center text-center w-full">



        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif tracking-tight leading-[1.1] md:leading-[1] mb-8 md:mb-12">
          <span className="text-brand-dark">Stop Searching.</span>
          <br />
          <span className="text-brand-dark">Start Being</span>
          <span className="text-brand-pink italic ml-2 md:ml-4">Found.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-brand-sage font-medium max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12 opacity-80">
          StyleGenie is your AI fashion concierge that hunts down items you'll love —
          from <span className="text-brand-dark font-bold">Myntra, Ajio, Nykaa</span> & 50+ stores — before you even know you want them.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 md:gap-8 justify-center items-center mb-10 md:mb-16 w-full max-w-md sm:max-w-none">
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto bg-brand-dark text-white px-12 py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-500 flex items-center justify-center gap-4 hover:bg-brand-black hover:shadow-[0_20px_50px_rgba(30,26,27,0.3)] hover:-translate-y-1"
              >
                <Sparkles className="w-6 h-6 text-brand-pink" />
                View My Dashboard
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto bg-brand-cream text-brand-dark px-12 py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-500 flex items-center justify-center gap-4 hover:bg-brand-pink hover:text-white border border-brand-pink/20 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                Shop Now
                <ArrowRight className="w-6 h-6 text-brand-sage group-hover:text-white transition-colors" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-brand-dark text-white px-12 py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-500 flex items-center justify-center gap-4 hover:bg-brand-black hover:shadow-[0_20px_50px_rgba(30,26,27,0.3)] hover:-translate-y-1"
              >
                <UserPlus className="w-6 h-6 text-brand-pink" />
                Get Started — Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-brand-cream text-brand-dark px-12 py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-500 flex items-center justify-center gap-4 border border-brand-pink/20 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:bg-brand-pink hover:text-white group"
              >
                <LogIn className="w-6 h-6 text-brand-sage group-hover:text-white transition-colors" />
                Login
              </button>
            </>
          )}
        </div>

        {/* Store trust bar */}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-8 pt-10 pb-4 border-t border-brand-gray/50 w-full max-w-4xl">
          <span className="text-[10px] text-brand-sage/60 font-bold uppercase tracking-[0.2em] mb-2 md:mb-0 w-full md:w-auto">Curating across global boutiques</span>
          <div className="flex flex-wrap justify-center gap-4">
            {['Myntra', 'Ajio', 'Nykaa', 'Tata Cliq', 'Amazon', '+45 stores'].map((store) => (
              <span
                key={store}
                className="text-[10px] font-bold text-brand-dark bg-brand-cream/50 border border-brand-gray/50 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm"
              >
                {store}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;