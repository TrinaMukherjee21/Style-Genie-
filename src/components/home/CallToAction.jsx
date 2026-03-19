import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Zap, Heart } from 'lucide-react';
import GenderSelectionModal from '../common/GenderSelectionModal';
import { useUserContext } from '../../context/UserContext';

const CallToAction = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [showGenderModal, setShowGenderModal] = useState(false);

  const testimonials = [
    {
      text: "I'm 73% minimalist tech-lover, 27% vintage maximalist. This app gets me.",
      author: "Alex K.",
      aesthetic: "Tech Minimalist",
      color: "text-brand-gold"
    },
    {
      text: "The AI roasted my old style and I've never looked better. 10/10 would be judged again.",
      author: "Sam M.",
      aesthetic: "Cyberpunk Rebel",
      color: "text-brand-goldLight"
    },
    {
      text: "Found my new favorite jacket in the 'guilty pleasure' section. Trust the algorithm.",
      author: "Casey L.",
      aesthetic: "Vintage Maximalist",
      color: "text-brand-gold"
    }
  ];

  return (
    <section className="py-24 bg-dark-secondary relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 via-pink-900/15 to-[#c0a0e6]/5/20"></div>
      <div className="absolute inset-0  opacity-30"></div>
      <div className="absolute inset-0  opacity-5"></div>
      
      {/* Floating Elements */}
      <Heart className="absolute top-20 left-16 w-6 h-6 text-brand-goldLight opacity-50 " />
      <Star className="absolute top-40 right-24 w-8 h-8 text-brand-gold opacity-40 " style={{animationDelay: '1s'}} />
      <Zap className="absolute bottom-32 left-12 w-7 h-7 text-brand-gold opacity-50 " style={{animationDelay: '2s'}} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-heading font-bold text-white text-center mb-12">
            What People Are <span className="text-brand-gold ">Saying</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-premium backdrop-blur-lg p-8 border-2 border-purple-500/30 shadow-lg hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300 group animate-card-hover"
              >
                <div className="flex items-start mb-4">
                  <Star className={`w-5 h-5 ${testimonial.color} mr-2 `} />
                  <Star className={`w-5 h-5 ${testimonial.color} mr-2 `} style={{animationDelay: '0.2s'}} />
                  <Star className={`w-5 h-5 ${testimonial.color} mr-2 `} style={{animationDelay: '0.4s'}} />
                  <Star className={`w-5 h-5 ${testimonial.color} mr-2 `} style={{animationDelay: '0.6s'}} />
                  <Star className={`w-5 h-5 ${testimonial.color} `} style={{animationDelay: '0.8s'}} />
                </div>
                <p className="text-gray-300 mb-6 italic text-lg font-body leading-relaxed group-hover:text-gray-200 transition-colors">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold font-body">{testimonial.author}</span>
                  <span className={`text-xs  text-white px-3 py-2 rounded-full font-medium `}>
                    {testimonial.aesthetic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center feature-highlight rounded-3xl p-16 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="flex justify-center mb-8">
            <Sparkles className="w-20 h-20 text-brand-gold " />
          </div>
          
          <h2 className="text-5xl font-heading font-bold text-white mb-8">
            Ready to Stop Shopping and Start Being <span className="text-brand-goldLight ">Found?</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
            Join thousands of style explorers who've discovered their aesthetic DNA. 
            Your perfect finds are waiting.
          </p>
          
          <button
            onClick={() => {
              if (user) {
                navigate('/quiz');
              } else {
                setShowGenderModal(true);
              }
            }}
            className="group  text-white px-16 py-5 rounded-2xl font-bold text-xl hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center space-x-4 mx-auto border-2 border-transparent hover:border-white/20 "
          >
            <span>Discover Your Style DNA</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="mt-8 text-sm text-gray-400 font-body font-medium">
            Free forever • No spam • Pure style discovery
          </div>

          {/* Additional Visual Elements */}
          <div className="flex justify-center items-center space-x-8 mt-12 opacity-60">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-brand-goldLight" />
              <span className="text-gray-400 text-sm">10K+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">60-Second Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-brand-gold" />
              <span className="text-gray-400 text-sm">94% Accuracy</span>
            </div>
          </div>
        </div>
        
        {/* Gender Selection Modal */}
        <GenderSelectionModal 
          isOpen={showGenderModal}
          onClose={() => setShowGenderModal(false)}
          onGenderSelect={(gender) => {
            setShowGenderModal(false);
            localStorage.setItem('pending_gender_selection', gender);
            navigate('/login');
          }}
        />
      </div>
    </section>
  );
};

export default CallToAction;