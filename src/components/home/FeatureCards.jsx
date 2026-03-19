import React, { useState } from 'react';
import { Target, TrendingUp, Zap, Brain, MessageCircle, Star, Sparkles, Camera } from 'lucide-react';
import VisualTryOn from '../VisualTryOn';

const FeatureCards = () => {
  const [showVisualTryOn, setShowVisualTryOn] = useState(false);
  
  const features = [
    {
      icon: Target,
      title: "AI Secret Agent",
      description: "Your personal shopping spy that slides into your DMs with items you didn't know you needed.",
      gradient: "from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20",
      color: "text-brand-gold",
      delay: "0"
    },
    {
      icon: TrendingUp,
      title: "Clout Score",
      description: "See what your aesthetic twins are buying. Because peer pressure, but make it smart.",
      gradient: "from-[#c0a0e6]/20 to-[#c0a0e6]/5 border border-[#c0a0e6]/20",
      color: "text-brand-lavender",
      delay: "100"
    },
    {
      icon: Zap,
      title: "Anti-Buyer's Remorse",
      description: "Get a personalized meme justifying every purchase. Your wallet will thank us later.",
      gradient: "from-[#eacc6e]/20 to-[#eacc6e]/5 border border-[#eacc6e]/20",
      color: "text-brand-goldLight",
      delay: "200"
    },
    {
      icon: Brain,
      title: "Taste Sniffer Quiz",
      description: "60-second rapid-fire reactions that decode your subconscious style DNA.",
      gradient: "from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20",
      color: "text-brand-gold",
      delay: "0"
    },
    {
      icon: MessageCircle,
      title: "Snarky AI Commentary",
      description: "Get roasted by an AI that actually understands your style. It's therapy, but for shopping.",
      gradient: "from-[#c0a0e6]/20 to-[#c0a0e6]/5 border border-[#c0a0e6]/20",
      color: "text-brand-lavender",
      delay: "100"
    },
    {
      icon: Star,
      title: "Guilty Pleasure Mode",
      description: "Sometimes the AI suggests wildcards. Trust the process. Trust the chaos.",
      gradient: "from-[#eacc6e]/20 to-[#eacc6e]/5 border border-[#eacc6e]/20",
      color: "text-brand-goldLight",
      delay: "200"
    }
  ];

  return (
    <section className="py-20 bg-brand-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A162D] to-transparent"></div>
      
      {/* Bright Floating Background Elements */}
      <Sparkles className="absolute top-20 left-10 w-8 h-8 text-brand-gold opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      <Star className="absolute top-32 right-20 w-6 h-6 text-brand-gold opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      <Zap className="absolute bottom-40 left-20 w-10 h-10 text-brand-gold opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Why StyleGenie is <span className="text-brand-gold italic">Different</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-body leading-relaxed">
            We don't just find products. We understand your vibes, read your aesthetic energy, 
            and deliver finds that feel like they were made for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group card-premium p-8 transition-all duration-300 border border-[#35295D] hover:border-[#d4af37]/50 bg-[#221A3B]"
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className={`text-xl font-heading font-bold text-gray-100 mb-4 transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-body transition-colors group-hover:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="feature-highlight rounded-3xl p-10 max-w-2xl mx-auto border border-[#d4af37]/20 bg-[#1A162D]">
            <h3 className="text-2xl font-heading font-bold text-white mb-4">
              Ready to Experience the <span className="text-brand-gold italic">Magic?</span>
            </h3>
            <p className="text-gray-400 mb-8 font-body">
              Join thousands who've discovered their aesthetic DNA and found their perfect style matches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-3 text-base font-semibold">
                Take Style Quiz
              </button>
              <button 
                onClick={() => setShowVisualTryOn(true)}
                className="btn-primary px-8 py-3 text-base font-semibold flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Visual Try-On
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Try-On Modal */}
      <VisualTryOn 
        isOpen={showVisualTryOn} 
        onClose={() => setShowVisualTryOn(false)} 
      />
    </section>
  );
};

export default FeatureCards;