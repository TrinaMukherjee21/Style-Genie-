import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Target, Zap, Shield, Users, TrendingUp, Heart, Star } from 'lucide-react';

const AboutSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Style Analysis",
      description: "Our advanced AI analyzes your preferences through rapid-fire visual choices to understand your unique aesthetic DNA.",
      color: "text-brand-gold"
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Get curated fashion finds that match your style profile with scary accuracy - no more endless scrolling.",
      color: "text-brand-goldLight"
    },
    {
      icon: Zap,
      title: "Lightning Fast Results",
      description: "Take our 60-second quiz and instantly discover your style personality with detailed insights.",
      color: "text-brand-goldLight"
    },
    {
      icon: Heart,
      title: "Save Your Favorites",
      description: "Build your dream wardrobe by saving items you love. Track trends and create your perfect style mood board.",
      color: "text-brand-gold"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users", icon: Users, color: "text-brand-gold" },
    { number: "94%", label: "Accuracy Rate", icon: Target, color: "text-brand-goldLight" },
    { number: "2.3M", label: "Items Analyzed", icon: TrendingUp, color: "text-brand-gold" },
    { number: "100%", label: "Privacy Protected", icon: Shield, color: "text-brand-gold" }
  ];

  return (
    <div className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold mb-6">
            <span className="text-white">About</span>
            <span className="text-brand-goldLight ml-4 ">StyleGenie</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body leading-relaxed">
            StyleGenie is your personal AI fashion assistant that understands your unique style better than you do. 
            We use cutting-edge technology to decode your aesthetic preferences and deliver personalized recommendations 
            that feel like they were handpicked just for you.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="feature-highlight rounded-3xl p-12 mb-16 text-center">
          <Sparkles className="w-16 h-16 text-brand-gold mx-auto mb-6 " />
          <h3 className="text-3xl font-heading font-bold text-white mb-4">Our Mission</h3>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            To revolutionize how people discover fashion by making style personal, accessible, and fun. 
            We believe everyone deserves to feel confident in their choices, and our AI helps you find 
            pieces that truly reflect who you are - not what magazines say you should wear.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="card-premium p-8 transition-all duration-300 animate-card-hover"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${feature.color} p-3 rounded-xl bg-brand-dark `}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-bold text-white mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-300 font-body leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="feature-highlight rounded-3xl p-12 shadow-lg mb-16">
          <h3 className="text-3xl font-heading font-bold text-center text-white mb-8">
            Trusted by Style Enthusiasts Everywhere
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className={`w-10 h-10 ${stat.color} mx-auto mb-3 `} />
                  <div className={`text-3xl font-heading font-bold ${stat.color} mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-body font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-heading font-bold text-white mb-8">
            How StyleGenie Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-8 animate-card-hover">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl ">
                1
              </div>
              <h4 className="text-xl font-heading font-bold text-white mb-3">Sign Up & Take Quiz</h4>
              <p className="text-gray-300 font-body">
                Create your account and take our fun 60-second style quiz to build your unique aesthetic profile.
              </p>
            </div>
            
            <div className="card-premium p-8 animate-card-hover">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl ">
                2
              </div>
              <h4 className="text-xl font-heading font-bold text-white mb-3">Get Personalized Recommendations</h4>
              <p className="text-gray-300 font-body">
                Our AI analyzes your preferences and curates fashion items that match your unique style DNA.
              </p>
            </div>
            
            <div className="card-premium p-8 animate-card-hover">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl ">
                3
              </div>
              <h4 className="text-xl font-heading font-bold text-white mb-3">Save & Shop with Confidence</h4>
              <p className="text-gray-300 font-body">
                Save your favorites, build your dream wardrobe, and shop knowing every piece fits your style.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center feature-highlight rounded-3xl p-12">
          <Star className="w-16 h-16 text-brand-gold mx-auto mb-6 " />
          <h3 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Discover Your Style?
          </h3>
          <p className="text-lg text-gray-300 mb-8 font-body">
            Join thousands of users who've already found their perfect style with StyleGenie
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Start Your Style Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;