import { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, Sparkles } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartItemCount } = useUserContext();
  
  const updateQuantity = (productId, change) => {
    const currentItem = cart.find(item => item.id === productId);
    if (currentItem) {
      const newQuantity = Math.max(1, currentItem.quantity + change);
      updateCartQuantity(productId, newQuantity);
    }
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
  };

  const getItemPrice = (item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
    return isNaN(price) ? 0 : price;
  };

  const total = cart.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-cream border border-brand-pink/30 rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-8 h-8 text-brand-pink" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
              Shopping <span className="text-brand-pink italic">Bag</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="bg-brand-cream border border-brand-gray px-6 py-2 rounded-full">
              <span className="text-brand-sage font-bold text-xs uppercase tracking-widest">{getCartItemCount()} Items Curated</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-brand-pink hover:text-brand-dark transition-colors font-bold text-xs uppercase tracking-widest"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-brand-cream/30 border border-brand-gray p-16 max-w-lg mx-auto rounded-[3rem]">
              <div className="w-24 h-24 bg-white border border-brand-gray rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-brand-pink/30" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">Your bag is awaiting inspiration</h3>
              <p className="text-brand-sage font-medium mb-10 opacity-80 uppercase tracking-widest text-[10px]">Discover pieces that define your silhouette</p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="bg-brand-dark text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto hover:bg-brand-black hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <Sparkles className="w-5 h-5 text-brand-pink" />
                Explore Collections
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white border border-brand-gray/50 rounded-[2rem] p-6 hover:shadow-[0_20px_50px_rgba(137,162,147,0.1)] transition-all group">
                  <div className="flex gap-6 md:gap-8">
                    <div className="w-28 h-36 md:w-32 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden border border-brand-gray bg-brand-cream/30">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-brand-pink/20" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif font-bold text-brand-dark text-lg md:text-xl truncate pr-4">{item.title}</h3>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="p-2 text-brand-sage hover:text-brand-pink transition-all bg-brand-cream/50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-brand-dark mb-4">${getItemPrice(item).toFixed(2)}</p>
                      <p className="text-brand-sage text-xs font-medium line-clamp-2 mb-6 leading-relaxed opacity-70 uppercase tracking-widest">{item.description || 'Exclusive StyleGenie Collection'}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-brand-cream/50 rounded-2xl border border-brand-gray/50 p-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="p-2 text-brand-sage hover:text-brand-dark transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-brand-dark font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="p-2 text-brand-sage hover:text-brand-dark transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[10px] text-brand-sage font-bold uppercase tracking-widest opacity-60 mb-1">Subtotal</p>
                          <p className="text-xl font-bold text-brand-dark">${(getItemPrice(item) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="bg-brand-cream/30 border border-brand-gray rounded-[2.5rem] p-8 h-fit lg:sticky lg:top-24">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-brand-pink" />
                Order Summary
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-sage">
                  <span>Subtotal ({getCartItemCount()} items)</span>
                  <span className="text-brand-dark text-sm">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-sage">
                  <span>Standard Shipping</span>
                  <span className="text-brand-pink">Complimentary</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-sage">
                  <span>Estimated Tax</span>
                  <span className="text-brand-dark text-sm">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-brand-gray/50 pt-8 flex justify-between items-center">
                  <span className="text-lg font-serif font-bold text-brand-dark">Grand Total</span>
                  <span className="text-3xl font-bold text-brand-dark">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-black transition-all flex items-center justify-center gap-3 mb-6 shadow-xl hover:-translate-y-1">
                <CreditCard className="w-5 h-5 text-brand-pink" />
                Proceed to Checkout
              </button>
              
              <p className="text-[10px] text-brand-sage font-medium text-center uppercase tracking-widest opacity-60">Secure checkout & styling support included</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;