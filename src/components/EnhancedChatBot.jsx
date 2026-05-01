import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Send, X, Bot, ShoppingBag, Heart, Sparkles, Star, Wand2, Zap, Crown, History, Inbox, Plus, Menu, Trash2, Eye, Camera, ShoppingCart, Mic, Loader2 } from 'lucide-react';

import { useUserContext } from '../context/UserContext';
import API_BASE_URL from '../config';

const EnhancedChatBot = () => {
  const { preferences, userProfile, user, addToFavorites, addToCart } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const API_BASE = API_BASE_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component opens
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        console.log('Speech recognition result:', event.results);
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript.trim()) {
          console.log('Final transcript:', transcript);
          
          // Enhanced voice processing with emotional context
          const processedTranscript = transcript.trim();
          
          // Add empathetic voice confirmation
          const voiceConfirmation = {
            id: Date.now(),
            type: 'system',
            content: `🎤 I heard: "${processedTranscript}" - Processing your request with care...`,
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, voiceConfirmation]);
          setInputMessage(processedTranscript);
          
          // Send with slight delay for better UX
          setTimeout(() => {
            sendMessage(processedTranscript);
          }, 500);
          
          setIsListening(false);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = '';
        let supportiveMessage = '';
        
        switch (event.error) {
          case 'audio-capture':
            errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
            supportiveMessage = "No worries! You can always type your fashion questions to me. I'm here to help either way! 💕";
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable microphone access in browser settings.';
            supportiveMessage = "That's totally fine! Feel free to type your questions - I love helping through text too! ✨";
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly and try again.';
            supportiveMessage = "Take your time! Sometimes it helps to speak a bit louder or closer to the microphone. I'm patient! 😊";
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            supportiveMessage = "Let's try typing instead while your connection stabilizes. I'm still here to help! 🌟";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
            supportiveMessage = "No problem at all! You can type your fashion questions and I'll give you the same amazing advice! 💫";
        }
        
        // Show supportive message instead of harsh alert
        const supportMessage = {
          id: Date.now(),
          type: 'bot',
          content: `🎤 ${errorMessage}\n\n${supportiveMessage}`,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, supportMessage]);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const getUserId = () => {
    return user?._id || user?.id || `guest_${Date.now()}`;
  };

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    // Use localStorage for chat history since backend doesn't support it yet
    try {
      const userId = getUserId();
      const storedHistory = localStorage.getItem(`chat_history_${userId}`);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const userId = getUserId();
      const storedMessages = localStorage.getItem(`chat_messages_${userId}_${chatId}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        setMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  const createNewChat = async () => {
    const newChatId = `chat_${Date.now()}`;
    setCurrentChatId(newChatId);
    setMessages([]);
    
    // Add to chat history
    const userId = getUserId();
    const newChat = {
      id: newChatId,
      title: 'New conversation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const existingHistory = JSON.parse(localStorage.getItem(`chat_history_${userId}`) || '[]');
    const updatedHistory = [newChat, ...existingHistory];
    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedHistory));
    setChatHistory(updatedHistory);
    
    // Send initial greeting
    await sendMessage('hello', true);
  };

  const deleteChat = async (chatId) => {
    const userId = getUserId();
    
    // Remove from localStorage
    localStorage.removeItem(`chat_messages_${userId}_${chatId}`);
    
    const existingHistory = JSON.parse(localStorage.getItem(`chat_history_${userId}`) || '[]');
    const updatedHistory = existingHistory.filter(chat => chat.id !== chatId);
    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedHistory));
    
    // Update state
    setChatHistory(updatedHistory);
    
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const sendMessage = async (message = inputMessage, isInitial = false) => {
    if (!message.trim() && !isInitial) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    if (!isInitial) {
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }
    
    setIsTyping(true);

    try {
      const userId = getUserId();
      const userProfileData = {
        ...userProfile,
        ...user,
        gender: preferences?.gender || user?.gender || 'female',
        primaryAesthetic: user?.primaryAesthetic || 'minimalist'
      };

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: messages.slice(-10).map(m => ({ 
            role: m.type === 'user' ? 'user' : 'assistant', 
            content: m.content 
          })),
          user_profile: userProfileData,
          image_data: null // Handled separately in handleImageUpload if needed
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Create chat ID if none exists
        if (!currentChatId) {
          const newChatId = `chat_${Date.now()}`;
          setCurrentChatId(newChatId);
        }

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response.text,
          products: data.response.products || [],
          suggestions: data.response.suggestions || [],
          emotionDetected: data.response.emotion_detected || null,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => isInitial ? [botMessage] : [...prev, botMessage]);
        
        // Save messages to localStorage after state update
        setTimeout(() => {
          const userId = getUserId();
          if (currentChatId) {
            setMessages(currentMessages => {
              localStorage.setItem(`chat_messages_${userId}_${currentChatId}`, JSON.stringify(currentMessages));
              return currentMessages;
            });
            
            // Update chat history with new title if needed
            const existingHistory = JSON.parse(localStorage.getItem(`chat_history_${userId}`) || '[]');
            const chatIndex = existingHistory.findIndex(chat => chat.id === currentChatId);
            if (chatIndex >= 0) {
              existingHistory[chatIndex].title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
              existingHistory[chatIndex].updated_at = new Date().toISOString();
              localStorage.setItem(`chat_history_${userId}`, JSON.stringify(existingHistory));
              setChatHistory(existingHistory);
            }
          }
        }, 100);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having a moment, but I'm still here to help! What fashion pieces are you looking for? ✨",
        products: [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => {
        const updatedMessages = [...prev, errorMessage];
        // Save to localStorage
        const userId = getUserId();
        if (currentChatId) {
          setTimeout(() => {
            localStorage.setItem(`chat_messages_${userId}_${currentChatId}`, JSON.stringify(updatedMessages));
          }, 100);
        }
        return updatedMessages;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleProductAction = (action, product) => {
    if (action === 'view') {
      setSelectedProduct(product);
      setShowProductModal(true);
    } else if (action === 'like') {
      // Add to wishlist
      addToFavorites(product);
      
      // Handle like action with feedback
      const likeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Perfect! I've added "${product.title}" to your wishlist! ✨ You have great taste - this piece will look amazing on you!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const updatedMessages = [...prev, likeMessage];
        // Save to localStorage
        const userId = getUserId();
        if (currentChatId) {
          setTimeout(() => {
            localStorage.setItem(`chat_messages_${userId}_${currentChatId}`, JSON.stringify(updatedMessages));
          }, 100);
        }
        return updatedMessages;
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      
      // Add user message with image
      const imageMessage = {
        id: Date.now(),
        type: 'user',
        content: '[Image uploaded for styling advice]',
        image: imageData,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, imageMessage]);
      setIsTyping(true);
      
      try {
        // Send image analysis request
        const userId = getUserId();
        const userProfileData = {
          ...userProfile,
          ...user,
          gender: preferences?.gender || user?.gender || 'female',
          primaryAesthetic: user?.primaryAesthetic || 'minimalist'
        };

        const response = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'I uploaded an image. Can you help me style this or find similar pieces?',
            history: messages.slice(-5).map(m => ({ 
              role: m.type === 'user' ? 'user' : 'assistant', 
              content: m.content 
            })),
            user_profile: userProfileData,
            image_data: imageData
          })
        });

        const data = await response.json();
        
        if (data.success) {
          const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            content: data.response.text || "I can see your image! Based on what you've shared, here are some styling suggestions and similar pieces:",
            products: data.response.products || [],
            timestamp: new Date().toISOString()
          };

          setMessages(prev => {
            const updatedMessages = [...prev, botMessage];
            // Save to localStorage
            const userId = getUserId();
            if (currentChatId) {
              setTimeout(() => {
                localStorage.setItem(`chat_messages_${userId}_${currentChatId}`, JSON.stringify(updatedMessages));
              }, 100);
            }
            return updatedMessages;
          });
        } else {
          throw new Error('Failed to analyze image');
        }
      } catch (error) {
        console.error('Image analysis error:', error);
        
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: "I can see your image! While I analyze it, here are some trending pieces that might work well with your style: ✨",
          products: [],
          timestamp: new Date().toISOString()
        };

        setMessages(prev => {
          const updatedMessages = [...prev, errorMessage];
          // Save to localStorage
          const userId = getUserId();
          if (currentChatId) {
            setTimeout(() => {
              localStorage.setItem(`chat_messages_${userId}_${currentChatId}`, JSON.stringify(updatedMessages));
            }, 100);
          }
          return updatedMessages;
        });
        
        // Send a follow-up request for general recommendations
        setTimeout(() => {
          sendMessage('Show me some trending fashion pieces');
        }, 1000);
      } finally {
        setIsTyping(false);
      }
    };
    
    reader.readAsDataURL(file);
    
    // Clear the input
    event.target.value = '';
  };

  const startVoiceRecognition = async () => {
    if (recognition && !isListening) {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        if (error.name === 'NotAllowedError') {
          alert('Microphone access denied. Please allow microphone permissions in your browser settings and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.');
        } else {
          alert('Error accessing microphone: ' + error.message);
        }
        setIsListening(false);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Speech recognition stop error:', error);
        setIsListening(false);
      }
    }
  };

  return (
    <>
      {/* Chat Button - Hidden when chat is open to avoid blocking input */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#eacc6e] to-[#d4af37] rounded-full shadow-2xl hover:shadow-brand-gold/20 hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12  group-hover:animate-none"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Wand2 className="w-7 h-7 text-black" />
              <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed top-20 left-4 right-4 bottom-4 z-40 flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'hidden md:flex md:w-16' : 'absolute z-50 w-[85%] h-full md:relative md:w-80'} bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300 shadow-2xl md:shadow-none`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#120D20] via-[#1A162D] to-[#120D20]">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">StyleBot AI</h3>
                      <p className="text-white/80 text-sm">Fashion Expert</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
              {!sidebarCollapsed && (
                <button
                  onClick={createNewChat}
                  className="w-full p-3 bg-brand-gold text-navy-900 rounded-lg hover:bg-brand-gold/90 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-brand-gold/10 hover:scale-105 transform"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
              )}
              
              {loadingHistory ? (
                <div className="text-center text-gray-400 py-4">Loading...</div>
              ) : (
                chatHistory.map((chat) => {
                  // Format date properly
                  const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                      return 'Today';
                    } else if (diffDays === 2) {
                      return 'Yesterday';
                    } else if (diffDays <= 7) {
                      return `${diffDays - 1} days ago`;
                    } else {
                      return date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }
                  };
                  
                  return (
                    <div key={chat.id} className="relative group">
                      <button
                        onClick={() => {
                          setCurrentChatId(chat.id);
                          loadChatMessages(chat.id);
                        }}
                        className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                          currentChatId === chat.id 
                            ? 'bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/30' 
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        {!sidebarCollapsed && (
                          <div>
                            <p className="font-medium text-white truncate text-sm leading-tight">
                              {chat.title || 'New conversation'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(chat.updated_at || chat.created_at)}
                            </p>
                          </div>
                        )}
                      </button>
                      {!sidebarCollapsed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {!sidebarCollapsed && <div className="absolute inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)}></div>}
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="md:hidden text-white/80 hover:text-white transition-colors p-1"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 bg-brand-gold/20 border border-brand-gold/30 rounded-full flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white truncate text-sm sm:text-base">StyleBot AI</h3>
                    <p className="text-xs sm:text-sm text-gray-300 truncate">Fashion Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!recognition) {
                        alert('Speech recognition not supported in this browser');
                        return;
                      }
                      if (isListening) {
                        stopVoiceRecognition();
                      } else {
                        startVoiceRecognition();
                      }
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    }`}
                    title={recognition ? "Voice Assistant" : "Voice not supported"}
                    disabled={!recognition}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
              {messages.length === 0 && !currentChatId && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-300">
                    <div className="w-16 h-16 bg-brand-gold/10 to-[#120D20] rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
                      <Crown className="w-8 h-8 text-brand-gold opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-2 text-white">Ready to help you look amazing!</p>
                    <p className="text-sm text-gray-400">Create a new chat to get started</p>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl px-4 py-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white shadow-lg' 
                      : 'bg-[#1A162D] border border-brand-gold/30 shadow-lg text-gray-200'
                  }`}>
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-brand-gold opacity-50 font-semibold">StyleBot AI</span>
                      </div>
                    )}
                    <div className="agentic-prose prose prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    {/* Verified Store Checks (Agentic Feature) */}
                    {(message.type === 'bot' && (message.content.includes('Myntra') || message.content.includes('Ajio') || message.content.includes('Urbanic'))) && (
                      <div className="flex gap-2 flex-wrap mt-4 border-t border-brand-gold/10 pt-3">
                        {['Myntra', 'Ajio', 'Urbanic', 'Flipkart', 'Savana'].map(store => message.content.includes(store) && (
                          <div key={store} className="px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-[8px] uppercase font-bold tracking-widest text-brand-gold/70">
                            Verified Find: {store}
                          </div>
                        ))}
                      </div>
                    )}

                    {message.image && (
                      <div className="mt-3">
                        <img 
                          src={message.image} 
                          alt="Uploaded fashion item" 
                          className="max-w-xs rounded-lg border border-gray-600"
                        />
                      </div>
                    )}

                    {/* Fashion Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-4 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-brand-gold/60" />
                          <span className="text-sm font-medium text-brand-goldLight">Quick Suggestions</span>
                        </div>
                        <div className="space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInputMessage(suggestion.replace('Try: ', '').replace('Ask: ', '').replace('Say: ', '').replace('Request: ', '').replace(/["']/g, ''));
                              }}
                              className="block w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-brand-gold/10 rounded transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.products && message.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {message.products.map((product) => (
                          <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop&auto=format&q=80';
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1">{product.title}</h4>
                                <p className="text-brand-gold font-bold text-sm mb-1">{product.price}</p>
                                <p className="text-gray-600 text-xs">{product.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => {
                                  addToFavorites(product);
                                  const likeMessage = {
                                    id: Date.now(),
                                    type: 'bot',
                                    content: `Perfect! I've added "${product.title}" to your wishlist! ✨ You have great taste!`,
                                    timestamp: new Date().toISOString()
                                  };
                                  setMessages(prev => [...prev, likeMessage]);
                                }}
                                className="flex-1 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-2 px-3 rounded-lg hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                              >
                                <Heart className="w-3 h-3" />
                                Like
                              </button>
                              <button 
                                onClick={() => {
                                  addToCart(product);
                                  const cartMessage = {
                                    id: Date.now(),
                                    type: 'bot',
                                    content: `Great choice! I've added "${product.title}" to your cart! 🛒 Ready to checkout when you are!`,
                                    timestamp: new Date().toISOString()
                                  };
                                  setMessages(prev => [...prev, cartMessage]);
                                }}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1A162D] border border-brand-gold/20 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center ">
                        <Wand2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">StyleBot is thinking...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brand-gold/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-gold/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-brand-gold/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-brand-gold/20 bg-gradient-to-r from-[#120D20] to-[#1A162D]">
              <div className="flex gap-2 sm:gap-3 items-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-700 text-gray-300 p-2 sm:px-4 sm:py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 border border-gray-600 hover:border-purple-500 shrink-0"
                  title="Upload image for visual search"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (!recognition) {
                      alert('Speech recognition not supported in this browser');
                      return;
                    }
                    if (isListening) {
                      stopVoiceRecognition();
                    } else {
                      startVoiceRecognition();
                    }
                  }}
                  className={`p-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 border shrink-0 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-[#d4af37]/5 text-white border-red-500 ' 
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-purple-500'
                  }`}
                  title={recognition ? "Voice input" : "Voice not supported"}
                  disabled={!recognition}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 w-0 min-w-0 bg-[#1A162D]/50 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-brand-gold/20 focus:border-brand-gold/50 focus:outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-brand-gold text-navy-900 px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-brand-goldLight transition-all duration-300 disabled:opacity-50 font-bold shadow-md transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Voice Assistant Popup */}
      {isListening && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-[#120D20] rounded-3xl p-8 shadow-2xl border border-brand-gold/30 max-w-sm w-full relative overflow-hidden">
            {/* Background texture for voice popup */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-brand-gold/10 to-transparent rounded-full mx-auto animate-ping"></div>
                <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] rounded-full mx-auto -m-4 animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">I'm Listening...</h3>
              <p className="text-purple-300 mb-4">Share your fashion thoughts with me</p>
              <div className="text-center mb-4">
                <p className="text-sm text-purple-200 opacity-80">"I need help with..." or "Show me..." or "What should I wear..."</p>
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-2 h-8 bg-brand-gold rounded-full "></div>
                <div className="w-2 h-6 bg-brand-goldLight rounded-full " style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-10 bg-brand-gold rounded-full " style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-4 bg-brand-goldLight rounded-full " style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-7 bg-brand-gold rounded-full " style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={stopVoiceRecognition}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all duration-200 font-medium"
                >
                  Stop Listening
                </button>
                <button
                  onClick={() => {
                    stopVoiceRecognition();
                    setInputMessage("Help me with my style!");
                  }}
                  className="bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold px-4 py-2 rounded-full transition-all duration-200 text-sm border border-brand-gold/20"
                >
                  Need Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedProduct.title}</h3>
                  <p className="text-gray-600">{selectedProduct.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{selectedProduct.price}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Material</h4>
                  <p className="text-gray-600">{selectedProduct.material}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Available Sizes</h4>
                  <div className="flex gap-2">
                    {selectedProduct.sizes?.map(size => (
                      <span key={size} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">{size}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Available Colors</h4>
                  <div className="flex gap-2">
                    {selectedProduct.colors?.map(color => (
                      <span key={color} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">{color}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    addToFavorites(selectedProduct);
                    setShowProductModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-3 px-4 rounded-xl hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </button>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setShowProductModal(false);
                  }}
                  className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-900 transition-all duration-200 font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedChatBot;