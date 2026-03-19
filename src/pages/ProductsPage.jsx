import { useState } from 'react';
import { Heart, ShoppingCart, Filter, Search, Star, Check, X } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const ProductsPage = () => {
  const { addToFavorites, addToCart, isFavorite, removeFromFavorites, cart } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedToCart, setAddedToCart] = useState({});
  const [addedToFavorites, setAddedToFavorites] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const [products] = useState([
    {
      id: "prod1",
      title: "Oversized Vintage Tee",
      price: "$29.99",
      description: "Soft cotton vintage-inspired t-shirt perfect for effortless style",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format&q=80",
      category: "tops",
      style: "casual",
      rating: 4.5,
      reviews: 128,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray'],
      material: '100% Cotton',
      care: 'Machine wash cold'
    },
    {
      id: "prod2",
      title: "High-Waisted Mom Jeans",
      price: "$59.99",
      description: "Comfortable high-rise denim with a flattering fit",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop&auto=format&q=80",
      category: "bottoms",
      style: "casual",
      rating: 4.8,
      reviews: 256,
      sizes: ['24', '26', '28', '30', '32'],
      colors: ['Light Blue', 'Dark Blue', 'Black'],
      material: '98% Cotton, 2% Elastane',
      care: 'Machine wash cold, hang dry'
    },
    {
      id: "prod3",
      title: "Tailored Blazer",
      price: "$129.99",
      description: "Classic fitted blazer for professional elegance",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&auto=format&q=80",
      category: "outerwear",
      style: "formal",
      rating: 4.7,
      reviews: 89,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Navy', 'Black', 'Gray'],
      material: 'Wool blend',
      care: 'Dry clean only'
    },
    {
      id: "prod4",
      title: "Silk Midi Dress",
      price: "$159.99",
      description: "Elegant silk dress perfect for important occasions",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&auto=format&q=80",
      category: "dresses",
      style: "formal",
      rating: 4.9,
      reviews: 167,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Burgundy'],
      material: '100% Silk',
      care: 'Dry clean recommended'
    },
    {
      id: "prod5",
      title: "Sequin Mini Dress",
      price: "$99.99",
      description: "Show-stopping sequin dress that catches every light",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&auto=format&q=80",
      category: "dresses",
      style: "party",
      rating: 4.6,
      reviews: 203,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Gold', 'Silver', 'Rose Gold'],
      material: 'Polyester with sequins',
      care: 'Hand wash cold'
    },
    {
      id: "prod6",
      title: "Cozy Knit Sweater",
      price: "$45.99",
      description: "Soft oversized knit perfect for layering",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format&q=80",
      category: "tops",
      style: "casual",
      rating: 4.4,
      reviews: 145,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Cream', 'Beige', 'Brown'],
      material: 'Acrylic blend',
      care: 'Machine wash gentle'
    },
    {
      id: "prod7",
      title: "Classic Blue Denim Jeans",
      price: "$75.99",
      description: "Perfect medium wash blue jeans for any occasion",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format&q=80",
      category: "bottoms",
      style: "casual",
      rating: 4.7,
      reviews: 312,
      sizes: ['26', '28', '30', '32', '34'],
      colors: ['Medium Blue', 'Dark Blue'],
      material: '100% Cotton denim',
      care: 'Machine wash cold'
    },
    {
      id: "prod8",
      title: "Elegant Black Bodycon Dress",
      price: "$89.99",
      description: "Sophisticated dress perfect for special occasions",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format&q=80",
      category: "dresses",
      style: "elegant",
      rating: 4.8,
      reviews: 189,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Wine'],
      material: 'Stretch jersey',
      care: 'Machine wash cold'
    }
  ]);

  const categories = ['all', 'tops', 'bottoms', 'dresses', 'outerwear'];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCartClick = (product) => {
    try {
      addToCart(product);
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      
      // Reset the "Added" state after 2 seconds
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleFavoriteClick = (product) => {
    try {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
        setAddedToFavorites(prev => ({ ...prev, [product.id]: false }));
      } else {
        addToFavorites(product);
        setAddedToFavorites(prev => ({ ...prev, [product.id]: true }));
        
        // Reset the feedback state after 1 second
        setTimeout(() => {
          setAddedToFavorites(prev => ({ ...prev, [product.id]: false }));
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedColor(product.colors?.[0] || '');
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleAddToCartFromModal = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const productWithOptions = {
      ...selectedProduct,
      selectedSize,
      selectedColor,
      uniqueId: `${selectedProduct.id}_${selectedSize}_${selectedColor}`
    };
    
    addToCart(productWithOptions);
    setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: true }));
    
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: false }));
    }, 2000);
    
    closeProductModal();
  };

  return (
    <div className="min-h-screen bg-brand-navy pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#120D20]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            <span className="text-shimmer">Fashion Collection</span>
          </h1>
          <p className="text-gray-300 font-body text-lg">Discover amazing fashion pieces curated just for you</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-card border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white'
                    : 'bg-dark-card text-gray-300 hover:text-white border border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-hidden px-1">
          {filteredProducts.map(product => (
            <div key={product.id} className="card-premium border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="relative overflow-hidden cursor-pointer" onClick={() => openProductModal(product)}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleFavoriteClick(product)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isFavorite(product.id)
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/20 text-white hover:bg-pink-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">{product.rating} ({product.reviews})</span>
                </div>
                
                <h3 className="text-lg font-heading font-semibold text-white mb-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => openProductModal(product)}>{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 font-body">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-brand-gold">{product.price}</span>
                  <button
                    onClick={() => handleCartClick(product)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                      addedToCart[product.id] 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 text-white'
                    }`}
                  >
                    {addedToCart[product.id] ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
            <div className="relative">
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-10 bg-brand-navy/80 rounded-full p-2 hover:bg-brand-navy transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title}
                className="w-full h-80 object-cover rounded-t-2xl"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedProduct.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-brand-gold">{selectedProduct.price}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Color</h4>
                  <div className="flex gap-2">
                    {selectedProduct.colors?.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedColor === color
                            ? 'bg-purple-600 text-white'
                            : 'bg-brand-navy text-gray-300 hover:bg-purple-600/20'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Size *</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedProduct.sizes?.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all border ${
                          selectedSize === size
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-brand-navy text-gray-300 border-gray-600 hover:border-purple-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Material</h4>
                  <p className="text-gray-300">{selectedProduct.material}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Care Instructions</h4>
                  <p className="text-gray-300">{selectedProduct.care}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => handleFavoriteClick(selectedProduct)}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium border ${
                    isFavorite(selectedProduct.id)
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-brand-navy text-gray-300 border-gray-600 hover:border-pink-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(selectedProduct.id) ? 'fill-current' : ''}`} />
                  {isFavorite(selectedProduct.id) ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button 
                  onClick={handleAddToCartFromModal}
                  className="flex-1 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 text-white py-3 px-6 rounded-xl hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;