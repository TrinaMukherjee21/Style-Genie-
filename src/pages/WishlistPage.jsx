import { Heart, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="relative max-w-6xl mx-auto py-12 z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="w-20 h-20 bg-brand-cream border border-brand-pink/20 rounded-[2rem] flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 bg-brand-pink/10 rounded-[2rem] animate-ping opacity-20"></div>
              <Heart className="w-10 h-10 text-brand-pink group-hover:scale-125 transition-transform duration-700" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark tracking-tight leading-tight">
              My <span className="text-brand-pink italic">Wishlist</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-brand-cream/50 backdrop-blur-md border border-brand-gray/50 px-8 py-3 rounded-full shadow-sm">
              <span className="text-brand-sage font-black text-[10px] uppercase tracking-[0.3em] opacity-60">{favorites.length} Items Saved</span>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="bg-white/50 backdrop-blur-md border border-brand-gray/50 p-16 md:p-24 max-w-2xl mx-auto rounded-[4rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-pink/5 blur-3xl rounded-full"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-brand-cream border border-brand-gray/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <Heart className="w-12 h-12 text-brand-pink/30" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-brand-dark mb-6">Your wishlist is curated yet empty</h3>
                <p className="text-brand-sage font-bold mb-16 opacity-60 uppercase tracking-[0.3em] text-[10px] leading-relaxed">Start building your dream wardrobe today</p>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="bg-brand-dark text-white px-16 py-6 rounded-2xl font-bold flex items-center justify-center gap-4 mx-auto hover:bg-brand-black hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 uppercase tracking-[0.2em] text-xs"
                >
                  <Sparkles className="w-5 h-5 text-brand-pink" />
                  Explore Collections
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 md:gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(item => (
              <div key={item.id} className="bg-white rounded-[3.5rem] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.04)] overflow-hidden group hover:-translate-y-4 transition-all duration-700 hover:border-brand-pink/30 hover:shadow-[0_40px_80px_rgba(137,162,147,0.12)]">
                <div className="relative aspect-[3/4.5]">
                  <div className="w-full h-full overflow-hidden bg-brand-cream/20">
                    <img 
                      src={item.image_url || item.image} 
                      alt={item.name || item.title} 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                    />
                  </div>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-8 right-8 p-4 bg-white/95 backdrop-blur-md text-brand-sage rounded-full hover:bg-red-500 hover:text-white transition-all duration-500 shadow-2xl z-10 border border-brand-gray/50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-10 flex flex-col h-full">
                  <div className="mb-10">
                    <span className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em] mb-4 block opacity-80">{item.source || 'Boutique Collection'}</span>
                    <h3 className="font-serif font-bold text-brand-dark mb-4 text-2xl line-clamp-1 group-hover:text-brand-pink transition-colors duration-500 leading-tight">{item.name || item.title}</h3>
                    <p className="text-2xl font-bold text-brand-dark tracking-tighter">
                      {typeof item.price === 'string' ? item.price : `$${item.price}`}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-5 mt-auto">
                    {item.buy_link && item.buy_link !== '#' && (
                        <a 
                          href={item.buy_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-brand-cream/50 text-brand-sage py-5 rounded-2xl font-bold hover:bg-brand-pink hover:text-white transition-all duration-500 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] border border-brand-pink/10 shadow-sm"
                        >
                          <Sparkles className="w-4 h-4" />
                          View Original Store
                        </a>
                    )}
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold hover:bg-brand-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em]"
                    >
                      <ShoppingBag className="w-5 h-5 text-brand-pink" />
                      {cart.find(cartItem => cartItem.id === item.id) ? 'Added to Selection' : 'Move to Bag'}
                    </button>
                  </div>
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