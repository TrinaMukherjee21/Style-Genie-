import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, ShoppingBag, Heart, Sparkles, Star, Wand2, Zap, Crown, History, Inbox, Plus, Menu, Search, Settings, Trash2, Archive, Eye, EyeOff, Camera } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { styleBot } from '../utils/styleBot';
import { imageAnalyzer } from '../chatbot/imageAnalysis';
import { secretAgentInbox } from '../chatbot/secretAgentInbox';
import VisualSearch from '../chatbot/VisualSearch';

const EnhancedStyleBot = () => {
  const { preferences, userProfile, user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'inbox'
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Secret Agent Inbox
  useEffect(() => {
    const initializeInbox = async () => {
      const userProfileData = {
        ...userProfile,
        ...user,
        gender: preferences?.gender || user?.gender || 'female',
        primaryAesthetic: user?.primaryAesthetic || 'minimalist',
        userId: user?._id || user?.id || `guest_${Date.now()}`
      };

      // Generate initial secret agent messages
      const secretMessages = await secretAgentInbox.generateSecretMessages(userProfileData);
      setInboxMessages(secretMessages);
      setUnreadCount(secretMessages.filter(msg => !msg.read).length);

      // Set up daily secret agent drops
      const interval = setInterval(async () => {
        const newMessage = await secretAgentInbox.generateDailyDrop(userProfileData);
        if (newMessage) {
          setInboxMessages(prev => [newMessage, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      }, 24 * 60 * 60 * 1000); // Daily

      return () => clearInterval(interval);
    };

    if (user) {
      initializeInbox();
    }
  }, [user, userProfile, preferences]);

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    
    // Initialize with greeting
    initializeChat(newChatId);
  };

  const initializeChat = async (chatId) => {
    const userProfileData = {
      ...userProfile,
      ...user,
      gender: preferences?.gender || user?.gender || 'female',
      primaryAesthetic: user?.primaryAesthetic || 'minimalist',
      userId: user?._id || user?.id || `guest_${Date.now()}`
    };

    try {
      const response = await styleBot.processMessage('hello', userProfileData);
      
      const greeting = {
        id: Date.now(),
        type: 'bot',
        content: response.message,
        products: response.products || [],
        suggestions: response.suggestions || ['Show me casual pieces', 'Find formal wear', 'Style advice', 'Daily recommendations'],
        timestamp: Date.now()
      };
      
      setMessages([greeting]);
      updateChatHistory(chatId, [greeting], 'StyleBot Chat');
    } catch (error) {
      console.error('StyleBot initialization failed, using simple chatbot:', error);
      
      const response = await styleBot.processMessage('hello', userProfileData);
      
      const greeting = {
        id: Date.now(),
        type: 'bot',
        content: response.message,
        products: response.products || [],
        suggestions: response.suggestions || ['Show me casual pieces', 'Find formal wear', 'Style advice', 'Daily recommendations'],
        timestamp: Date.now()
      };
      
      setMessages([greeting]);
      updateChatHistory(chatId, [greeting], 'StyleBot Chat');
    }
  };

  const updateChatHistory = (chatId, newMessages, title = null) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: newMessages,
            title: title || chat.title,
            timestamp: Date.now()
          }
        : chat
    ));
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    if (!currentChatId) {
      createNewChat();
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const userProfileData = {
        ...userProfile,
        ...user,
        gender: preferences?.gender || user?.gender || 'female',
        primaryAesthetic: user?.primaryAesthetic || 'minimalist',
        userId: user?._id || user?.id || `guest_${Date.now()}`
      };

      // Check for recent image context
      const recentImageMessage = messages.slice(-5).find(msg => msg.image);
      const imageContext = recentImageMessage ? recentImageMessage.image : null;
      
      // Use enhanced StyleBot with context awareness
      const responseData = await styleBot.processMessage(message, userProfileData, imageContext);
      
      // Add variety to response timing
      const responseDelay = responseData.needsClarification ? 800 : Math.random() * 1000 + 1500;
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: responseData.message,
          products: responseData.products || [],
          suggestions: responseData.suggestions || [],
          intent: responseData.intent || 'general',
          confidence: responseData.confidence || 0.7,
          conversationTurn: responseData.conversationTurn || 1,
          needsClarification: responseData.needsClarification || false,
          timestamp: Date.now()
        };

        const finalMessages = [...newMessages, botMessage];
        setMessages(finalMessages);
        setIsTyping(false);
        
        // Generate dynamic chat title based on conversation context
        const chatTitle = generateChatTitle(newMessages, responseData.intent);
        updateChatHistory(currentChatId, finalMessages, chatTitle);
        
        // Update taste profile if user interacted with products
        if (responseData.products?.length > 0) {
          styleBot.updateTasteProfile(userProfileData.userId, {
            type: 'view',
            products: responseData.products,
            query: message
          });
        }
      }, responseDelay);

    } catch (error) {
      console.error('Enhanced chatbot failed:', error);
      setIsTyping(false);
      
      // Improved fallback with more helpful response
      setTimeout(() => {
        const fallbackResponses = [
          "I'm having a moment, but I'm still here to help! What fashion question can I assist you with? ✨",
          "Let me refocus - I'm ready to help you find amazing pieces! What are you looking for today? 💫",
          "Technical hiccup, but my fashion expertise is still here! How can I help style you today? 🌟"
        ];
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
          products: [],
          suggestions: ['Show me dresses', 'Find casual wear', 'Style advice', 'Help me shop'],
          timestamp: Date.now(),
          isFallback: true
        };

        const finalMessages = [...newMessages, botMessage];
        setMessages(finalMessages);
        updateChatHistory(currentChatId, finalMessages);
      }, 1000);
    }
  };

  // Generate dynamic chat titles based on conversation context
  const generateChatTitle = (messages, intent) => {
    if (messages.length === 1) {
      const userMessage = messages[0].content;
      
      // Generate title based on intent and content
      if (intent === 'visual_search') return '👗 Visual Styling';
      if (intent === 'product_search') {
        if (userMessage.toLowerCase().includes('dress')) return '👗 Dress Shopping';
        if (userMessage.toLowerCase().includes('shoes')) return '👠 Shoe Search';
        if (userMessage.toLowerCase().includes('casual')) return '👕 Casual Wear';
        return '🛍️ Product Search';
      }
      if (intent === 'styling_advice') return '💡 Style Advice';
      
      // Fallback to truncated message
      return userMessage.slice(0, 25) + (userMessage.length > 25 ? '...' : '');
    }
    
    return chatHistory.find(c => c.id === currentChatId)?.title || 'Fashion Chat';
  };

  const handleVisualStyling = async (imageData, query, userProfile) => {
    try {
      // Create image element for analysis
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          // Analyze the image
          const colors = imageAnalyzer.extractColors(img);
          const category = imageAnalyzer.detectCategory(img);
          
          // Generate styling suggestions based on query
          let suggestions = [];
          let responseMessage = '';
          
          if (query.toLowerCase().includes('footwear') || query.toLowerCase().includes('shoes')) {
            suggestions = generateFootwearSuggestions(colors, category);
            responseMessage = `Perfect! Based on your ${category}, here are some footwear options that would look amazing:`;
          } else if (query.toLowerCase().includes('accessories')) {
            suggestions = generateAccessorySuggestions(colors, category);
            responseMessage = `Great choice! Here are some accessories that would complement your ${category} beautifully:`;
          } else if (query.toLowerCase().includes('match') || query.toLowerCase().includes('go with')) {
            suggestions = generateMatchingSuggestions(colors, category);
            responseMessage = `I can see your ${category}! Here are some pieces that would create a stunning outfit:`;
          } else {
            suggestions = imageAnalyzer.generateSuggestions(colors, category);
            responseMessage = `Based on your uploaded ${category}, here are my styling recommendations:`;
          }
          
          resolve({
            message: responseMessage,
            products: suggestions,
            suggestions: ['Show more options', 'Different colors', 'Other styles', 'Complete the look'],
            confidence: 0.95
          });
        };
        img.src = imageData;
      });
    } catch (error) {
      console.error('Visual analysis failed:', error);
      return {
        message: "I can see your image! While I analyze it, here are some general styling tips that might help:",
        products: (await styleBot.processMessage(query, userProfile)).products,
        suggestions: ['Upload another image', 'Style advice', 'Color matching', 'Outfit ideas'],
        confidence: 0.7
      };
    }
  };

  const generateFootwearSuggestions = (colors, category) => {
    const footwearOptions = {
      'dress': [
        { id: 'f1', title: 'Block Heel Pumps', price: 89, description: 'Classic pumps that elongate your silhouette' },
        { id: 'f2', title: 'Strappy Sandals', price: 65, description: 'Elegant sandals for a sophisticated look' },
        { id: 'f3', title: 'Ankle Boots', price: 95, description: 'Versatile boots that add edge to any dress' }
      ],
      'top': [
        { id: 'f4', title: 'White Sneakers', price: 75, description: 'Clean sneakers for a casual-chic vibe' },
        { id: 'f5', title: 'Loafers', price: 85, description: 'Polished loafers for smart-casual styling' },
        { id: 'f6', title: 'Ballet Flats', price: 55, description: 'Comfortable flats for everyday elegance' }
      ]
    };
    
    return footwearOptions[category] || footwearOptions['top'];
  };

  const generateAccessorySuggestions = (colors, category) => {
    return [
      { id: 'a1', title: 'Statement Necklace', price: 45, description: 'Bold necklace to elevate your look' },
      { id: 'a2', title: 'Leather Handbag', price: 120, description: 'Structured bag that complements any outfit' },
      { id: 'a3', title: 'Silk Scarf', price: 35, description: 'Versatile scarf for added sophistication' }
    ];
  };

  // Handle product interactions for learning
  const handleProductInteraction = async (action, product) => {
    const userProfileData = {
      ...userProfile,
      ...user,
      userId: user?._id || user?.id || `guest_${Date.now()}`
    };

    try {
      // Update taste profile
      styleBot.updateTasteProfile(userProfileData.userId, {
        type: action,
        product: product,
        timestamp: Date.now()
      });

      // Show feedback message for likes
      if (action === 'like') {
        const feedbackMessages = [
          "Great choice! I'm learning your style preferences ✨",
          "Love it! This helps me understand your taste better 💫",
          "Perfect! I'll remember this for future recommendations 🌟"
        ];
        
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
      }
    } catch (error) {
      console.error('Product interaction failed:', error);
    }
  };

  const generateMatchingSuggestions = (colors, category) => {
    if (category === 'dress') {
      return [
        { id: 'm1', title: 'Denim Jacket', price: 75, description: 'Perfect layering piece for casual elegance' },
        { id: 'm2', title: 'Blazer', price: 95, description: 'Structured blazer for professional polish' },
        { id: 'm3', title: 'Cardigan', price: 65, description: 'Cozy cardigan for comfortable styling' }
      ];
    }
    return [
      { id: 'm4', title: 'High-Waisted Jeans', price: 69, description: 'Classic jeans that pair with everything' },
      { id: 'm5', title: 'Midi Skirt', price: 55, description: 'Elegant skirt for a feminine touch' },
      { id: 'm6', title: 'Tailored Trousers', price: 85, description: 'Sophisticated pants for any occasion' }
    ];
  };

  const markInboxMessageAsRead = (messageId) => {
    setInboxMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const deleteInboxMessage = (messageId) => {
    setInboxMessages(prev => prev.filter(msg => msg.id !== messageId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Initialize first chat if none exists
  useEffect(() => {
    if (isOpen && chatHistory.length === 0 && !currentChatId) {
      createNewChat();
    }
  }, [isOpen]);

  // Clear conversation context when starting new chat
  const handleNewChat = () => {
    const userProfileData = {
      ...userProfile,
      ...user,
      userId: user?._id || user?.id || `guest_${Date.now()}`
    };
    
    // Clear context in StyleBot
    styleBot.clearContext(userProfileData.userId);
    createNewChat();
  };

  return (
    <>
      {/* Chat Button - Hidden when chat is open to avoid blocking send button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#eacc6e] to-[#d4af37] rounded-full shadow-2xl hover:shadow-brand-gold/20 hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12  group-hover:animate-none"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Wand2 className="w-7 h-7 text-navy-900" />
                <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
            </button>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed top-20 left-4 right-4 bottom-4 z-40 flex bg-gradient-to-br from-dark-primary via-dark-surface to-dark-card rounded-xl shadow-2xl overflow-hidden border border-dark-border backdrop-blur-sm">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gradient-to-b from-dark-surface to-dark-card border-r border-dark-border flex flex-col transition-all duration-300`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-dark-border bg-gradient-to-r from-[#120D20] via-[#1A162D] to-[#120D20] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent "></div>
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-neon-glow relative z-10">
                      <Crown className="w-4 h-4 text-white " />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">StyleBot AI</h3>
                      <p className="text-white/80 text-sm">Fashion Expert</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-white/80 hover:text-white transition-colors relative z-10 hover:scale-110 transform duration-200"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-dark-border bg-brand-dark/50">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${
                  activeTab === 'chat' 
                    ? 'bg-brand-gold/10 text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {sidebarCollapsed ? <MessageCircle className="w-4 h-4 mx-auto" /> : 'Chats'}
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 p-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'inbox' 
                    ? 'bg-brand-gold/10 text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {sidebarCollapsed ? (
                  <div className="relative">
                    <Inbox className="w-4 h-4 mx-auto" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Secret Inbox
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'chat' ? (
                <div className="p-4 space-y-2">
                  {!sidebarCollapsed && (
                    <button
                      onClick={handleNewChat}
                      className="w-full p-3 bg-brand-gold text-navy-900 rounded-lg hover:bg-brand-goldLight transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:scale-105 transform"
                    >
                      <Plus className="w-4 h-4" />
                      New Chat
                    </button>
                  )}
                  
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => loadChat(chat.id)}
                      className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                        currentChatId === chat.id 
                          ? 'bg-brand-gold/10 border border-brand-gold/30' 
                          : 'hover:bg-dark-card/50'
                      }`}
                    >
                      {!sidebarCollapsed && (
                        <div>
                          <p className="font-medium text-white truncate">{chat.title}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {inboxMessages.map((message) => (
                    <div className="bg-brand-gold/10 border border-brand-gold/20 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                      onClick={() => markInboxMessageAsRead(message.id)}
                    >
                      {!sidebarCollapsed && (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center">
                                <Zap className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs font-bold text-purple-600">SECRET AGENT</span>
                              {!message.read && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteInboxMessage(message.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mb-1">{message.title}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{message.content}</p>
                          {message.products && message.products.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {message.products.slice(0, 2).map((product, idx) => (
                                <div key={idx} className="flex-1 p-2 bg-white rounded border">
                                  {product.image && (
                                    <img 
                                      src={product.image} 
                                      alt={product.title}
                                      className="w-full h-12 object-cover rounded mb-1"
                                    />
                                  )}
                                  <p className="text-xs font-medium truncate">{product.title}</p>
                                  <p className="text-xs text-purple-600">${product.price}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-border bg-gradient-to-r from-dark-surface to-dark-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent "></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center animate-neon-glow">
                    <Crown className="w-4 h-4 text-white " />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">StyleBot AI</h3>
                    <p className="text-sm text-gray-300">Your Personal Fashion Expert</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Welcome Message */}
              <div className="mt-3 p-3 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-lg border border-neon-purple/20 relative z-10 backdrop-blur-sm">
                <p className="text-white text-center font-medium">
                  Hey {user?.name || user?.firstName || 'there'}! 👋 How may I help you today?
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent  rounded-lg"></div>
              </div>
              
              {/* Visual Search Button */}
              <div className="mt-3 relative z-10">
                <button
                  onClick={() => setShowVisualSearch(true)}
                  className="w-full p-3 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 rounded-lg text-white font-medium hover:from-neon-cyan/30 hover:to-neon-purple/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform"
                >
                  <Camera className="w-5 h-5" />
                  Visual Search
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 bg-gradient-to-b from-dark-primary via-dark-surface to-dark-card relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-neon-purple rounded-full blur-xl "></div>
                <div className="absolute top-32 right-16 w-16 h-16 bg-neon-pink rounded-full blur-xl " style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-neon-cyan rounded-full blur-xl " style={{animationDelay: '2s'}}></div>
              </div>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full relative z-10">
                  <div className="text-center text-gray-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-neon-glow">
                      <Crown className="w-8 h-8 text-brand-gold " />
                    </div>
                    <p className="text-lg font-medium mb-2 text-white">Ready to help you look amazing!</p>
                    <p className="text-sm text-gray-400">Ask me about fashion, styling, or outfit recommendations</p>
                  </div>
                </div>
              )}
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl px-4 py-3 rounded-2xl relative z-10 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg' 
                      : 'bg-gradient-to-r from-dark-card to-dark-surface border border-dark-border shadow-lg backdrop-blur-sm'
                  }`}>
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center animate-neon-glow">
                          <Crown className="w-3 h-3 text-white " />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-purple-600 font-semibold">Enhanced StyleBot</span>
                          {message.emotion && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                              {message.emotion}
                            </span>
                          )}
                          {message.confidence && message.confidence > 0.8 && (
                            <span className="text-xs text-green-600">●</span>
                          )}
                        </div>
                      </div>
                    )}
                    <p className={`leading-relaxed ${
                      message.type === 'user' ? 'text-white' : 'text-gray-200'
                    }`}>{message.content}</p>

                    {message.image && (
                      <div className="mt-3">
                        <img 
                          src={message.image} 
                          alt="Uploaded outfit" 
                          className="max-w-xs rounded-lg border border-dark-border"
                        />
                      </div>
                    )}

                    {message.products && message.products.map((product) => (
                      <div key={product.id} className="mt-3 p-3 bg-gray-50 rounded-xl border">
                        {/* Debug: Log product data */}
                        {console.log('Product data:', product)}
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onLoad={() => console.log('Image loaded successfully:', product.image)}
                                onError={(e) => {
                                  console.error('Image failed to load:', product.image);
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : console.log('No image URL provided for product:', product.title)}
                            <div 
                              className="w-16 h-16 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-xl flex items-center justify-center" 
                              style={{display: product.image ? 'none' : 'flex'}}
                            >
                              <ShoppingBag className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{product.title}</h4>
                            <p className="text-purple-600 font-bold mb-1">${product.price}</p>
                            <p className="text-gray-600 text-sm">{product.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => handleProductInteraction('like', product)}
                            className="flex-1 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-2 px-4 rounded-lg hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            Like
                          </button>
                          <button 
                            onClick={() => handleProductInteraction('view', product)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-purple-600 font-medium mb-2">Quick suggestions:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(suggestion)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm py-2 px-3 rounded-full transition-all duration-200"
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
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center ">
                        <Wand2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">StyleBot is thinking...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-border bg-gradient-to-r from-dark-surface to-dark-card relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent "></div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVisualSearch(true)}
                  className="bg-brand-dark text-gray-300 px-4 py-3 rounded-xl hover:bg-dark-card transition-all duration-200 border border-dark-border hover:border-neon-cyan/50 relative z-10"
                  title="Upload image for visual search"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={uploadedImage ? "Ask me about the uploaded image..." : "Ask me anything about fashion..."}
                  className="flex-1 bg-dark-card text-white px-4 py-3 rounded-xl border border-dark-border focus:border-neon-purple focus:outline-none transition-all duration-200 placeholder-gray-400 relative z-10"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-brand-gold text-navy-900 px-6 py-3 rounded-xl hover:bg-brand-goldLight transition-all duration-300 disabled:opacity-50 shadow-md hover:scale-105 transform relative z-10 font-bold"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Visual Search Modal */}
      {showVisualSearch && (
        <VisualSearch 
          onImageUpload={(imageData, fileName) => {
            setUploadedImage({ data: imageData, name: fileName });
            const imageMessage = {
              id: Date.now(),
              type: 'user',
              content: `[Image: ${fileName}]`,
              image: imageData,
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, imageMessage]);
            setShowVisualSearch(false);
          }}
          onClose={() => setShowVisualSearch(false)}
        />
      )}
    </>
  );
};

export default EnhancedStyleBot;