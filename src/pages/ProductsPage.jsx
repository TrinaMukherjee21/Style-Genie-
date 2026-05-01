import React, { useState, useEffect, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, Search, Star, Check, X, ArrowRight, RefreshCcw, ChevronDown, Sparkles } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import FilterSidebar from '../components/products/FilterSidebar';
import { useSearchParams, useNavigate } from 'react-router-dom';

import API_BASE_URL from '../config';

const DEFAULT_PRODUCTS = [
  {
    id: "dp_1",
    name: "Classic White Linen Button-Down Shirt",
    description: "A breezy, minimalist white linen shirt perfect for casual outings and a refined aesthetic.",
    price: "₹1,499",
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    category: "tops",
    buy_link: "#",
    source: "H&M",
    rating: 4.8,
    reviews: 124,
    isNearby: false,
    distance: null
  },
  {
    id: "dp_2",
    name: "Beige Wide-Leg Trousers",
    description: "Flowy, high-waisted beige trousers. Essential for creating proportion in modern minimalist looks.",
    price: "₹2,199",
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    category: "bottoms",
    buy_link: "#",
    source: "Zara",
    rating: 4.6,
    reviews: 89,
    isNearby: true,
    distance: "5 km"
  },
  {
    id: "dp_3",
    name: "Minimalist Leather Crossbody Bag",
    description: "Sleek and structured leather bag for everyday essentials. Tan variant.",
    price: "₹3,450",
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    category: "accessories",
    buy_link: "#",
    source: "Marks & Spencer",
    rating: 4.9,
    reviews: 212,
    isNearby: false,
    distance: null
  },
  {
    id: "dp_4",
    name: "Chunky Gold Hoop Earrings",
    description: "Classic thick gold hoops to elevate any simple outfit to premium status.",
    price: "₹899",
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    category: "accessories",
    buy_link: "#",
    source: "Nykaa Fashion",
    rating: 4.7,
    reviews: 340,
    isNearby: false,
    distance: null
  },
  {
    id: "dp_5",
    name: "Neutral Knit Oversized Sweater",
    description: "Cozy drop-shoulder sweater in oatmeal tone for a relaxed fit.",
    price: "₹2,499",
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
    category: "tops",
    buy_link: "#",
    source: "Mango",
    rating: 4.8,
    reviews: 156,
    isNearby: true,
    distance: "12 km"
  }
];

const ProductsPage = () => {
  const { 
    user, preferences, addToFavorites, addToCart, isFavorite, removeFromFavorites
  } = useUserContext();
  const userGender = preferences?.gender || user?.gender || 'unisex';
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const [filters, setFilters] = useState({
    category: 'all', style: 'all', color: 'all', priceMin: 0, priceMax: 100000, gender: userGender,
    sleeve: 'all', material: 'all'
  });

  // Read URL query params from homepage navigation (e.g. ?q=cotton shirts or ?category=dresses)
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const qParam  = searchParams.get('q');
    const catParam = searchParams.get('category');
    if (qParam) {
      setSearchTerm(qParam);
    } else if (catParam) {
      setFilters(prev => ({ ...prev, category: catParam }));
    }
  }, []);

  const fetchProducts = useCallback(async (query = '', currentFilters = filters) => {
    // If it's the exact default state (no query, no filters), skip API to save Serper quota
    const isDefaultState = !query && 
      currentFilters.category === 'all' && 
      currentFilters.style === 'all' && 
      currentFilters.sleeve === 'all' && 
      currentFilters.material === 'all';

    if (isDefaultState) {
      setProducts(DEFAULT_PRODUCTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let finalQuery = query;
      
      // Build a richer query for Serper if using filters but no text
      if (!query) {
        const parts = [currentFilters.gender === 'unisex' ? 'fashion' : currentFilters.gender];
        if (currentFilters.category !== 'all') parts.push(currentFilters.category);
        if (currentFilters.style !== 'all') parts.push(currentFilters.style);
        if (currentFilters.sleeve !== 'all') parts.push(currentFilters.sleeve);
        if (currentFilters.material !== 'all') parts.push(currentFilters.material);
        finalQuery = parts.join(' ');
      }

      const response = await fetch(`${API_BASE_URL}/api/products/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm: finalQuery,
          filters: { ...currentFilters, gender: currentFilters.gender || userGender },
          limit: 24
        })
      });
      
      const data = await response.json();
      if (data.success) { 
        setProducts(data.products); 
      }
    } catch (error) {
      console.error('Error fetching live products:', error);
      // Fallback to empty if the API is down to avoid showing unrelated stale data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, userGender]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchProducts(searchTerm); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters, fetchProducts]);

  const handleCartClick = (product) => {
    try {
      addToCart(product);
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedToCart(prev => ({ ...prev, [product.id]: false })), 2000);
    } catch (error) { console.error('Error adding to cart:', error); }
  };

  const handleFavoriteClick = (product) => {
    if (isFavorite(product.id)) { removeFromFavorites(product.id); }
    else { addToFavorites(product); }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product); setSelectedSize(''); setSelectedColor('');
  };

  // Helper to get store logo or initials
  const getStoreLabel = (source) => {
    if (!source) return 'Store';
    const s = source.toLowerCase();
    if (s.includes('myntra')) return { name: 'Myntra', color: '#ff3f6c', short: 'M' };
    if (s.includes('ajio')) return { name: 'Ajio', color: '#2c4152', short: 'A' };
    if (s.includes('tata')) return { name: 'Tata Cliq', color: '#da1c5c', short: 'T' };
    if (s.includes('nykaa')) return { name: 'Nykaa', color: '#ff0050', short: 'N' };
    if (s.includes('amazon')) return { name: 'Amazon', color: '#ff9900', short: 'AM' };
    if (s.includes('flipkart')) return { name: 'Flipkart', color: '#2874f0', short: 'F' };
    return { name: source, color: 'var(--brand-pink)', short: source[0] };
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Sidebar - Desktop */}
      <FilterSidebar filters={filters} setFilters={setFilters} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-16 py-12 relative z-10">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-10 bg-brand-cream/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-brand-gray/50 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-4 text-brand-dark font-bold text-sm uppercase tracking-[0.2em]">
            <Filter className="w-5 h-5 text-brand-pink" />
            <span>Refine Selection</span>
          </button>
          <div className="text-brand-sage text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{products.length} Items</div>
        </div>

        {/* Dynamic Search Header */}
        <div className="mb-16 md:mb-24 max-w-6xl mx-auto">
          <div className="relative group w-full mb-10 md:mb-16">
            <div className="absolute inset-0 bg-brand-pink/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-sage w-7 h-7 opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
            <input
              type="text"
              placeholder="What defines your style today? (e.g. 'Linen', 'Silk', 'Bespoke')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 md:pl-24 pr-4 md:pr-48 py-6 md:py-8 bg-white/50 backdrop-blur-md border border-brand-gray rounded-[3rem] text-brand-dark placeholder-brand-sage/40 focus:border-brand-pink focus:outline-none focus:ring-8 focus:ring-brand-pink/5 transition-all text-lg md:text-2xl shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
            />
            <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-8">
               {loading && <RefreshCcw className="text-brand-pink w-6 h-6 animate-spin" />}
               <button
                 onClick={() => fetchProducts(searchTerm)}
                 className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-black hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-[0.2em] text-xs"
               >Discover</button>
            </div>
          </div>
          
          {/* Mobile search button */}
          <button
            onClick={() => fetchProducts(searchTerm)}
            className="md:hidden w-full py-6 bg-brand-dark text-white rounded-3xl font-bold hover:bg-brand-black transition-all mb-8 flex items-center justify-center gap-4 shadow-2xl uppercase tracking-[0.3em] text-sm"
          >
            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Find Inspiration
          </button>

          <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-brand-gray/50 pb-10">
            <div className="flex flex-col gap-2">
               <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.4em]">Curated For You</p>
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark tracking-tight">The <span className="text-brand-pink italic">Collection</span></h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-brand-sage font-black uppercase tracking-[0.2em] cursor-pointer hover:text-brand-pink transition-colors group bg-brand-cream/30 px-6 py-3 rounded-full border border-brand-gray/50">
               <span>Sort by Relevance</span>
               <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading && products.length === 0 ? (
          <div className="grid gap-8 md:gap-12 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-6">
                <div className="bg-brand-cream/30 rounded-[3.5rem] aspect-[3/4.5] border border-brand-gray/50"></div>
                <div className="h-6 bg-brand-cream/30 rounded-full w-2/3"></div>
                <div className="h-4 bg-brand-cream/30 rounded-full w-1/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-8 md:gap-16 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map(product => {
              const store = getStoreLabel(product.source);
              return (
                <div key={product.id} className="group bg-white rounded-[3.5rem] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.04)] overflow-hidden hover:shadow-[0_40px_80px_rgba(137,162,147,0.12)] transition-all duration-700 flex flex-col hover:-translate-y-4">
                  {/* Image Area */}
                  <div className="relative aspect-[3/4.5] overflow-hidden bg-brand-cream/20 flex items-center justify-center text-brand-sage/50">
                    <img 
                       src={product.image_url?.startsWith('http') || product.image_url?.startsWith('data:') ? product.image_url : `${API_BASE_URL}/api/v/${product.image_url?.startsWith('/') ? product.image_url.slice(1) : product.image_url}`} 
                       alt={product.name} 
                       onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80';
                       }}
                       className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* Nearby Badge */}
                    {product.isNearby && (
                        <div className="absolute top-6 left-6 px-4 py-2 bg-brand-dark/90 backdrop-blur-md text-white text-[9px] font-bold rounded-full flex items-center gap-3 shadow-2xl border border-white/10 z-10 uppercase tracking-widest">
                           <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></div>
                           {product.distance || "12 km"}
                        </div>
                    )}

                    {/* Quick Action: Heart */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFavoriteClick(product); }}
                      className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md shadow-2xl transition-all duration-500 z-20 ${
                        isFavorite(product.id) ? 'bg-brand-pink text-white scale-110' : 'bg-white/80 text-brand-sage hover:text-brand-pink hover:bg-white hover:scale-110'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Buy Overlay */}
                    <div className="absolute inset-x-6 bottom-6 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 z-20 flex flex-col gap-4">
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            let targetCategory = product.category || product.name;
                            if (filters.category === 'tops') targetCategory = 'tops';
                            if (filters.category === 'bottoms') targetCategory = 'bottoms';
                            if (filters.category === 'dresses') targetCategory = 'one-pieces';
                            navigate(`/tryon?productImage=${encodeURIComponent(product.image_url)}&productName=${encodeURIComponent(product.name)}&productCategory=${encodeURIComponent(targetCategory)}`);
                          }}
                          className="w-full py-4 bg-white/95 backdrop-blur-md text-brand-dark rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:bg-brand-pink hover:text-white transition-all border border-brand-gray/50 whitespace-nowrap"
                       >
                          <Sparkles className="w-4 h-4" /> <span>Try It On</span>
                       </button>
                       <a href={product.buy_link} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:bg-brand-black transition-all whitespace-nowrap">
                          <span>View Details</span> <ArrowRight className="w-4 h-4" />
                       </a>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-10 flex-1 flex flex-col">
                    <h3 className="text-base font-serif font-bold text-brand-dark mb-4 line-clamp-2 h-12 group-hover:text-brand-pink transition-colors duration-500 leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-6 mt-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-brand-dark tracking-tight">{product.price}</span>
                        {product.discount && <span className="text-[9px] text-brand-pink font-black uppercase tracking-widest animate-pulse">Save {product.discount}% Today</span>}
                      </div>
                      <div className="flex items-center gap-2 bg-brand-cream/50 px-3 py-2 rounded-xl border border-brand-pink/10 shadow-sm">
                        <Star className="w-4 h-4 text-brand-pink fill-current" />
                        <span className="text-[10px] font-black text-brand-dark">{product.rating || '4.5'}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-brand-gray/50 flex items-center gap-4">
                       <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-xl uppercase transition-transform group-hover:rotate-6" style={{ backgroundColor: store.color }}>
                          {store.short}
                       </div>
                       <span className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">{store.name}</span>
                       {product.freeDelivery && <span className="ml-auto text-[9px] text-brand-pink font-black uppercase tracking-widest opacity-60 italic">Free Delivery</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-48 text-center animate-fade-in relative">
            <div className="w-32 h-32 bg-brand-cream rounded-full flex items-center justify-center mb-12 shadow-inner border border-brand-pink/20 group">
              <RefreshCcw className="w-12 h-12 text-brand-pink/40 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-brand-dark mb-6">Curating the perfect selection...</h3>
            <p className="text-brand-sage font-bold max-w-md mb-16 leading-relaxed uppercase tracking-[0.3em] text-[10px] opacity-60">
              Scanning global boutiques to find exactly what defines you.
            </p>
            <button 
                onClick={() => setFilters({ category: 'all', style: 'all', color: 'all', priceMin: 0, priceMax: 100000, gender: userGender, sleeve: 'all', material: 'all' })}
                className="px-16 py-6 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 uppercase tracking-[0.2em] text-xs"
            >
                Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xl flex items-end md:items-center justify-center z-[120] p-0 md:p-8 lg:p-20">
          <div className="bg-white border border-brand-gray/50 rounded-t-[4rem] md:rounded-[4rem] max-w-6xl w-full h-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-scale-in">
            {/* Image Section */}
            <div className="w-full md:w-[55%] h-96 md:h-auto relative bg-brand-cream/30 overflow-hidden">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-10 left-10 p-4 bg-white/90 backdrop-blur-md text-brand-dark rounded-full lg:hidden shadow-2xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-[45%] p-12 lg:p-20 overflow-y-auto bg-white flex flex-col">
              <div className="hidden lg:flex justify-end mb-8">
                <button onClick={() => setSelectedProduct(null)} className="p-4 text-brand-sage hover:text-brand-dark transition-all bg-brand-cream/50 rounded-full hover:rotate-90 duration-500">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="mb-12">
                <span className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.4em] px-6 py-3 bg-brand-cream/50 rounded-full inline-block mb-8 border border-brand-pink/20 shadow-sm">
                  {selectedProduct.source} Exclusive
                </span>
                <h2 className="text-5xl lg:text-6xl font-serif font-bold text-brand-dark mb-10 leading-tight tracking-tight">{selectedProduct.name}</h2>
                <div className="flex items-center gap-8">
                   <span className="text-5xl font-bold text-brand-dark tracking-tighter">{selectedProduct.price}</span>
                   <div className="bg-brand-sage/10 text-brand-sage px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-sage/20 shadow-sm animate-pulse">Available Now</div>
                </div>
              </div>

              <p className="text-brand-dark/70 text-lg font-medium leading-relaxed mb-12 italic">
                {selectedProduct.description || "An exquisitely curated piece from our latest collection, designed for those who value both timeless elegance and contemporary flair."}
              </p>

              <div className="grid grid-cols-2 gap-8 p-10 bg-brand-cream/20 rounded-[3rem] border border-brand-pink/10 mb-16 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.3em] mb-4 opacity-60">Material</h4>
                  <p className="text-brand-dark font-bold text-lg">Bespoke Grade</p>
                </div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.3em] mb-4 opacity-60">Aesthetic</h4>
                  <p className="text-brand-dark font-bold text-lg">{filters.style !== 'all' ? filters.style : 'Minimalist Chic'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-auto">
                <button 
                  onClick={() => {
                    let targetCategory = selectedProduct.category || selectedProduct.name;
                    if (filters.category === 'tops') targetCategory = 'tops';
                    if (filters.category === 'bottoms') targetCategory = 'bottoms';
                    if (filters.category === 'dresses') targetCategory = 'one-pieces';
                    navigate(`/tryon?productImage=${encodeURIComponent(selectedProduct.image_url)}&productName=${encodeURIComponent(selectedProduct.name)}&productCategory=${encodeURIComponent(targetCategory)}`);
                  }}
                  className="flex-1 py-6 bg-brand-cream text-brand-dark border border-brand-pink/30 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-pink hover:text-white transition-all flex items-center justify-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5" /> AI Try-On
                </button>
                <a href={selectedProduct.buy_link} target="_blank" rel="noopener noreferrer" className="flex-1 py-6 bg-brand-dark text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-black transition-all flex items-center justify-center gap-4 text-center shadow-2xl hover:-translate-y-1">
                  Visit Boutique <ArrowRight className="w-5 h-5 text-brand-pink" />
                </a>
              </div>

              <p className="text-center text-brand-sage/60 text-[10px] font-black uppercase tracking-[0.3em] mt-16 flex items-center justify-center gap-4">
                <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></div>
                Signature Styling Support & Global Sourcing
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;