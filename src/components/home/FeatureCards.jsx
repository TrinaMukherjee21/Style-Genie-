import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Search, TrendingUp, Sparkles } from 'lucide-react';

/* ─── Static trending products ─── */
const TRENDING_PRODUCTS = [
  {
    id: 'tp1',
    name: 'Ribbed Knit Co-ord Set',
    price: '₹2,199',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    store: 'Myntra',
    badge: '🔥 Trending',
  },
  {
    id: 'tp2',
    name: 'Wide-Leg Linen Trousers',
    price: '₹1,899',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80',
    store: 'Zara',
    badge: '⭐ Top Rated',
  },
  {
    id: 'tp3',
    name: 'Oversized Graphic Tee',
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    store: 'H&M',
    badge: null,
  },
  {
    id: 'tp4',
    name: 'Mini Leather Crossbody',
    price: '₹3,450',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
    store: 'Tata Cliq',
    badge: '💕 Wishlisted',
  },
  {
    id: 'tp5',
    name: 'Pleated Midi Skirt',
    price: '₹1,599',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=400&q=80',
    store: 'Ajio',
    badge: '🔥 Trending',
  },
  {
    id: 'tp6',
    name: 'Chunky Gold Hoops',
    price: '₹799',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
    store: 'Nykaa Fashion',
    badge: null,
  },
];

/* ─── Curated style collections ─── */
const COLLECTIONS = [
  {
    title: 'Minimalist Chic',
    desc: 'Clean lines, neutral palettes, effortlessly elegant.',
    tag: 'Minimalist',
    color: 'from-zinc-100 to-stone-100',
    accent: '#6b7280',
    products: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80',
    ],
  },
  {
    title: 'Street Style',
    desc: 'Bold statements, urban energy, graphic-forward looks.',
    tag: 'Streetwear',
    color: 'from-orange-50 to-red-50',
    accent: '#ef4444',
    products: [
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
    ],
  },
  {
    title: 'Office Glam',
    desc: 'Power dressing done right — from desk to dinner.',
    tag: 'Formal',
    color: 'from-sky-50 to-indigo-50',
    accent: '#6366f1',
    products: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
    ],
  },
];

/* ─── Trending search tags ─── */
const TRENDING_SEARCHES = [
  'Cotton shirts', 'Banarasi silk', 'Wide-leg trousers', 'Oversized blazer',
  'Maxi dress', 'Block heels', 'Gold jewellery', 'Denim jacket',
  'Co-ord set', 'Floral midi', 'Leather bag', 'Knit cardigan',
];

const FeatureCards = () => {
  const navigate = useNavigate();

  const handleSearch = (term) => {
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* ── Section 1: Trending Now ── */}
      <section className="py-20 md:py-32 bg-brand-cream/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/5 blur-[150px] rounded-full -z-0 pointer-events-none animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-8">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-4 h-4 text-brand-pink" />
                <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Live From Global Boutiques</p>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/30"></div>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight leading-tight">
                Trending <span className="text-brand-pink italic">Right Now</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="hidden sm:flex items-center gap-4 text-xs font-bold text-brand-sage uppercase tracking-[0.2em] hover:text-brand-pink transition-all group py-2 border-b-2 border-brand-gray/50 hover:border-brand-pink"
            >
              Explore All Trends <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Horizontal Scroll Product Strip */}
          <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
            {TRENDING_PRODUCTS.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate('/products')}
                className="group flex-shrink-0 w-60 md:w-auto bg-white rounded-[2.5rem] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.06)] hover:border-brand-pink/30 overflow-hidden hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(137,162,147,0.12)] transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[3/4.5] overflow-hidden bg-brand-cream/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  />
                  {product.badge && (
                    <div className="absolute top-5 left-5 text-[9px] font-bold bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-brand-dark shadow-xl uppercase tracking-widest border border-brand-gray/50 z-10">
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-5 right-5 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl hover:bg-brand-pink hover:text-white z-10"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.2em] mb-2.5 opacity-80">{product.store}</p>
                  <p className="text-sm font-serif font-bold text-brand-dark leading-snug line-clamp-2 h-10 group-hover:text-brand-pink transition-colors">{product.name}</p>
                  <p className="text-base font-bold text-brand-dark mt-5">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="sm:hidden text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="w-full text-xs font-bold text-brand-dark bg-white border border-brand-pink/20 px-10 py-5 rounded-2xl hover:bg-brand-pink hover:text-white transition-all duration-500 uppercase tracking-[0.2em] shadow-lg"
            >
              Shop All Trending
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 2: Curated Collections ── */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-sage/5 blur-[100px] rounded-full -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative">
          <div className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
              <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Editorial Selection</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight leading-tight mb-8">
              Curated <span className="text-brand-pink italic">Collections</span>
            </h2>
            <p className="text-brand-sage text-xs md:text-sm max-w-xl mx-auto font-bold uppercase tracking-[0.3em] opacity-60">
              Handpicked looks for every mood and aesthetic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {COLLECTIONS.map((col) => (
              <div
                key={col.title}
                onClick={() => handleSearch(col.tag)}
                className="group relative overflow-hidden rounded-[3rem] border border-brand-gray shadow-[0_20px_50px_rgba(137,162,147,0.06)] hover:border-brand-pink/30 hover:shadow-[0_40px_80px_rgba(220,181,190,0.15)] transition-all duration-700 hover:-translate-y-4 cursor-pointer bg-brand-cream/10"
              >
                {/* Three product image row */}
                <div className="flex gap-3 p-5 pb-0">
                  {col.products.map((img, i) => (
                    <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? 'flex-[1.6]' : 'flex-1'} aspect-[2/3.5] border border-brand-gray/50 shadow-sm bg-white`}>
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                      />
                    </div>
                  ))}
                </div>

                {/* Label */}
                <div className="p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full border border-brand-pink/20 mb-6 bg-brand-pink/5 text-brand-pink">
                    <Sparkles className="w-3.5 h-3.5" />
                    {col.tag}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-pink transition-colors">{col.title}</h3>
                  <p className="text-brand-sage text-sm leading-relaxed mb-8 font-medium opacity-80">{col.desc}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-brand-dark uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                    Explore Ensemble <ArrowRight className="w-4 h-4 text-brand-pink" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Trending Searches ── */}
      <section className="py-20 md:py-24 bg-brand-cream/20 border-t border-brand-gray/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-brand-gray group hover:border-brand-pink transition-all duration-500">
              <Search className="w-6 h-6 text-brand-pink group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em] mb-2">Aesthetic Inquiries</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark tracking-tight">Trending Searches</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-5">
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="group flex items-center gap-4 px-8 py-4 bg-white border border-brand-gray rounded-[1.5rem] text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] hover:text-brand-dark hover:border-brand-pink/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
              >
                <TrendingUp className="w-4 h-4 text-brand-pink group-hover:scale-125 transition-transform" />
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureCards;