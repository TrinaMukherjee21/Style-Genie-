import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, Heart, TrendingUp, Clock, Star, Gift, Zap, Sparkles } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { inboxService } from '../services/inboxService';

const EnhancedDashboardPage = () => {
  const { user, userProfile } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize inbox service with user profile
    if (user || userProfile) {
      inboxService.initialize(userProfile || user);
      
      // Set up listener for real-time updates
      const handleUpdate = (newMessages, newUnreadCount) => {
        setMessages(newMessages);
        setUnreadCount(newUnreadCount);
        setIsLoading(false);
      };

      inboxService.addListener(handleUpdate);
      
      // Get initial messages
      setMessages(inboxService.getMessages());
      setUnreadCount(inboxService.getUnreadCount());
      setIsLoading(false);

      return () => {
        inboxService.removeListener(handleUpdate);
      };
    }
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
      welcome: <Gift className="w-5 h-5 text-brand-gold" />,
      new_arrivals: <Star className="w-5 h-5 text-brand-gold" />,
      flash_sale: <Zap className="w-5 h-5 text-brand-goldLight" />,
      trend_alert: <TrendingUp className="w-5 h-5 text-brand-gold" />,
      personalized: <Heart className="w-5 h-5 text-brand-goldLight" />,
      seasonal: <Clock className="w-5 h-5 text-brand-gold" />,
      restock: <ShoppingBag className="w-5 h-5 text-brand-gold" />,
      inspiration: <Sparkles className="w-5 h-5 text-brand-gold" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-gray-400" />;
  };

  const getMessagePriorityStyle = (priority) => {
    return priority === 'high' 
      ? 'message-high-priority' 
      : '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-glow mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-16">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#120D20]"></div>
      
      {/* Header */}
      <div className="relative bg-dark-card/90 backdrop-blur-xl border-b border-dark-border shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-light text-white mb-2">
                Welcome back, <span className="text-brand-gold font-semibold">{user?.name || user?.firstName || 'Fashionista'}</span>! ✨
              </h1>
              <p className="text-gray-300 font-body">Your personalized style updates are here</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative p-3 bg-dark-card rounded-full border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <Bell className="w-6 h-6 text-brand-gold" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#eacc6e]/20 border border-[#eacc6e]/20 to-[#eacc6e]/5 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center  font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <div className="p-6 border-b border-dark-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-brand-gold" />
                    Style Inbox
                  </h2>
                  <span className="text-sm text-gray-200 bg-brand-dark/80 px-3 py-1 rounded-full border border-brand-gold/30 font-medium">
                    {messages.length} messages
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-dark-border max-h-96 overflow-y-auto overflow-x-hidden px-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 hover:bg-dark-card/50 cursor-pointer transition-all duration-300 animate-fade-in-up ${
                      !message.read ? 'message-unread' : ''
                    } ${getMessagePriorityStyle(message.priority)} hover:transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 p-2 bg-dark-card rounded-lg border border-purple-500/20">
                        {getMessageIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium font-body ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                            {message.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 bg-dark-card px-2 py-1 rounded-full">
                              {inboxService.formatTimeAgo(message.timestamp)}
                            </span>
                            <button
                              onClick={(e) => handleDeleteMessage(message.id, e)}
                              className="text-gray-400 hover:text-brand-goldLight transition-colors p-1 hover:bg-dark-card rounded"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 font-body ${!message.read ? 'text-gray-200' : 'text-gray-400'}`}>
                          {message.content}
                        </p>
                        {!message.read && (
                          <div className="w-2 h-2 bg-purple-glow rounded-full mt-2 "></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            <div className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-dark-card rounded-lg border border-purple-500/20">
                    {getMessageIcon(selectedMessage.type)}
                    <h3 className="text-lg font-heading font-semibold text-white">
                      {selectedMessage.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 font-body leading-relaxed">{selectedMessage.content}</p>
                  
                  <div className="text-xs text-gray-400 mb-6 bg-dark-card px-3 py-2 rounded-lg border border-purple-500/10">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </div>

                  {selectedMessage.products && selectedMessage.products.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-brand-gold" />
                        Featured Items
                      </h4>
                      <div className="space-y-3">
                        {selectedMessage.products.map((product) => (
                          <div key={product.id} className="flex items-center gap-3 p-3 bg-dark-card rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-[1.02]">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg border border-purple-500/20"
                            />
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-white font-body">{product.title}</h5>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-brand-gold">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">
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
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <div className="p-4 bg-dark-card rounded-full w-fit mx-auto mb-4 border border-purple-500/20">
                    <Bell className="w-12 h-12 text-brand-gold" />
                  </div>
                  <p className="font-body">Select a message to view details</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
                Your Style Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg border border-purple-500/10">
                  <span className="text-sm text-gray-300 font-body">New Messages</span>
                  <span className="text-sm font-semibold text-brand-gold bg-purple-500/20 px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg border border-purple-500/10">
                  <span className="text-sm text-gray-300 font-body">Total Messages</span>
                  <span className="text-sm font-semibold text-white">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg border border-purple-500/10">
                  <span className="text-sm text-gray-300 font-body">This Week</span>
                  <span className="text-sm font-semibold text-brand-gold bg-green-500/20 px-2 py-1 rounded-full">
                    {messages.filter(m => Date.now() - m.timestamp < 7 * 24 * 60 * 60 * 1000).length}
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