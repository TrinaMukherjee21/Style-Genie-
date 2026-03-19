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
      className={`card-premium p-6 group animate-card-hover border-2 cursor-pointer ${getPriorityStyle()} ${
        !message.read ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20' : 'opacity-80'
      } ${isClickProcessing ? 'pointer-events-none opacity-60' : 'hover:shadow-xl hover:shadow-purple-500/10'}`}
      onClick={(e) => handleMarkRead(e)}
    >
      {/* Message Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full  shadow-sm shadow-green-400/20"></div>
          <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
            {getMessageIcon()}
            StyleGenie AI
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getTimestamp()}
          </span>
          {!message.read && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {message.priority === 'high' && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium ">
              Urgent
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleStar}
            disabled={isProcessing}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isProcessing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-brand-dark hover:scale-110'
            }`}
            title={message.starred ? 'Remove from starred' : 'Add to starred'}
          >
            <Star className={`w-4 h-4 transition-all duration-300 ${
              message.starred
                ? 'fill-current text-yellow-400 drop-shadow-lg' 
                : 'text-gray-400 hover:text-yellow-400'
            } ${isProcessing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Message Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
          {message.title}
        </h3>
      </div>

      {/* AI Message */}
      <div className="bg-brand-navy/60 backdrop-blur-md rounded-xl p-4 mb-4 border-l-4 border-purple-500/80 shadow-inner">
        <p className="text-white font-medium leading-relaxed">
          {(() => {
            const content = message.ai_message || message.content;
            if (typeof content === 'string') {
              return content;
            } else if (typeof content === 'object' && content !== null) {
              return `[Object: ${Object.keys(content).join(', ')}]`;
            } else {
              return String(content || 'No message content');
            }
          })()}
        </p>
      </div>

      {/* Product Info (for recommendation messages) */}
      {message.message_type === 'recommendation' && message.product_data && (
        <div className="flex gap-4 mb-4">
          <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
            <img 
              src={message.product_data.image || getProductImage(message.product_data)}
              alt={message.product_data.title}
              className="w-24 h-24 object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = getProductImage(message.product_data);
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
              {message.product_data.title}
            </h4>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-brand-gold font-bold text-xl">
                {message.product_data.price}
              </span>
              {message.metadata?.compatibility_score && (
                <span className="text-xs  text-white px-3 py-1 rounded-full font-medium ">
                  {Math.round(message.metadata.compatibility_score * 100)}% match
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {(message.tags || []).slice(0, 4).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-gradient-to-r hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 hover:text-white transition-all cursor-pointer"
                  title={`Filter by ${tag}`}
                >
                  #{tag.replace('_', ' ')}
                </span>
              ))}
              {(message.tags || []).length > 4 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{(message.tags || []).length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metadata Display */}
      {message.metadata && (
        <div className="mb-4">
          {message.metadata.aesthetic_match && (
            <div className="flex items-center text-xs text-gray-400 mb-1">
              <span>Style Match: </span>
              <span className="text-brand-gold opacity-50 ml-1 capitalize">{message.metadata.aesthetic_match}</span>
            </div>
          )}
          {message.metadata.recommendation_reason && (
            <div className="text-xs text-gray-300 italic">
              "{message.metadata.recommendation_reason}"
            </div>
          )}
        </div>
      )}

      {/* Action Buttons (for product recommendations) */}
      {message.message_type === 'recommendation' && message.product_data && (
        <div className="flex space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="flex-1 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border-2 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 text-white border-purple-500 hover:shadow-md hover:shadow-purple-500/15 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToFavorites();
            }}
            className="px-3 py-3 glass-effect hover:bg-brand-dark rounded-xl transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
          >
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-400" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Handle sharing
            }}
            className="px-3 py-3 glass-effect hover:bg-brand-dark rounded-xl transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
            title="Share this product"
          >
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-brand-gold transition-colors duration-300" />
          </button>
        </div>
      )}

      {/* Collection Preview (for collection messages) */}
      {message.message_type === 'collection' && message.metadata?.products && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {message.metadata.products.map((product, index) => (
            <div key={index} className="flex-shrink-0">
              <img 
                src={product.image || getProductImage(product)}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          ))}
          {message.metadata.item_count > 3 && (
            <div className="flex-shrink-0 w-16 h-16 bg-brand-dark rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">+{message.metadata.item_count - 3}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InboxMessageCard;