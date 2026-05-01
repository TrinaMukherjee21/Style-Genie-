import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Wand2, Search, Heart, ShoppingBag, Star } from 'lucide-react';
import GenderSelectionModal from '../common/GenderSelectionModal';
import { useUserContext } from '../../context/UserContext';

const STEPS = [
  {
    num: '01',
    icon: Wand2,
    title: 'Chat with StyleGenie',
    desc: 'Tell our AI fashion counselor exactly what you\'re looking for and get instant recommendations.'
  },
  {
    num: '02',
    icon: Search,
    title: 'Discover Products',
    desc: 'Browse live results from Myntra, Ajio, Nykaa & 50+ Indian stores — filtered for your taste.'
  },
  {
    num: '03',
    icon: Heart,
    title: 'Save & Shop',
    desc: 'Wishlist your favourites and buy directly from the original store — no intermediary.'
  },
];

const REVIEWS = [
  { text: "Finally an app that actually gets my style. Found my perfect co-ord set in 2 minutes!", author: 'Priya R.', city: 'Mumbai', stars: 5 },
  { text: "The AI recommendations are scary accurate. Myntra results that match my vibe exactly.", author: 'Aisha K.', city: 'Bangalore', stars: 5 },
  { text: "Love that it searches across so many stores. Never going back to manual hunting.", author: 'Nandita S.', city: 'Delhi', stars: 5 },
];

const CallToAction = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [showGenderModal, setShowGenderModal] = useState(false);

  return (
    <>
      {/* ── How It Works ── */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Crafting Your Look</p>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/30"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight leading-tight">
              The <span className="text-brand-pink italic">StyleGenie</span> Experience
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group">
                  {/* Connector line (hidden on mobile) */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[calc(50%+5rem)] right-[-5rem] h-[1px] bg-brand-gray/50 z-0" />
                  )}

                  <div className="relative z-10 p-12 bg-brand-cream/10 border border-brand-gray rounded-[3rem] hover:border-brand-pink/30 hover:bg-white hover:shadow-[0_30px_70px_rgba(137,162,147,0.1)] transition-all duration-700 hover:-translate-y-3 text-center">
                    <div className="relative inline-flex items-center justify-center mb-8">
                      <div className="w-24 h-24 bg-white border border-brand-gray rounded-[2.5rem] flex items-center justify-center shadow-sm group-hover:border-brand-pink/40 transition-all duration-700 group-hover:rotate-6 group-hover:shadow-xl">
                        <Icon className="w-10 h-10 text-brand-pink" />
                      </div>
                      <span className="absolute -top-4 -right-4 w-10 h-10 bg-brand-dark text-white text-xs font-black rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{step.title}</h3>
                    <p className="text-brand-sage text-sm leading-relaxed font-medium opacity-80">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mini Reviews ── */}
      <section className="py-24 md:py-32 bg-brand-cream/20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 blur-[100px] rounded-full translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.3em]">Voices of Style</p>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-sage/30"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight">
              The <span className="text-brand-pink italic">Inner Circle</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white border border-brand-gray rounded-[2.5rem] p-10 hover:-translate-y-3 hover:border-brand-pink/30 hover:shadow-[0_25px_60px_rgba(137,162,147,0.08)] transition-all duration-700 group">
                <div className="flex gap-2 mb-8">
                  {[...Array(r.stars)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-brand-pink fill-brand-pink group-hover:scale-125 transition-transform" style={{ transitionDelay: `${j * 100}ms` }} />
                  ))}
                </div>
                <p className="text-brand-dark/80 italic text-lg leading-relaxed mb-10 font-medium">"{r.text}"</p>
                <div className="flex items-center justify-between pt-8 border-t border-brand-gray/50">
                  <span className="font-bold text-brand-dark text-base tracking-tight">{r.author}</span>
                  <span className="text-[10px] font-bold text-brand-sage bg-brand-sage/5 px-5 py-2 rounded-full border border-brand-sage/10 uppercase tracking-widest">
                    {r.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="relative overflow-hidden bg-brand-dark rounded-[4rem] p-16 md:p-24 text-center shadow-[0_50px_100px_rgba(30,26,27,0.4)]">
            {/* Elegant Background Accents */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-pink/20 blur-[150px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-sage/20 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
                <span className="text-[10px] font-bold text-brand-cream uppercase tracking-[0.3em]">Your Style, AI-Powered</span>
              </div>

              <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-10 leading-[1.1] tracking-tight">
                Ready to Find Items You'll
                <span className="text-brand-pink italic block sm:inline ml-0 sm:ml-6"> Actually Love?</span>
              </h2>

              <p className="text-brand-cream/60 text-lg md:text-xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                Join thousands of fashion lovers discovering their perfect style across 50+ Indian stores — in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => {
                    if (user) navigate('/products');
                    else navigate('/register');
                  }}
                  className="group w-full sm:w-auto bg-brand-pink text-white px-14 py-6 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand-dark hover:shadow-[0_25px_60px_rgba(255,255,255,0.2)] transition-all duration-500 flex items-center justify-center gap-4 hover:-translate-y-2"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {user ? 'Browse Products' : 'Get Started — Free'}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full sm:w-auto bg-white/5 text-white border border-white/10 px-14 py-6 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-md hover:-translate-y-1"
                  >
                    Login to Account
                  </button>
                )}
              </div>

              <div className="mt-16 flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Free forever</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-sage rounded-full"></div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GenderSelectionModal
        isOpen={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        onGenderSelect={(gender) => {
          setShowGenderModal(false);
          localStorage.setItem('pending_gender_selection', gender);
          navigate('/login');
        }}
      />
    </>
  );
};

export default CallToAction;