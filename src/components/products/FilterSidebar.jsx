import React from 'react';
import { X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, onClose, isOpen }) => {
  const categories = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];
    const sleeveStyles = ['all', 'Long Sleeve', 'Half-sleeve', 'Short Sleeve', 'Sleeveless', 'Three-quarter'];
    const materials = ['all', 'Cotton', 'Linen', 'Silk', 'Denim', 'Wool', 'Polyester'];
  const colors = [
    { name: 'all', hex: 'transparent' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Brown', hex: '#78350F' }
  ];
  const styles = ['all', 'Minimalist', 'Vintage', 'Streetwear', 'Boho', 'Formal', 'Casual', 'Grunge'];
  const priceRanges = [
    { label: 'Any Price', min: 0, max: 100000 },
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Over ₹10,000', min: 10000, max: 100000 }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

    <div className={`fixed inset-y-0 left-0 z-50 w-72 md:w-85 bg-white/95 backdrop-blur-2xl border-r border-brand-gray shadow-[20px_0_60px_rgba(30,26,27,0.05)] transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-8 border-b border-brand-gray flex items-center justify-between">
          <div className="flex items-center gap-4 text-brand-dark">
            <div className="w-10 h-10 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/20 shadow-sm">
              <SlidersHorizontal className="w-5 h-5 text-brand-pink" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight">Refine</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-3 text-brand-sage hover:text-brand-dark hover:bg-brand-cream rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          
          {/* Categories */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Signature</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Category</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat)}
                  className={`text-left px-5 py-3 rounded-2xl transition-all duration-500 font-bold text-xs uppercase tracking-widest ${
                    filters.category === cat 
                      ? 'bg-brand-dark text-white shadow-xl translate-x-2' 
                      : 'text-brand-sage hover:text-brand-dark hover:bg-brand-cream/50 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Value</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Investment</h4>
            </div>
            <div className="space-y-4">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => {
                        handleFilterChange('priceMin', range.min);
                        handleFilterChange('priceMax', range.max);
                    }}
                    className={`w-6 h-6 rounded-xl border-2 transition-all duration-500 flex items-center justify-center shadow-sm ${
                      filters.priceMax === range.max 
                        ? 'bg-brand-pink border-brand-pink scale-110' 
                        : 'border-brand-gray bg-white group-hover:border-brand-pink/50'
                    }`}
                  >
                    {filters.priceMax === range.max && <Check className="w-4 h-4 text-white font-black" />}
                  </div>
                  <span className={`transition-colors font-bold text-[11px] uppercase tracking-widest ${filters.priceMax === range.max ? 'text-brand-dark' : 'text-brand-sage/60 group-hover:text-brand-dark'}`}>
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Style / Aesthetic */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Vibe</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Aesthetic</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleFilterChange('style', style)}
                  className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 border ${
                    filters.style === style
                      ? 'bg-brand-dark text-white border-brand-dark shadow-xl scale-105'
                      : 'bg-white text-brand-sage hover:text-brand-dark border-brand-gray hover:border-brand-pink/30 hover:bg-brand-cream/30'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </section>

          {/* Colors */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Chroma</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Spectrum</h4>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleFilterChange('color', color.name)}
                  className="flex flex-col items-center gap-2 group"
                  title={color.name}
                >
                  <div 
                    className={`w-10 h-10 rounded-2xl border-4 transition-all duration-500 flex items-center justify-center overflow-hidden shadow-sm relative ${
                      filters.color === color.name 
                        ? 'border-brand-pink scale-110 shadow-xl ring-4 ring-brand-pink/10' 
                        : 'border-white group-hover:border-brand-pink/20 group-hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#F5F4F3' : (filters.color === color.name ? undefined : '#FFFFFF') }}
                  >
                    {color.name === 'all' && <div className="w-full h-full bg-gradient-to-br from-red-200 via-brand-pink to-brand-sage"></div>}
                    {filters.color === color.name && <Check className={`w-5 h-5 ${color.name === 'White' || color.name === 'Yellow' ? 'text-brand-dark' : 'text-white'}`} />}
                  </div>
                  <span className={`text-[8px] uppercase font-black tracking-widest truncate w-full text-center ${filters.color === color.name ? 'text-brand-pink' : 'text-brand-sage/40 group-hover:text-brand-dark'}`}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Sleeve Style */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Cut</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Silhouette</h4>
            </div>
            <div className="space-y-3">
              {sleeveStyles.map((sleeve) => (
                <label key={sleeve} className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => handleFilterChange('sleeve', sleeve)}
                    className={`w-5 h-5 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                      filters.sleeve === sleeve 
                        ? 'bg-brand-pink border-brand-pink' 
                        : 'border-brand-gray bg-white group-hover:border-brand-pink/50'
                    }`}
                  >
                    {filters.sleeve === sleeve && <Check className="w-3.5 h-3.5 text-white font-black" />}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${filters.sleeve === sleeve ? 'text-brand-dark' : 'text-brand-sage/60 group-hover:text-brand-dark'}`}>{sleeve}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Material */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-[9px] font-bold text-brand-pink uppercase tracking-[0.3em]">Tactile</p>
              <h4 className="text-[10px] font-black text-brand-sage uppercase tracking-[0.2em] opacity-60">Material</h4>
            </div>
            <div className="space-y-3">
              {materials.map((mat) => (
                <label key={mat} className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => handleFilterChange('material', mat)}
                    className={`w-5 h-5 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                      filters.material === mat 
                        ? 'bg-brand-pink border-brand-pink' 
                        : 'border-brand-gray bg-white group-hover:border-brand-pink/50'
                    }`}
                  >
                    {filters.material === mat && <Check className="w-3.5 h-3.5 text-white font-black" />}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${filters.material === mat ? 'text-brand-dark' : 'text-brand-sage/60 group-hover:text-brand-dark'}`}>{mat}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-brand-gray bg-brand-cream/10 backdrop-blur-md">
          <button 
            onClick={() => setFilters({
              category: 'all', style: 'all', color: 'all', priceMin: 0, priceMax: 100000, gender: 'unisex', sleeve: 'all', material: 'all'
            })}
            className="w-full py-5 text-[10px] text-brand-sage font-black uppercase tracking-[0.3em] hover:text-white hover:bg-brand-dark border border-brand-gray hover:border-brand-dark rounded-2xl transition-all duration-500 shadow-sm"
          >
            Purge All Filters
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default FilterSidebar;
