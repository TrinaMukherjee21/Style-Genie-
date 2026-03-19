import React, { useState } from 'react';
import { Heart, ShoppingBag, ExternalLink, Clock, Users, Star } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useUserContext } from '../../context/UserContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const RecommendationCard = ({ recommendation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { updateCloutScore } = useProfile();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useUserContext();

  const handleLike = () => {
    const isCurrentlyFavorited = isFavorite(recommendation.id);
    
    if (isCurrentlyFavorited) {
      removeFromFavorites(recommendation.id);
      setIsLiked(false);
    } else {
      addToFavorites(recommendation);
      setIsLiked(true);
      updateCloutScore(5);
    }
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    updateCloutScore(10);
    addToCart(recommendation);
    
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const discount = recommendation.originalPrice 
    ? calculateDiscount(recommendation.originalPrice, recommendation.price)
    : null;

  const isItemFavorited = isFavorite(recommendation.id);

  return (
    <div className="card-premium p-6 group animate-card-hover border-2 border-purple-500/30 hover:border-purple-400/60">
      {/* AI Agent Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-3 h-3 bg-green-400 rounded-full  shadow-sm shadow-green-400/50"></div>
        <span className="text-sm text-gray-300 font-medium">StyleGenie AI</span>
        <span className="text-xs  text-white px-3 py-1 rounded-full font-medium ">
          {recommendation.compatibility}
        </span>
        {recommendation.urgency && (
          <span className="text-xs bg-gradient-to-r from-red-500 to-[#d4af37]/5 text-white px-3 py-1 rounded-full  font-medium">
            {recommendation.urgency}
          </span>
        )}
      </div>

      {/* AI Message */}
      <div className="glass-effect rounded-xl p-4 mb-4 border-l-4 border-purple-500/80 shadow-sm">
        <p className="text-gray-200 font-medium leading-relaxed">
          {typeof recommendation.aiMessage === 'string' 
            ? recommendation.aiMessage 
            : String(recommendation.aiMessage || 'AI recommendation message')
          }
        </p>
      </div>

      {/* Product Info */}
      <div className="flex gap-4 mb-4">
        <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
          <img 
            src={recommendation.image}
            alt={recommendation.title}
            className="w-24 h-24 object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=400&fit=crop&auto=format&q=80';
            }}
          />
          {discount && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-[#d4af37]/5 text-white text-xs px-2 py-1 rounded-full font-bold ">
              -{discount}%
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
            {recommendation.title}
          </h3>
          
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-brand-gold font-bold text-xl">
              {formatPrice(recommendation.price)}
            </span>
            {recommendation.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(recommendation.originalPrice)}
              </span>
            )}
          </div>

          {/* Product Description */}
          {recommendation.description && (
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">
              {recommendation.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {recommendation.tags?.map((tag) => (
              <span 
                key={tag}
                className="text-xs bg-brand-dark text-gray-300 px-2 py-1 rounded-full hover: hover:text-white transition-all cursor-pointer border border-purple-500/30 hover:border-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Social Proof */}
          {recommendation.socialProof && (
            <div className="flex items-center text-xs text-gray-400 mb-2">
              <Users className="w-3 h-3 mr-1 text-brand-gold " />
              <span>{recommendation.socialProof}</span>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center text-xs">
            {recommendation.inStock ? (
              <span className="text-brand-gold opacity-50 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1  shadow-sm shadow-green-400/50"></div>
                In Stock
              </span>
            ) : (
              <span className="text-red-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Back in 2-3 days
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button 
          onClick={handleAddToCart}
          disabled={isAddedToCart}
          className={`flex-1 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border-2 ${
            isAddedToCart 
              ? 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-emerald-500 text-white border-green-500 shadow-lg shadow-green-500/30' 
              : 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 text-white border-purple-500 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isAddedToCart ? 'Added!' : 'Add to Cart'}</span>
        </button>
        
        <button 
          onClick={handleLike}
          className="px-3 py-3 glass-effect hover:bg-brand-dark rounded-xl transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${
            isFavorite(recommendation.id)
              ? 'fill-current text-red-500 scale-110 ' 
              : 'text-gray-400 hover:text-red-400'
          }`} />
        </button>

        <button 
          onClick={() => {
            const shareData = {
              title: recommendation.title,
              text: `Check out this ${recommendation.title} - ${recommendation.description || 'Perfect for your style'}!`,
              url: window.location.href
            };
            
            if (navigator.share) {
              navigator.share(shareData).catch(console.error);
            } else {
              const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
              if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => {
                  alert('Product link copied to clipboard!');
                }).catch(() => {
                  prompt('Copy this link to share:', shareText);
                });
              } else {
                prompt('Copy this link to share:', shareText);
              }
            }
          }}
          className="px-3 py-3 glass-effect hover:bg-brand-dark rounded-xl transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
          title="Share this product"
        >
          <ExternalLink className="w-5 h-5 text-gray-400 hover:text-brand-gold transition-colors duration-300" />
        </button>
      </div>

      {/* Additional Info */}
      {recommendation.note && (
        <div className="mt-4 glass-effect border-2 border-cyan-500/30 rounded-xl p-3">
          <p className="text-brand-gold text-xs flex items-center">
            <Star className="w-4 h-4 mr-2 " />
            {recommendation.note}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;