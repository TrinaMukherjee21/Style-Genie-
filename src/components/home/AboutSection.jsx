import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Tops',
    label: 'Shirts, Tees & Blouses',
    filter: 'tops',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80',
    color: 'from-rose-50 to-pink-50'
  },
  {
    name: 'Dresses',
    label: 'All Lengths & Styles',
    filter: 'dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80',
    color: 'from-fuchsia-50 to-pink-50'
  },
  {
    name: 'Bottoms',
    label: 'Trousers, Jeans & Skirts',
    filter: 'bottoms',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80',
    color: 'from-amber-50 to-orange-50'
  },
  {
    name: 'Outerwear',
    label: 'Jackets, Coats & Blazers',
    filter: 'outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80',
    color: 'from-slate-50 to-zinc-50'
  },
  {
    name: 'Shoes',
    label: 'Heels, Sneakers & Flats',
    filter: 'shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80',
    color: 'from-sky-50 to-blue-50'
  },
  {
    name: 'Accessories',
    label: 'Bags, Jewellery & More',
    filter: 'accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
    color: 'from-violet-50 to-purple-50'
  },
];

const AboutSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (filter) => {
    navigate(`/products?category=${filter}`);
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-pink/5 blur-[100px] rounded-full -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Curated Collections</p>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/30"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight leading-tight">
              Browse by <span className="text-brand-pink italic">Category</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden sm:flex items-center gap-4 text-xs font-bold text-brand-sage uppercase tracking-[0.2em] hover:text-brand-pink transition-all group py-2 border-b-2 border-brand-gray/50 hover:border-brand-pink"
          >
            Explore All Collections
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
          {categories.map((cat) => (
            <button
              key={cat.filter}
              onClick={() => handleCategoryClick(cat.filter)}
              className="group relative overflow-hidden rounded-[3rem] aspect-[3/4.5] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.06)] hover:border-brand-pink/30 transition-all duration-700 hover:-translate-y-3"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              {/* Premium Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-left z-10">
                <p className="text-white font-serif font-bold text-xl md:text-2xl leading-tight mb-2">{cat.name}</p>
                <p className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{cat.label}</p>
              </div>

              {/* Hover highlight line */}
              <div className="absolute bottom-0 left-0 h-1.5 bg-brand-pink w-0 group-hover:w-full transition-all duration-700"></div>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                <ArrowRight className="w-5 h-5 text-brand-pink" />
              </div>
            </button>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden text-center mt-16">
          <button
            onClick={() => navigate('/products')}
            className="w-full text-xs font-bold text-brand-dark bg-brand-cream border border-brand-pink/20 px-10 py-5 rounded-2xl hover:bg-brand-pink hover:text-white transition-all duration-500 uppercase tracking-[0.2em] shadow-lg"
          >
            Discover All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;