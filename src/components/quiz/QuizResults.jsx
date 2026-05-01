import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, Share2, ShoppingBag, Heart, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useUserContext } from '../../context/UserContext';
import { useQuiz } from '../../hooks/useQuiz';
import LoadingSpinner from '../common/LoadingSpinner';
import { getProductImage } from '../../utils/imageUtils';
import API_BASE_URL from '../../config';
import catalogData from '../../chatbot/curated_products.json';

const QuizResults = () => {
  const navigate = useNavigate();
  const { addToCart, addToFavorites } = useAppContext();
  const { userProfile } = useUserContext();
  const { startQuiz } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const fetchRecommendations = async () => {
    if (!userProfile) return;
    
    setLoadingRecommendations(true);
    try {
      const userGender = userProfile.gender || localStorage.getItem('user_gender_preference') || 'unisex';
      
      const response = await fetch(`${API_BASE_URL}/api/recommendations/live-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...userProfile,
            gender: userGender,
            searchKeywords: userProfile.searchKeywords
          }
        })
      });

      if (!response.ok) throw new Error('Live search failed');
      
      const data = await response.json();
      
      if (data.success && data.products.length > 0) {
        const results = data.products.map((product, index) => {
          let displayPrice = product.price || '₹1,599';
          if (typeof displayPrice === 'number') displayPrice = `₹${displayPrice}`;
          
          return {
            id: product.id || `live_${index}`,
            title: product.name,
            price: displayPrice,
            image: product.image_url || getProductImage(product.name, 'tops'),
            description: product.description,
            aesthetic: userProfile.primaryAesthetic || 'modern',
            category: product.category || 'Discovery',
            score: product.matchScore || (0.95 + (Math.random() * 0.04)),
            buy_link: product.buy_link || '#'
          };
        });
        
        setRecommendations(results);
      } else {
        throw new Error('No live products found');
      }
      
    } catch (error) {
      console.error('Real-time Discovery Failed, falling back to local vault:', error);
      const fallbackResults = catalogData.slice(0, 6).map((product, index) => ({
        id: product.id || `fallback_${index}`,
        title: product.name,
        price: `$${product.price}.00`,
        image: getProductImage(product.name, product.category),
        description: product.description,
        aesthetic: product.style[0] || 'minimalist',
        category: product.category,
        score: 0.94 - (index * 0.02),
        buy_link: '#'
      }));
      setRecommendations(fallbackResults);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    setRecommendations([]);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        fetchRecommendations();
      }, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [userProfile?.personalityType]);

  if (isLoading) {
    retur    <div className="min-h-screen pt-24 flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="text-center relative z-10 p-12 bg-white/40 backdrop-blur-xl border border-brand-gray rounded-[4rem] shadow-2xl max-w-2xl mx-auto animate-scale-in">
        <LoadingSpinner size="xl" color="pink" />
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.4em] animate-pulse">Neural Mapping</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark tracking-tight leading-tight">Analyzing your <span className="text-brand-pink italic">DNA</span>...</h2>
          </div>
          <p className="text-brand-sage font-black uppercase tracking-[0.3em] text-[10px] opacity-60">This is getting interesting 🧬</p>
        </div>
      </div>
    </div>
  );
}

if (!userProfile) {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="text-center bg-white/50 backdrop-blur-xl p-16 md:p-24 rounded-[4rem] shadow-2xl border border-brand-gray max-w-2xl w-full mx-6 animate-scale-in">
        <div className="w-24 h-24 bg-brand-cream border border-brand-pink/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
          <RotateCcw className="w-10 h-10 text-brand-pink/30" />
        </div>
        <p className="text-4xl font-serif font-bold text-brand-dark mb-6 leading-tight">Dossier not found!</p>
        <p className="text-brand-sage font-bold mb-16 opacity-60 uppercase tracking-[0.3em] text-[10px] leading-relaxed">It looks like your aesthetic DNA is yet to be mapped.</p>
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => startQuiz()}
            className="w-full bg-brand-dark text-white px-10 py-6 rounded-2xl font-bold transition-all shadow-2xl hover:bg-brand-black hover:-translate-y-1 uppercase tracking-[0.2em] text-xs"
          >
            Commence Quiz
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-brand-cream text-brand-dark border border-brand-pink/20 px-10 py-6 rounded-2xl transition-all font-bold hover:bg-brand-pink hover:text-white uppercase tracking-[0.2em] text-xs shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const topAesthetics = userProfile.aesthetics 
  ? Object.entries(userProfile.aesthetics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  : userProfile.primaryAesthetic 
      ? [[userProfile.primaryAesthetic, 85], ['vintage', 65], ['minimalist', 45]]
      : [['minimalist', 75], ['streetwear', 55], ['boho', 35]];

return (
  <div className="min-h-screen pt-24 bg-white relative overflow-hidden pb-24 px-6 md:px-12">
    {/* Background blooms */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
    
    <div className="relative max-w-6xl mx-auto py-12 z-10">
      {/* Header */}
      <div className="text-center mb-24 animate-fade-in">
        <div className="w-24 h-24 bg-brand-cream border border-brand-pink/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner relative group">
          <div className="absolute inset-0 bg-brand-pink/10 rounded-[2.5rem] animate-ping opacity-20"></div>
          <Sparkles className="w-12 h-12 text-brand-pink group-hover:scale-125 transition-transform duration-700" />
        </div>
        
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-8 tracking-tight leading-tight">
          Your Style <span className="text-brand-pink italic">DNA</span> is Mapped! 🧬
        </h2>
        
        <p className="text-xl text-brand-sage font-medium mb-8 max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.2em] opacity-60">
          We've decoded your subconscious preferences into a unique aesthetic profile.
        </p>
      </div>

      {/* Results Card */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[4rem] p-12 md:p-20 border border-brand-gray shadow-2xl mb-20 relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-pink/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-sage/5 blur-3xl rounded-full"></div>
        
        {/* Personality Type */}
        <div className="text-center mb-20 relative z-10">
          <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.4em] mb-6">Signature Archetype</p>
          <div className="text-6xl md:text-8xl font-serif font-bold mb-10 text-brand-dark tracking-tighter leading-tight">
            {userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}
          </div>
          <div className="w-24 h-1.5 bg-brand-pink mx-auto rounded-full mb-12 opacity-30"></div>
          <p className="text-brand-dark/70 max-w-4xl mx-auto font-medium text-xl leading-relaxed italic">
            "{userProfile.tasteProfile || userProfile.description || "Your unique style reflects your personal aesthetic preferences. You have a distinctive taste that sets you apart from the crowd."}"
          </p>
        </div>

        {/* Aesthetic Breakdown */}
        <div className="grid md:grid-cols-3 gap-12 mb-20 border-y border-brand-gray py-16 relative z-10">
          {topAesthetics.map(([aesthetic, percentage], index) => (
            <div key={aesthetic} className="text-center group/item">
              <div className="text-5xl font-bold text-brand-dark mb-4 group-hover/item:scale-110 transition-transform duration-700 tracking-tighter">
                {percentage}%
              </div>
              <div className="text-brand-pink font-black uppercase tracking-[0.3em] text-[10px] mb-8">
                {aesthetic}
              </div>
              <div className="w-full bg-brand-cream/50 rounded-full h-4 overflow-hidden border border-brand-gray shadow-inner p-1">
                <div 
                  className="bg-brand-dark h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${percentage}%`, animationDelay: `${index * 300}ms` }}
                >
                  <div className="absolute inset-0 bg-brand-pink/10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 mb-20 relative z-10">
          <div className="text-center bg-brand-cream/30 rounded-[3rem] p-10 border border-brand-pink/10 hover:shadow-xl transition-all duration-500 group/stat">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-brand-pink mr-3 group-hover/stat:scale-125 transition-transform" />
              <span className="text-5xl font-bold text-brand-dark tracking-tighter">
                {userProfile.cloutScore}
              </span>
            </div>
            <div className="text-brand-sage font-black text-[10px] tracking-[0.3em] uppercase opacity-60">Clout Score</div>
          </div>

          <div className="text-center bg-brand-cream/30 rounded-[3rem] p-10 border border-brand-pink/10 hover:shadow-xl transition-all duration-500 group/stat">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-brand-pink mr-3 group-hover/stat:scale-125 transition-transform" />
              <span className="text-5xl font-bold text-brand-dark tracking-tighter">
                {userProfile.styleStreak}
              </span>
            </div>
            <div className="text-brand-sage font-black text-[10px] tracking-[0.3em] uppercase opacity-60">Style Streak</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('access_token');
                if (token) {
                  const response = await fetch(`${API_BASE_URL}/api/inbox/generate-recommendations`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                  });
                  if (response.ok) console.log('Inbox messages generated successfully');
                }
              } catch (error) { console.error('Error generating inbox messages:', error); }
              navigate('/dashboard');
            }}
            className="w-full sm:w-auto bg-brand-dark text-white px-12 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-black hover:-translate-y-2 transition-all duration-500 shadow-2xl flex items-center justify-center gap-4"
          >
            <span>Discovery Portal</span>
            <Sparkles className="w-5 h-5 text-brand-pink" />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My StyleGenie DNA',
                  text: `I'm a ${userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}! What's your style DNA?`,
                  url: window.location.origin
                });
              } else {
                navigator.clipboard.writeText(`I'm a ${userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}! Find out your style DNA at ${window.location.origin}`);
                alert('Share text copied to clipboard!');
              }
            }}
            className="w-full sm:w-auto bg-brand-cream text-brand-dark px-10 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-pink hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-xl flex items-center justify-center gap-4 border border-brand-pink/10"
          >
            <Share2 className="w-5 h-5" />
            <span>Broadcast</span>
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to retake the quiz? Your current results will be replaced.')) {
                startQuiz();
              }
            }}
            className="w-full sm:w-auto bg-white text-brand-sage border border-brand-gray hover:border-brand-pink/30 hover:bg-brand-cream/30 px-10 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-[4rem] p-12 md:p-20 border border-brand-gray shadow-2xl mb-20 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent"></div>
        <div className="text-center mb-16">
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.4em]">Curated For You</p>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight leading-tight">The <span className="text-brand-pink italic">Discovery</span> Edit</h3>
          </div>
          <p className="text-brand-sage font-medium text-lg max-w-3xl mx-auto uppercase tracking-[0.2em] opacity-60">
            Precision-matched pieces reflecting your signature archetype.
          </p>
        </div>

        {loadingRecommendations ? (
          <div className="text-center py-24 flex flex-col items-center gap-8 animate-fade-in">
            <LoadingSpinner size="lg" color="pink" />
            <div className="flex flex-col gap-2">
               <p className="text-brand-pink font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Atelier Sourcing</p>
               <p className="text-brand-dark font-serif font-bold text-2xl">Scouring global boutiques for your matches...</p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {recommendations.map(product => (
              <div key={product.id} className="bg-white rounded-[3.5rem] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.04)] overflow-hidden group/card hover:shadow-[0_40px_80px_rgba(137,162,147,0.12)] transition-all duration-700 flex flex-col hover:-translate-y-4">
                <div className="overflow-hidden bg-brand-cream/20 aspect-[3/4.5] relative">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale-[10%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-1000"
                    onError={(e) => {
                      if (!e.target.dataset.failed) {
                        e.target.dataset.failed = true;
                        e.target.src = getProductImage(product.title, product.category);
                      }
                    }}
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-brand-dark/90 backdrop-blur-md text-white text-[9px] font-black rounded-full flex items-center gap-3 shadow-2xl border border-white/10 z-10 uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></div>
                     {Math.round(product.score * 100)}% Match
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <span className="text-[9px] font-black text-brand-pink uppercase tracking-[0.3em] mb-4 block opacity-80">{product.aesthetic} Aesthetic</span>
                    <h4 className="text-brand-dark font-serif font-bold text-2xl mb-4 line-clamp-1 group-hover/card:text-brand-pink transition-colors duration-500 leading-tight">{product.title}</h4>
                    <p className="text-2xl font-bold text-brand-dark tracking-tighter">{product.price}</p>
                  </div>
                  
                  <p className="text-brand-sage/70 text-sm font-medium line-clamp-2 mb-10 leading-relaxed italic">"{product.description}"</p>
                  
                  <div className="flex gap-4 pt-10 border-t border-brand-gray/50 mt-auto">
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-brand-dark text-white hover:bg-brand-black py-5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 shadow-lg hover:shadow-2xl"
                    >
                      <ShoppingBag className="w-4 h-4 text-brand-pink" />
                      Move to Bag
                    </button>
                    <button 
                      onClick={() => addToFavorites(product)}
                      className="bg-brand-cream/50 hover:bg-brand-pink hover:text-white text-brand-pink p-5 rounded-2xl transition-all duration-500 border border-brand-pink/10 shadow-sm"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  {product.buy_link !== '#' && (
                    <div className="mt-4">
                      <a 
                        href={product.buy_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-white text-brand-sage border border-brand-gray hover:border-brand-pink/30 hover:bg-brand-cream/30 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center transition-all duration-500 block text-center"
                      >
                        Visit Boutique
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-brand-cream/20 rounded-[3.5rem] border border-brand-pink/10 flex flex-col items-center gap-8 animate-fade-in relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-pink/5 blur-3xl rounded-full"></div>
            <div className="w-24 h-24 bg-white border border-brand-gray rounded-full flex items-center justify-center shadow-inner group hover:rotate-180 transition-transform duration-1000">
              <Sparkles className="w-10 h-10 text-brand-pink/40" />
            </div>
            <div className="flex flex-col gap-4">
               <h3 className="text-brand-dark font-serif font-bold text-3xl">Recommendations Pending</h3>
               <p className="text-brand-sage font-black text-[10px] uppercase tracking-[0.3em] opacity-60">The digital atelier is curating your edit.</p>
            </div>
            <button 
              onClick={fetchRecommendations}
              className="bg-brand-dark hover:bg-brand-black text-white px-12 py-5 rounded-2xl transition-all duration-500 font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:-translate-y-1"
            >
              Refresh Vault
            </button>
          </div>
        )}
      </div>

      {/* Fun Fact */}
      <div className="text-center bg-brand-dark rounded-[3.5rem] p-16 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-3xl">🎯</span>
          </div>
          <div className="flex flex-col gap-4">
             <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.4em]">Statistical Insight</p>
             <h4 className="text-white font-serif font-bold text-3xl md:text-5xl tracking-tight leading-tight">Your Signature is <span className="text-brand-pink italic">Rare</span></h4>
          </div>
          <p className="text-white/60 font-medium text-xl leading-relaxed max-w-3xl mx-auto italic">
            "Your specific aesthetic combination is shared by only <span className="text-brand-pink font-bold">6%</span> of StyleGenie users. You are officially part of the style vanguard."
          </p>
        </div>
      </div>
    </div></div>
    </div>
  );
};

export default QuizResults;