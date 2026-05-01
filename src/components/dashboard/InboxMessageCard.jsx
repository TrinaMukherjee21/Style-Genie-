import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Clock, TrendingUp, Gift, Sparkles, ExternalLink } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { formatPrice } from '../../utils/helpers';

const InboxMessageCard = ({ message, onMarkRead, onStar }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClickProcessing, setIsClickProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const context = useUserContext();
  console.log("InboxMessageCard context keys:", Object.keys(context));
  const { addToCart, addToFavorites } = context;

  const handleMarkRead = async (e) => {
    if (e) e.stopPropagation();
    if (!message.read && !isClickProcessing) {
      setIsClickProcessing(true);
      await onMarkRead(message._id);
      setTimeout(() => setIsClickProcessing(false), 100);
    }
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);
    await onStar(message._id, !message.starred);
    setTimeout(() => setIsProcessing(false), 100);
  };

  const handleAddToCart = () => {
    if (message.product_data) {
      addToCart({
        id: message._id,
        title: message.product_data.title,
        price: message.product_data.price,
        image: message.product_data.image || getProductImage(message.product_data),
        ...message.product_data
      });
    }
  };

  const handleAddToFavorites = () => {
    if (message.product_data) {
      addToFavorites({
        id: message._id,
        title: message.product_data.title,
        price: message.product_data.price,
        image: message.product_data.image || getProductImage(message.product_data),
        ...message.product_data
      });
    }
  };

  const getProductImage = (product) => {
    const category = product?.category?.toLowerCase() || 'clothing';
    const imageMap = {
      'tops': 'photo-1571945153237-4929e783af4a',
      'bottoms': 'photo-1594633312681-425c7b97ccd1', 
      'dresses': 'photo-1595777457583-95e059d581b8',
      'outerwear': 'photo-1551028719-00167b16eac5',
      'shoes': 'photo-1549298916-b41d501d3772',
      'accessories': 'photo-1553062407-98eeb64c6a62',
      'default': 'photo-1556905055-8f358a7a47b2'
    };
    const imageId = imageMap[category] || imageMap['default'];
    return `https://images.unsplash.com/${imageId}?w=300&h=400&fit=crop&auto=format&q=80`;
  };

  const getMessageIcon = () => {
    switch (message.message_type || message.type) {
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'trend_alert':
        return <TrendingUp className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'restock':
        return <Gift className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'collection':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'daily_update':
        return <Sparkles className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'style_tip':
        return <Star className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'color_inspiration':
        return <TrendingUp className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'style_challenge':
        return <Gift className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'seasonal_recommendation':
        return <Star className="w-4 h-4 text-brand-gold opacity-50" />;
      case 'mood_inspiration':
        return <Heart className="w-4 h-4 text-brand-gold opacity-50" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-gold opacity-50" />;
    }
  };

  const getTimestamp = () => {
    const date = new Date(message.created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityStyle = () => {
    switch (message.priority) {
      case 'high':
        return 'border-red-500/50 bg-red-500/10';
      case 'normal':
        return 'border-purple-500/30 bg-brand-dark/50';
      default:
        return 'border-purple-500/30 bg-brand-dark/50';
    }
  };

  return (
    <div
      className={`bg-white p-10 rounded-[2.5rem] border border-brand-gray shadow-xl group transition-all duration-700 cursor-pointer relative overflow-hidden ${
        !message.read ? 'border-brand-pink/30 shadow-brand-pink/5' : 'opacity-90'
      } ${isClickProcessing ? 'pointer-events-none opacity-60' : 'hover:shadow-2xl hover:-translate-y-1'}`}
      onClick={(e) => handleMarkRead(e)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Element */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full transition-all duration-1000 ${isHovered ? 'scale-150' : 'scale-100'}`}></div>

      {/* Message Header */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${!message.read ? 'bg-brand-pink animate-pulse' : 'bg-brand-sage opacity-30'}`}></div>
            <span className="text-[10px] font-black text-brand-dark uppercase tracking-[0.3em]">
              The Atelier Muse
            </span>
          </div>
          <div className="h-4 w-[1px] bg-brand-gray"></div>
          <span className="text-[9px] text-brand-sage font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {getTimestamp()}
          </span>
          {message.priority === 'high' && (
            <span className="text-[9px] text-brand-pink font-black uppercase tracking-[0.2em] bg-brand-pink/5 px-3 py-1 rounded-full border border-brand-pink/10">
              Priority
            </span>
          )}
        </div>
        
        <button
          onClick={handleStar}
          disabled={isProcessing}
          className={`p-3 rounded-xl transition-all duration-500 ${
            message.starred ? 'bg-brand-pink/10 text-brand-pink' : 'text-brand-sage hover:bg-brand-cream'
          }`}
        >
          <Star className={`w-4 h-4 ${message.starred ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Message Content Area */}
      <div className="relative z-10">
        <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6 group-hover:text-brand-pink transition-colors duration-500">
          {message.title}
        </h3>

        {/* AI Insight Box */}
        <div className="bg-brand-cream/40 rounded-[2rem] p-8 border border-brand-gray/30 mb-8 relative group/insight transition-all duration-500 hover:border-brand-pink/20">
          <div className="absolute top-6 left-6 text-brand-pink/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-brand-dark font-medium leading-relaxed text-base italic relative z-10 pl-10">
            {(() => {
              const content = message.ai_message || message.content;
              return typeof content === 'string' ? content : String(content || 'Curating your next narrative...');
            })()}
          </p>
        </div>

        {/* Product Integration */}
        {message.message_type === 'recommendation' && message.product_data && (
          <div className="flex gap-8 items-center p-8 bg-white rounded-[2rem] border border-brand-gray/50 hover:border-brand-pink/30 transition-all duration-500 hover:shadow-xl group/prod">
            <div className="relative overflow-hidden rounded-2xl w-32 h-32 bg-brand-cream/30">
              <img 
                src={message.product_data.image || getProductImage(message.product_data)}
                alt={message.product_data.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/prod:scale-110"
                onError={(e) => { e.target.src = getProductImage(message.product_data); }}
              />
              <div className="absolute inset-0 bg-brand-dark/5 group-hover/prod:bg-transparent transition-colors duration-500"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-serif font-bold text-brand-dark group-hover/prod:text-brand-pink transition-colors">
                  {message.product_data.title}
                </h4>
                {message.metadata?.compatibility_score && (
                  <span className="text-[9px] font-black text-brand-pink uppercase tracking-[0.2em] px-3 py-1 bg-brand-pink/5 rounded-full border border-brand-pink/10">
                    {Math.round(message.metadata.compatibility_score * 100)}% Match
                  </span>
                )}
              </div>
              
              <div className="text-xl font-bold text-brand-dark mb-6">
                ${message.product_data.price}
              </div>

              {/* Interaction Row */}
              <div className="flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                  className="bg-brand-dark text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-brand-pink transition-all duration-500 flex items-center gap-3 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Acquire
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddToFavorites(); }}
                  className="p-3 bg-brand-cream text-brand-sage rounded-xl hover:text-brand-pink transition-all duration-500 border border-brand-gray"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Narrative Footer */}
      <div className="mt-8 pt-8 border-t border-brand-gray/50 flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          {(message.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="text-[8px] font-black text-brand-sage uppercase tracking-[0.2em] bg-brand-cream/50 px-3 py-1 rounded-full">
              #{tag.replace('_', ' ')}
            </span>
          ))}
        </div>
        {message.metadata?.recommendation_reason && (
          <div className="text-[9px] text-brand-sage font-bold uppercase tracking-widest opacity-40">
            {message.metadata.recommendation_reason}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxMessageCard;