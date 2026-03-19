import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, ShoppingBag, Heart, Sparkles, Star, Wand2, Zap, Crown } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import GenderSelectionModal from './common/GenderSelectionModal';
import { styleBot } from '../utils/styleBot';
import { workingChatbot } from '../chatbot/workingChatbot';
import { dailyDropsScheduler } from '../chatbot/dailyDropsScheduler';
import { tasteProfileManager } from '../chatbot/tasteProfileManager';
import API_BASE_URL from '../config';


const StyleBot = () => {
  const { preferences, userProfile, user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState({ 
    likedItems: [], 
    dislikedItems: [], 
    styleProfile: [],
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    gender: preferences?.gender || 'female'
  });

  const [showSparkles, setShowSparkles] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      // Initialize StyleBot with user profile
      const initializeStyleBot = async () => {
        try {
          const userProfileData = {
            ...userProfile,
            ...user,
            gender: preferences?.gender || user?.gender || 'female',
            primaryAesthetic: user?.primaryAesthetic || userProfile?.primaryAesthetic || 'minimalist',
            secondaryAesthetics: user?.secondaryAesthetics || userProfile?.secondaryAesthetics || [],
            userId: user?._id || user?.id || `guest_${Date.now()}`
          };

          // Generate greeting with StyleBot
          const response = await styleBot.processMessage('hello', userProfileData);
          
          const greeting = {
            id: 1,
            type: 'bot',
            content: response.message,
            products: response.products || [],
            suggestions: response.suggestions || ['Show me casual pieces', 'Find formal wear', 'Style advice', 'Daily recommendations'],
            timestamp: Date.now(),
            personality: 'stylebot_professional'
          };
          
          setMessages([greeting]);
          
          // Register user for daily drops
          dailyDropsScheduler.registerUser(userProfileData);
          
          // Check for daily drop
          const dailyDrop = styleBot.generateDailyDrop(userProfileData);
          if (dailyDrop) {
            setTimeout(() => {
              const dropMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: dailyDrop.message,
                products: dailyDrop.products,
                suggestions: ['Tell me more', 'Show similar pieces', 'Different style', 'Save for later'],
                timestamp: Date.now(),
                isDailyDrop: true
              };
              setMessages(prev => [...prev, dropMessage]);
            }, 2000);
          }
        } catch (error) {
          console.error('StyleBot initialization failed:', error);
          // Fallback to basic greeting
          const greeting = {
            id: 1,
            type: 'bot',
            content: "Hey gorgeous! 👋 I'm StyleBot, your personal fashion expert. Ready to discover some amazing pieces together?",
            suggestions: ['Show me casual pieces', 'Find formal wear', 'Style advice', 'Color recommendations'],
            timestamp: Date.now()
          };
          setMessages([greeting]);
        }
      };
      
      initializeStyleBot();
    }
  }, [messages.length, user, userProfile, preferences]);

  // Check if user needs to select gender before chatting
  const checkGenderSelection = () => {
    if (user && !preferences?.gender) {
      const savedGender = localStorage.getItem('user_gender_preference');
      if (!savedGender) {
        setShowGenderModal(true);
        return false;
      }
    }
    return true;
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;
    
    // Check if gender selection is needed before sending message
    if (!checkGenderSelection()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);

    try {
      // Use StyleBot as primary system
      const userProfileData = {
        ...userProfile,
        ...user,
        gender: preferences?.gender || user?.gender || 'female',
        primaryAesthetic: user?.primaryAesthetic || userProfile?.primaryAesthetic || 'minimalist',
        secondaryAesthetics: user?.secondaryAesthetics || userProfile?.secondaryAesthetics || [],
        userId: user?._id || user?.id || `guest_${Date.now()}`
      };

      const response = await styleBot.processMessage(message, userProfileData);
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.message,
          products: response.products || [],
          suggestions: response.suggestions || ['Show me more', 'Different style', 'Price range', 'Color options'],
          timestamp: Date.now(),
          confidence: response.confidence,
          personality: response.personality
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, Math.random() * 800 + 1200);

    } catch (error) {
      console.error('StyleBot Error:', error);
      setIsTyping(false);
      
      // Use fallback chatbot system
      const fallbackResponse = workingChatbot.processMessage(message, {
        ...userProfile,
        ...user,
        gender: preferences?.gender || user?.gender || 'female'
      });
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: fallbackResponse.message,
          products: fallbackResponse.products || [],
          suggestions: fallbackResponse.suggestions || ['Casual outfits', 'Formal wear', 'Trendy pieces', 'Style tips'],
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMessage]);
      }, Math.random() * 800 + 1200);
    }
  };

  const handleProductAction = async (action, productId, product) => {
    try {
      const userId = user?._id || user?.id || `guest_${Date.now()}`;
      
      if (action === 'like') {
        setUserPreferences(prev => ({
          ...prev,
          likedItems: [...prev.likedItems.filter(id => id !== productId), productId],
          styleProfile: [...prev.styleProfile, product.aesthetic, product.category].filter((v, i, a) => a.indexOf(v) === i)
        }));
        
        // Update StyleBot's taste profile
        const updatedProfile = styleBot.updateTasteProfile(userId, {
          type: 'like',
          product: product
        });
        
        // Get personalized feedback message
        const profileSummary = tasteProfileManager.getProfileSummary(userId);
        const feedbackMessages = [
          `Yasss! 💕 I'm learning your gorgeous ${profileSummary.dominantStyle} taste - expect even better recommendations!`,
          `Perfect choice! ✨ Your style confidence is now at ${profileSummary.styleConfidence}% - you're becoming a true fashion maven!`,
          `Love it! 🔥 I can see your ${profileSummary.dominantStyle} aesthetic shining through - more amazing finds coming your way!`
        ];
        
        // Show personalized feedback message
        const feedbackMessage = {
          id: Date.now() + Math.random(),
          type: 'bot',
          content: feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)],
          timestamp: Date.now(),
          isSystemMessage: true
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, feedbackMessage]);
        }, 500);
        
      } else if (action === 'dislike') {
        setUserPreferences(prev => ({
          ...prev,
          dislikedItems: [...prev.dislikedItems.filter(id => id !== productId), productId]
        }));
        
        styleBot.updateTasteProfile(userId, {
          type: 'dislike',
          product: product
        });
        
        // Show understanding message
        const understandingMessage = {
          id: Date.now() + Math.random(),
          type: 'bot',
          content: "Got it! 📝 I'm noting that this isn't quite your vibe - I'll find better matches for your style!",
          timestamp: Date.now(),
          isSystemMessage: true
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, understandingMessage]);
        }, 500);
      }
      
      // Try to send feedback to backend (optional)
      try {
        await fetch(`${API_BASE_URL}/api/enhanced/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: action, 
            productId,
            userId: userId,
            product: product
          })
        });
      } catch (backendError) {
        console.log('Backend feedback failed, using local storage');
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <>
      {/* Chat Button - Hidden when chat is open to avoid blocking send button */}
      <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div className="relative">
          {showSparkles && (
            <div className="absolute -inset-4 animate-ping">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full opacity-20"></div>
            </div>
          )}
          <button
            onClick={() => {
              if (!isOpen && !messages.length) {
                setMessages([{
                  id: 'welcome',
                  type: 'bot',
                  content: `Hello ${user?.name || 'Beautiful'}! ✨ I'm your StyleBot. How can I help you today?`,
                  timestamp: new Date().toISOString()
                }]);
              }
              setIsOpen(true);
            }}
            className="w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#eacc6e] to-[#d4af37] rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12  group-hover:animate-none"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Wand2 className="w-7 h-7 text-navy-900" />
              <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
            </div>
          </button>
        </div>
      )}
      </div>

      {/* Gender Selection Modal */}
      <GenderSelectionModal 
        isOpen={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        onGenderSelect={(gender) => {
          setShowGenderModal(false);
          // Update user preferences with selected gender
          setUserPreferences(prev => ({ ...prev, gender }));
        }}
      />

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] z-40 flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#120D20] via-[#1A162D] to-[#120D20] p-5 border-b border-brand-gold/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
                    <Crown className="w-4 h-4 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full "></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold flex items-center gap-2">
                      StyleBot 
                      <Sparkles className="w-4 h-4 text-yellow-300 " />
                    </h3>
                    <p className="text-white/80 text-sm">Your Witty Fashion Expert</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Magical Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gradient-to-b from-[#120D20] to-[#1A162D]">
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className={`max-w-sm px-4 py-3 rounded-2xl shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 text-white ml-4' 
                      : 'bg-[#1A162D]/90 text-gray-100 border border-brand-gold/20 backdrop-blur-sm mr-4'
                  }`}>
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-brand-gold font-semibold">StyleBot</span>
                        <Sparkles className="w-3 h-3 text-brand-gold opacity-50 " />
                        {message.isDailyDrop && (
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold ">
                            Daily Drop ✨
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {message.products && message.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 p-3 bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 rounded-xl border border-brand-gold/20 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-1" style={{animationDelay: `${(productIndex + 1) * 200}ms`}}>
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-14 h-14 bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 rounded-xl flex items-center justify-center" style={{display: product.image ? 'none' : 'flex'}}>
                              <ShoppingBag className="w-7 h-7 text-brand-gold" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-800 mb-1">{product.title}</h4>
                            <p className="text-brand-gold font-bold text-sm mb-1">
                              {typeof product.price === 'string' ? product.price : `$${product.price}`}
                            </p>
                            <p className="text-gray-600 text-xs leading-relaxed">{product.description}</p>
                            {(product.matchScore || product.matchReason) && (
                              <div className="mt-2 space-y-1">
                                {product.matchScore && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 h-1.5 rounded-full transition-all duration-300"
                                        style={{width: `${(product.matchScore * 100)}%`}}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-brand-gold font-medium">{Math.round(product.matchScore * 100)}% match</span>
                                  </div>
                                )}
                                {product.matchReason && (
                                  <div className="px-2 py-1 bg-green-100 rounded-full text-xs text-green-700 inline-block">
                                    <Zap className="w-3 h-3 inline mr-1" />
                                    {product.matchReason}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => handleProductAction('like', product.id, product)}
                            className={`flex-1 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1 ${
                              userPreferences.likedItems.includes(product.id) 
                                ? 'bg-red-100 text-red-600 border border-red-200' 
                                : 'bg-brand-gold/10 border-[#d4af37]/20 to-brand-gold/5 text-white hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${userPreferences.likedItems.includes(product.id) ? 'fill-current' : ''}`} />
                            {userPreferences.likedItems.includes(product.id) ? 'Liked' : 'Like'}
                          </button>
                        </div>
                      </div>
                    ))}

                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Quick suggestions:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(suggestion)}
                              className="bg-brand-gold/10 border-[#d4af37]/20 hover:bg-brand-gold/20 text-brand-goldLight text-xs py-2 px-3 rounded-full transition-all duration-200 border border-[#d4af37]/20 hover:border-[#d4af37]/40 shadow-sm hover:shadow-md transform hover:scale-105 font-medium"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-[#1A162D]/90 text-gray-100 px-4 py-3 rounded-2xl border border-brand-gold/20 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-brand-gold/20 border-brand-gold/30 rounded-full flex items-center justify-center ">
                        <Wand2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">StyleGenie is working her magic...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-brand-gold/60 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-brand-gold/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-brand-gold/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Magical Input */}
            <div className="p-4 border-t border-brand-gold/20 bg-gradient-to-br from-[#120D20] to-[#1A162D]">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about fashion... ✨"
                    className="w-full bg-[#1A162D]/50 text-white px-4 py-3 rounded-xl border-2 border-brand-gold/20 focus:border-brand-gold/50 focus:outline-none transition-all duration-200 backdrop-blur-sm shadow-sm focus:shadow-md"
                    disabled={isTyping}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Sparkles className="w-4 h-4 text-brand-gold/40 " />
                  </div>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-brand-gold text-navy-900 px-4 py-3 rounded-xl hover:bg-brand-goldLight transition-all duration-300 disabled:opacity-50 shadow-md transform hover:scale-105 active:scale-95 relative overflow-hidden group font-bold"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Send className="w-5 h-5 relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StyleBot;