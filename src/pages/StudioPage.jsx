import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Upload, Sparkles, Image as ImageIcon, Shirt, Link as LinkIcon, 
  Download, RefreshCcw, ChevronsRight, Camera, X, AlertCircle, ShoppingBag, Trash2
} from 'lucide-react';

const StudioPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  // Image states - User profile (we keep this in session only usually, but let's persist for better UX)
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(() => localStorage.getItem('stylegenie_user_image') || null);
  
  // Outfit state - Persistent Multi-slot
  const [outfit, setOutfit] = useState(() => {
    const saved = localStorage.getItem('stylegenie_outfit');
    return saved ? JSON.parse(saved) : {
        upper: { url: null, file: null, name: '' },
        lower: { url: null, file: null, name: '' },
        dress: { url: null, file: null, name: '' }
    };
  });
  
  const [activeCategory, setActiveCategory] = useState('upper'); // 'upper', 'lower', 'dress'
  
  const [error, setError] = useState('');

  // Refs
  const userFileRef = useRef(null);
  const garmentFileRef = useRef(null);

  // Persistence: Save outfit to localStorage
  useEffect(() => {
    // We only save strings to localStorage. Files are lost on refresh, 
    // so we'll need to re-fetch/re-blob them if we want TRUE persistence across refreshes.
    // For navigation between pages (SPA), the state persists, but if they reload, blobs are gone.
    localStorage.setItem('stylegenie_outfit', JSON.stringify({
        upper: { ...outfit.upper, file: null }, // files can't be stringified
        lower: { ...outfit.lower, file: null },
        dress: { ...outfit.dress, file: null }
    }));
  }, [outfit]);

  // Special handling: Navigation from shop often loses blobs. 
  // We re-blob only if we have a URL but no file.
  useEffect(() => {
    Object.keys(outfit).forEach(slot => {
        if (outfit[slot].url && !outfit[slot].file && outfit[slot].url.startsWith('http')) {
            reBlobGarment(slot, outfit[slot].url);
        }
    });
  }, []);

  const reBlobGarment = (slot, url) => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "persisted_garment.jpg", { type: "image/jpeg" });
        setOutfit(prev => ({
            ...prev,
            [slot]: { ...prev[slot], file }
        }));
      })
      .catch(err => console.error("Re-blob failed:", err));
  };

  // Initialize from navigation state if coming from ProductsPage
  useEffect(() => {
    if (location.state && location.state.productImage) {
      const garmUrl = location.state.productImage;
      const rawCat = (location.state.category || '').toLowerCase();
      const rawName = (location.state.name || '').toLowerCase();
      
      let slot = 'upper';
      // Hardened mapping logic
      const isLower = (c) => c.includes('bottom') || c.includes('pant') || c.includes('jeans') || c.includes('trouser') || c.includes('skirt') || c.includes('lower');
      const isDress = (c) => c.includes('dress') || c.includes('gown') || c.includes('jumpsuit');
      
      if (isLower(rawCat) || isLower(rawName)) slot = 'lower';
      else if (isDress(rawCat) || isDress(rawName)) slot = 'dress';
      
      console.log(`Detected slot [${slot}] for category [${rawCat}] and name [${rawName}]`);
      
      setActiveCategory(slot);
      handleProductSelection(slot, garmUrl, location.state.name || 'Selected Piece');
      
      // Clear location state to prevent re-triggering on history changes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleProductSelection = (slot, url, name) => {
    // Skip frontend blobbing to avoid strict CORS/Resource issues.
    // The backend will dynamically download the URL if 'file' is null.
    updateOutfitSlot(slot, url, null, name);
  };

  const updateOutfitSlot = (slot, url, file, name = '') => {
    setOutfit(prev => {
        const newOutfit = { ...prev };
        if (slot === 'dress') {
            newOutfit.upper = { url: null, file: null, name: '' };
            newOutfit.lower = { url: null, file: null, name: '' };
        } else {
            newOutfit.dress = { url: null, file: null, name: '' };
        }
        newOutfit[slot] = { url, file, name };
        return newOutfit;
    });
    setResultImage(null);
    setError('');
  };

  const handleUserImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImageFile(file);
      const preview = URL.createObjectURL(file);
      setUserImagePreview(preview);
      localStorage.setItem('stylegenie_user_image', preview); // preview URL might expire, but works for same session
      setResultImage(null);
      setError('');
    }
  };

  const handleGarmentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateOutfitSlot(activeCategory, url, file, "Custom Upload");
    }
  };


  const removeSlot = (slot) => {
    setOutfit(prev => ({
        ...prev,
        [slot]: { url: null, file: null, name: '' }
    }));
    setResultImage(null);
  };

  const clearOutfit = () => {
    setOutfit({
        upper: { url: null, file: null, name: '' },
        lower: { url: null, file: null, name: '' },
        dress: { url: null, file: null, name: '' }
    });
    setResultImage(null);
    localStorage.removeItem('stylegenie_outfit');
  };


  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.4em]">Digital Atelier</p>
              <div className="h-px w-12 bg-brand-pink/30"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-dark tracking-tighter mb-6 leading-tight">
              Style <span className="text-brand-pink italic">Studio</span>
            </h1>
            <p className="text-brand-sage font-medium text-xl max-w-xl leading-relaxed uppercase tracking-[0.1em] opacity-60">Architect your aesthetic layer by layer. The studio remembers your vision as you curate.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <button 
                onClick={clearOutfit}
                className="px-8 py-4 bg-white text-brand-sage border border-brand-gray rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all duration-500 shadow-sm active:scale-95"
             >
                Purge Outfit
             </button>
             <div className="flex items-center gap-4 bg-brand-cream/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-brand-pink/10 shadow-inner">
                <div className="w-2 h-2 bg-brand-pink rounded-full animate-pulse shadow-[0_0_10px_rgba(212,136,152,0.8)]"></div>
                <span className="text-[10px] font-black text-brand-dark uppercase tracking-[0.3em]">Synapse Active</span>
             </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-12 bg-brand-pink/5 border border-brand-pink/20 p-8 rounded-[2.5rem] flex items-center gap-6 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-brand-pink" />
            <div className="flex-1">
              <p className="text-brand-pink font-black text-[10px] uppercase tracking-[0.3em] mb-1">Atelier Note</p>
              <p className="text-brand-dark font-serif font-bold text-lg">{error}</p>
            </div>
            <button onClick={() => setError('')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-pink/10 transition-colors">
              <X className="w-5 h-5 text-brand-pink" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-10">
            {/* Base Image */}
            <div className="bg-white p-10 rounded-[4rem] border border-brand-gray shadow-2xl relative overflow-hidden group hover:shadow-brand-pink/5 transition-all duration-700">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 blur-3xl rounded-full"></div>
               <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-serif font-bold text-xl shadow-xl">I</div>
                    <h2 className="text-2xl font-serif font-bold text-brand-dark tracking-tight">Prime Silhouette</h2>
                 </div>
                 <button onClick={() => userFileRef.current?.click()} className="text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 bg-brand-cream text-brand-pink rounded-full hover:bg-brand-dark hover:text-white transition-all duration-500 border border-brand-pink/10">
                   {userImagePreview ? "Revision" : "Upload"}
                 </button>
               </div>
               <input type="file" ref={userFileRef} className="hidden" accept="image/*" onChange={handleUserImageUpload} />
               <div 
                  className={`relative ${userImagePreview ? 'h-[28rem]' : 'h-52'} bg-brand-cream/20 rounded-[3rem] overflow-hidden border-2 border-dashed border-brand-gray flex items-center justify-center cursor-pointer transition-all duration-1000 group-hover:border-brand-pink/30`}
                  onClick={() => !userImagePreview && userFileRef.current?.click()}
               >
                 {userImagePreview ? (
                    <img 
                      src={userImagePreview} 
                      alt="User" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" 
                      onError={() => {
                        setUserImagePreview(null);
                        setUserImageFile(null);
                        setError("Photo session expired. Please re-upload your photo.");
                      }}
                    />
                 ) : (
                   <div className="text-center p-10 flex flex-col items-center gap-4">
                     <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-inner mb-2">
                        <Camera className="w-8 h-8 text-brand-pink/40" />
                     </div>
                     <p className="font-black text-brand-sage text-[10px] uppercase tracking-[0.4em] opacity-40">Capture Base Aesthetic</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Persistence-aware Outfit Builder */}
            <div className="bg-white p-10 rounded-[4rem] border border-brand-gray shadow-2xl relative overflow-hidden group hover:shadow-brand-pink/5 transition-all duration-700">
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-sage/5 blur-3xl rounded-full"></div>
               <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-serif font-bold text-xl shadow-xl">II</div>
                    <h2 className="text-2xl font-serif font-bold text-brand-dark tracking-tight">The Archive</h2>
                 </div>
                 <button onClick={() => navigate('/products')} className="text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 bg-brand-dark text-white rounded-full flex items-center gap-3 hover:bg-brand-pink transition-all duration-500 shadow-xl">
                   <ShoppingBag className="w-3.5 h-3.5" /> Boutique
                 </button>
               </div>

               <div className="space-y-5 mb-8 relative z-10">
                  {[
                    { id: 'upper', label: 'Superior', icon: Shirt },
                    { id: 'lower', label: 'Inferior', icon: () => <div className="w-5 h-5 border-2 border-current rounded-sm mb-0.5"></div> },
                    { id: 'dress', label: 'Monolith', icon: () => <div className="w-5 h-5 border-2 border-current rounded-full mb-0.5"></div> }
                  ].map(slot => (
                    <div key={slot.id} 
                         onClick={() => setActiveCategory(slot.id)}
                         className={`p-5 rounded-[2.5rem] border-2 transition-all duration-700 cursor-pointer flex items-center gap-6 group/slot ${
                           activeCategory === slot.id ? 'border-brand-dark bg-brand-cream/30 shadow-xl translate-x-2' : 'border-transparent hover:bg-brand-cream/10'
                         }`}
                    >
                        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 overflow-hidden bg-white shadow-inner ${outfit[slot.id].url ? 'border-none ring-4 ring-brand-pink/10 scale-110' : 'border-dashed border-brand-gray'}`}>
                           {outfit[slot.id].url ? (
                             <img src={outfit[slot.id].url} alt={slot.label} className="w-full h-full object-cover" />
                           ) : (
                             <div className="text-brand-gray/40 group-hover/slot:text-brand-pink/40 transition-colors">
                                {typeof slot.icon === 'function' ? slot.icon() : <slot.icon className="w-6 h-6" />}
                             </div>
                           )}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeCategory === slot.id ? 'text-brand-pink' : 'text-brand-sage/40'}`}>
                                 {slot.label}
                              </span>
                              {outfit[slot.id].url && (
                                <button onClick={(e) => { e.stopPropagation(); removeSlot(slot.id); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-pink/10 text-brand-gray hover:text-brand-pink transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                           </div>
                           <p className={`text-sm font-serif font-bold truncate ${outfit[slot.id].url ? 'text-brand-dark' : 'text-brand-gray/30 italic uppercase text-[10px] tracking-widest'}`}>
                              {outfit[slot.id].url ? (outfit[slot.id].name || 'Curated Piece') : 'Awaiting Selection'}
                           </p>
                        </div>
                    </div>
                  ))}
               </div>
               
               <button 
                  onClick={() => garmentFileRef.current?.click()}
                  className="w-full py-5 bg-brand-cream/40 text-brand-dark rounded-3xl text-[9px] font-black uppercase tracking-[0.4em] border border-brand-gray hover:border-brand-pink/30 hover:bg-brand-pink hover:text-white transition-all duration-700 relative z-10"
               >
                  Import External to {activeCategory}
               </button>
               <input type="file" ref={garmentFileRef} className="hidden" accept="image/*" onChange={handleGarmentImageUpload} />
            </div>

          </div>

          {/* Merge Arrow */}
          <div className="hidden lg:flex col-span-2 flex-col items-center justify-center py-24">
             <div className="flex flex-col items-center gap-12 group">
                <ChevronsRight className="w-12 h-12 text-brand-pink/20 group-hover:text-brand-pink transition-all duration-1000 group-hover:translate-x-4" />
                <div className="w-32 h-32 rounded-[3.5rem] flex flex-col items-center justify-center gap-3 bg-brand-cream/20 text-brand-pink/30 border border-brand-pink/10 shadow-inner group-hover:bg-brand-dark group-hover:text-white transition-all duration-1000 group-hover:shadow-2xl">
                  <Shirt className="w-10 h-10" />
                  <span className="font-black text-[9px] uppercase tracking-[0.4em]">Mirror</span>
                </div>
             </div>
          </div>
          
          {/* AI Result */}
          <div className="lg:col-span-5 h-full">
             <div className="w-full h-full min-h-[700px] bg-white rounded-[5rem] border border-brand-gray overflow-hidden relative shadow-2xl flex flex-col group hover:shadow-brand-pink/10 transition-all duration-1000">
               <div className="absolute inset-0 bg-brand-cream/10 animate-pulse-slow"></div>
               <div className="flex-1 w-full flex flex-col items-center justify-center p-16 relative z-10">
                    <div className="w-32 h-32 bg-brand-cream/40 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner border border-brand-pink/5">
                      <ImageIcon className="w-16 h-16 text-brand-pink/20" />
                    </div>
                    <div className="text-center space-y-6">
                      <h3 className="text-4xl font-serif font-bold text-brand-dark italic opacity-30 tracking-tight">The Reflection</h3>
                      <p className="text-[10px] font-black text-brand-sage uppercase tracking-[0.5em] opacity-40">Synthesizing Aesthetic DNA</p>
                    </div>
                    
                    <div className="absolute bottom-16 left-0 right-0 px-16">
                      <div className="h-1 w-full bg-brand-gray rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-brand-pink/20 w-full animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(to right, transparent, rgba(212,136,152,0.4), transparent)' }}></div>
                      </div>
                    </div>
               </div>
             </div>
          </div>

        </div>

        {/* Favorites Reel */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-serif font-bold text-brand-dark tracking-tighter">Signature <span className="text-brand-pink italic">Vault</span></h2>
            <div className="h-px flex-1 mx-12 bg-brand-gray hidden md:block"></div>
            <p className="text-[10px] font-black text-brand-sage uppercase tracking-[0.4em] opacity-40">Your Curated Collection</p>
          </div>
          <div className="flex gap-12 overflow-x-auto pb-16 no-scrollbar snap-x">
            {[
              { id: 'fav1', name: 'Atelier Linen superior', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', slot: 'upper' },
              { id: 'fav2', name: 'Midnight Monolith', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80', slot: 'dress' },
              { id: 'fav3', name: 'Sculpted inferior', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80', slot: 'lower' },
              { id: 'fav4', name: 'Silk superior', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500&q=80', slot: 'upper' }
            ].map((item) => (
              <div key={item.id} onClick={() => handleProductSelection(item.slot, item.image, item.name)} className="flex-shrink-0 w-64 group cursor-pointer snap-start">
                <div className="relative aspect-[3/4.5] rounded-[3rem] overflow-hidden border border-brand-gray shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-700 shadow-2xl">
                      <Plus className="w-8 h-8 text-brand-dark" />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-serif font-bold text-brand-dark text-xl mb-2 group-hover:text-brand-pink transition-colors">{item.name}</h3>
                  <p className="text-[9px] font-black text-brand-pink uppercase tracking-[0.3em]">Map to {item.slot}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default StudioPage;
