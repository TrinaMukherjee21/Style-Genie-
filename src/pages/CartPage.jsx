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
    <div className="min-h-screen bg-brand-navy pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#120D20]"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-brand-gold" />
            <h1 className="text-4xl font-heading font-bold text-white">
              Shopping <span className="text-shimmer">Cart</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] border border-purple-500/30 px-4 py-2 rounded-full">
              <span className="text-brand-gold font-semibold">{getCartItemCount()} items</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-premium p-12 max-w-md mx-auto border border-purple-500/20">
              <div className="w-20 h-20 bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-brand-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-3">Your cart is empty</h3>
              <p className="text-gray-400 mb-6 font-body">Add some amazing items to get started!</p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="btn-primary px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Shop Now
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 overflow-x-hidden px-1">
              {cart.map(item => (
                <div key={item.id} className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-purple-500/20">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-brand-gold" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-white text-lg mb-2">{item.title}</h3>
                      <p className="text-2xl font-bold text-brand-gold mb-2">
                        ${getItemPrice(item).toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm font-body">{item.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4">
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-3 bg-dark-card rounded-lg border border-purple-500/20 p-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Subtotal</p>
                        <p className="text-lg font-bold text-white">
                          ${(getItemPrice(item) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6 h-fit">
              <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span className="font-body">Subtotal ({getCartItemCount()} items)</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="font-body">Shipping</span>
                  <span className="font-semibold text-brand-gold opacity-50">Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="font-body">Tax</span>
                  <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-500/20 pt-4 flex justify-between text-white">
                  <span className="text-lg font-heading font-semibold">Total</span>
                  <span className="text-2xl font-bold text-brand-gold">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-4 rounded-xl font-heading font-semibold text-lg hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-gray-400 text-center font-body">
                Secure checkout powered by StyleGenie
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;