import { Heart, ShoppingBag, Trash2, Star, Sparkles } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const WishlistPage = () => {
  const { favorites, removeFromFavorites, addToCart, cart } = useUserContext();
  
  const removeFromWishlist = (productId) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-brand-navy pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#120D20]"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-brand-goldLight" />
            <h1 className="text-4xl font-heading font-bold text-white">
              My <span className="text-shimmer">Wishlist</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] border border-purple-500/30 px-4 py-2 rounded-full">
              <span className="text-brand-gold font-semibold">{favorites.length} items</span>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-premium p-12 max-w-md mx-auto border border-purple-500/20">
              <div className="w-20 h-20 bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-brand-goldLight" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-3">Your wishlist is empty</h3>
              <p className="text-gray-400 mb-6 font-body">Start adding items you love to see them here!</p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="btn-primary px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Discover Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-x-hidden px-1">
            {favorites.map(item => (
              <div key={item.id} className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-brand-gold" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-500 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-white mb-2 text-lg">{item.title}</h3>
                  <p className="text-2xl font-bold text-brand-gold mb-3">
                    {typeof item.price === 'string' ? item.price : `$${item.price}`}
                  </p>
                  <p className="text-gray-400 text-sm mb-6 font-body leading-relaxed">{item.description}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-3 rounded-xl font-medium hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cart.find(cartItem => cartItem.id === item.id) ? 'Add More to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;