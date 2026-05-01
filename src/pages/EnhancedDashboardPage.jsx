import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, Heart, TrendingUp, Clock, Star, Gift, Zap, Sparkles, RefreshCcw, X } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { inboxService } from '../services/inboxService';

const EnhancedDashboardPage = () => {
  const { user, userProfile } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cleanup = () => {};
    const initInbox = async () => {
      if (user || userProfile) {
        setIsLoading(true);
        await inboxService.initialize(userProfile || user);
        
        const handleUpdate = (newMessages, newUnreadCount) => {
          setMessages(newMessages);
          setUnreadCount(newUnreadCount);
          setIsLoading(false);
        };

        inboxService.addListener(handleUpdate);
        
        setMessages(inboxService.getMessages());
        setUnreadCount(inboxService.getUnreadCount());
        setIsLoading(false);

        cleanup = () => inboxService.removeListener(handleUpdate);
      }
    };
    
    initInbox();
    return cleanup;
  }, [user, userProfile]);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      inboxService.markAsRead(message.id);
    }
  };

  const handleDeleteMessage = (messageId, e) => {
    e.stopPropagation();
    inboxService.deleteMessage(messageId);
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const getMessageIcon = (type) => {
    const icons = {
      welcome: <Gift className="w-5 h-5 text-brand-pink" />,
      new_arrivals: <Star className="w-5 h-5 text-brand-pink" />,
      flash_sale: <Zap className="w-5 h-5 text-brand-sage" />,
      trend_alert: <TrendingUp className="w-5 h-5 text-brand-pink" />,
      personalized: <Heart className="w-5 h-5 text-brand-sage" />,
      seasonal: <Clock className="w-5 h-5 text-brand-pink" />,
      restock: <ShoppingBag className="w-5 h-5 text-brand-pink" />,
      inspiration: <Sparkles className="w-5 h-5 text-brand-pink" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-brand-sage" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-brand-pink/10 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative">
            <RefreshCcw className="w-12 h-12 text-brand-pink animate-spin mx-auto mb-6" />
            <p className="text-brand-dark font-serif font-bold text-xl tracking-tight">Curating your style narrative...</p>
            <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] mt-4 opacity-60">Signature Atelier Experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Soft palette bloom */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-xl border-b border-brand-gray/50 sticky top-24 z-30 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Signature Dashboard</p>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/40"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark flex items-center gap-4">
                <span>Welcome back, <span className="text-brand-pink italic">{user?.name || user?.firstName || 'Fashionista'}</span></span>
                <Sparkles className="w-8 h-8 text-brand-pink animate-pulse" />
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative p-5 bg-white rounded-[1.5rem] border border-brand-gray/50 shadow-sm hover:shadow-xl hover:border-brand-pink/20 transition-all duration-500 cursor-pointer group">
                <Bell className="w-6 h-6 text-brand-sage group-hover:text-brand-pink transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-pink text-white border-4 border-white text-[10px] rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] border border-brand-gray shadow-[0_20px_60px_rgba(137,162,147,0.06)] overflow-hidden transition-all duration-500 hover:shadow-2xl">
              <div className="p-10 border-b border-brand-gray bg-brand-cream/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-brand-dark flex items-center gap-5">
                    <Sparkles className="w-7 h-7 text-brand-pink" />
                    Style Narrative
                  </h2>
                  <span className="text-[9px] text-brand-sage bg-white px-6 py-2.5 rounded-full border border-brand-gray/50 font-bold uppercase tracking-[0.2em] shadow-sm">
                    {messages.length} Curated Insights
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-brand-gray max-h-[750px] overflow-y-auto custom-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-8 cursor-pointer transition-all duration-500 hover:bg-brand-cream/20 ${
                      !message.read ? 'bg-brand-pink/5 border-l-4 border-l-brand-pink' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-8">
                      <div className="flex-shrink-0 mt-1 p-4 bg-white rounded-2xl border border-brand-gray/50 shadow-sm transition-all duration-500 hover:scale-110 hover:shadow-lg">
                        {getMessageIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`text-lg font-bold tracking-tight ${!message.read ? 'text-brand-dark' : 'text-brand-sage'}`}>
                            {message.title}
                          </h3>
                          <div className="flex items-center gap-5">
                            <span className="text-[9px] text-brand-sage font-bold uppercase tracking-widest opacity-60">
                              {inboxService.formatTimeAgo(message.timestamp)}
                            </span>
                            <button
                              onClick={(e) => handleDeleteMessage(message.id, e)}
                              className="text-brand-gray hover:text-brand-pink transition-all p-2 rounded-lg hover:bg-brand-pink/5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm leading-relaxed line-clamp-2 ${!message.read ? 'text-brand-sage font-medium opacity-90' : 'text-brand-sage/60'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-24 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-brand-cream/30 rounded-full flex items-center justify-center mb-8 border border-brand-gray">
                      <ShoppingBag className="w-10 h-10 text-brand-gray" />
                    </div>
                    <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Your style bag is currently empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel: Message Detail & Stats */}
          <div className="lg:col-span-1 space-y-10">
            {/* Message Detail Card */}
            <div className="bg-white rounded-[3rem] border border-brand-gray shadow-[0_20px_60px_rgba(137,162,147,0.06)] overflow-hidden lg:sticky lg:top-72 transition-all duration-500 hover:shadow-2xl">
              {selectedMessage ? (
                <div className="p-10 animate-fade-in">
                  <div className="flex items-center gap-5 mb-8 p-6 bg-brand-cream/20 rounded-[2rem] border border-brand-gray/50">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-gray/50">
                      {getMessageIcon(selectedMessage.type)}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-dark leading-tight">
                      {selectedMessage.title}
                    </h3>
                  </div>
                  
                  <p className="text-brand-sage mb-10 font-medium leading-relaxed opacity-90 text-base">{selectedMessage.content}</p>
                  
                  {selectedMessage.products && selectedMessage.products.length > 0 && (
                    <div className="mb-10">
                      <h4 className="text-[10px] font-bold text-brand-sage/60 mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Star className="w-4 h-4 text-brand-pink" />
                        Curated Selection
                      </h4>
                      <div className="space-y-5">
                        {selectedMessage.products.map((product) => (
                          <div key={product.id} className="flex items-center gap-5 p-5 bg-white rounded-[1.5rem] border border-brand-gray/50 hover:border-brand-pink/30 transition-all duration-500 hover:shadow-xl cursor-pointer group">
                            <div className="relative overflow-hidden rounded-2xl w-24 h-24 bg-brand-cream/30">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-brand-dark mb-2 line-clamp-1 group-hover:text-brand-pink transition-colors">{product.title}</h5>
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-brand-dark">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-brand-sage line-through font-medium opacity-60">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] text-brand-sage/40 font-bold uppercase tracking-[0.3em] text-center pt-8 border-t border-brand-gray/50">
                    Received {new Date(selectedMessage.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center min-h-[450px]">
                  <div className="p-8 bg-brand-cream/30 rounded-full w-fit mx-auto mb-8 border border-brand-gray/50">
                    <Bell className="w-14 h-14 text-brand-gray opacity-30" />
                  </div>
                  <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Illuminate a narrative to begin</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-brand-dark rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(30,26,27,0.25)] relative overflow-hidden transition-all duration-500 hover:shadow-black/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/10 blur-[60px] rounded-full -mr-16 -mt-16 animate-pulse"></div>
              <h3 className="text-2xl font-serif font-bold text-white mb-8 flex items-center gap-4 relative z-10">
                <TrendingUp className="w-7 h-7 text-brand-pink" />
                Evolution
              </h3>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Pending Insights</span>
                  <span className="text-sm font-bold text-brand-dark bg-brand-pink px-5 py-1.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    {unreadCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Total Curation</span>
                  <span className="text-base font-bold text-white">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Weekly Growth</span>
                  <span className="text-sm font-bold text-brand-sage bg-brand-sage/10 px-5 py-1.5 rounded-full border border-brand-sage/30">
                    +{messages.filter(m => Date.now() - m.timestamp < 7 * 24 * 60 * 60 * 1000).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardPage;