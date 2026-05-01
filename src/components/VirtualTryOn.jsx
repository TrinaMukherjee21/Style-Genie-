import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Sparkles, Image as ImageIcon, Shirt, 
  Download, RefreshCcw, X, AlertCircle, Check, 
  Camera, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { runVirtualTryOn } from '../lib/vtonApi';

// Module-level cache to preserve outfit state across soft React Router navigations 
// (e.g., when redirecting to /products and coming back)
let cachedOutfit = {
  tops: { image: null, name: '', preview: null },
  bottoms: { image: null, name: '', preview: null },
  'one-pieces': { image: null, name: '', preview: null }
};

const VirtualTryOn = ({ 
  selectedProductImage, 
  selectedProductName,
  selectedProductCategory 
}) => {
  const navigate = useNavigate();

  // --- 1. Person State ---
  const [personImage, setPersonImage] = useState(
    localStorage.getItem('stylegenie_user_image') || null
  );
  const [personPreview, setPersonPreview] = useState(
    localStorage.getItem('stylegenie_user_image') || null
  );
  const personInputRef = useRef(null);

  const determineCategorySlot = (catString) => {
    if (!catString) return 'tops';
    const s = catString.toLowerCase();
    if (s.includes('bottom') || s.includes('pant') || s.includes('jean') || s.includes('trouser') || s.includes('skirt') || s.includes('short')) return 'bottoms';
    if (s.includes('dress') || s.includes('one-piece') || s.includes('jumpsuit') || s.includes('gown')) return 'one-pieces';
    return 'tops';
  };

  // --- 2. Outfit State (Multi-Slot) ---
  const initialCategory = determineCategorySlot(selectedProductCategory);

  const [outfit, setOutfit] = useState(cachedOutfit);
  const [activeSlot, setActiveSlot] = useState(initialCategory);
  const garmentInputRef = useRef(null);

  // Keep cache synced with state
  useEffect(() => {
    cachedOutfit = outfit;
  }, [outfit]);

  // Initialize outfit from URL if coming from Products page
  useEffect(() => {
    if (selectedProductImage) {
      const cat = determineCategorySlot(selectedProductCategory);
      setOutfit(prev => ({
        ...prev,
        [cat]: { 
          image: selectedProductImage, 
          name: selectedProductName || 'Selected Product',
          preview: selectedProductImage
        }
      }));
      setActiveSlot(cat);
      // Remove query params from URL so it doesn't re-trigger on refresh
      navigate('/tryon', { replace: true });
    }
  }, [selectedProductImage, selectedProductName, selectedProductCategory, navigate]);

  // --- 3. API & UI State ---
  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  // Progress Bar Animation
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (100 / (outfit.tops.image && outfit.bottoms.image && !outfit['one-pieces'].image ? 20 : 10)); // Slower if chaining
        });
      }, 3000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading, outfit]);

  const handlePersonUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonImage(file);
      const url = URL.createObjectURL(file);
      setPersonPreview(url);
      localStorage.setItem('stylegenie_user_image', url);
      setError(null);
    }
  };

  const handleGarmentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOutfit(prev => ({
        ...prev,
        [activeSlot]: { image: file, name: file.name, preview: url }
      }));
      setError(null);
    }
  };

  const handleClearSlot = (slotToClear, e) => {
    if (e) e.stopPropagation();
    setOutfit(prev => ({
      ...prev,
      [slotToClear]: { image: null, name: '', preview: null }
    }));
  };

  const handleBrowseCatalog = () => {
    // Map activeSlot to ProductsPage query filter
    const filterCat = activeSlot === 'one-pieces' ? 'dresses' : activeSlot;
    navigate(`/products?category=${filterCat}`);
  };

  const handleTryOn = async () => {
    if (!personImage) return;

    const hasTop = outfit.tops.image;
    const hasBottom = outfit.bottoms.image;
    const hasDress = outfit['one-pieces'].image;

    if (!hasTop && !hasBottom && !hasDress) return;

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      let currentPersonImage = personImage;

      if (hasDress) {
        setStepMsg('Generating Full Outfit...');
        currentPersonImage = await runVirtualTryOn(currentPersonImage, outfit['one-pieces'].image, 'one-pieces');
      } else {
        if (hasTop) {
          setStepMsg('Generating Top Wear...');
          currentPersonImage = await runVirtualTryOn(currentPersonImage, outfit.tops.image, 'tops');
        }
        if (hasBottom) {
          setStepMsg(hasTop ? 'Adding Bottom Wear...' : 'Generating Bottom Wear...');
          currentPersonImage = await runVirtualTryOn(currentPersonImage, outfit.bottoms.image, 'bottoms');
        }
      }

      setResultImage(currentPersonImage);
      setProgress(100);
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
      setStepMsg('');
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stylegenie-tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const canGenerate = personImage && (outfit.tops.image || outfit.bottoms.image || outfit['one-pieces'].image);

  return (
    <div className="flex flex-col gap-10">
      {USE_MOCK && (
        <div className="bg-brand-cream border-y border-brand-pink/20 py-3 px-6 flex items-center justify-center gap-3 animate-pulse">
          <span className="text-brand-pink font-bold text-[10px] uppercase tracking-[0.2em]">
            ✨ Preview Mode — Demonstrating AI synthesis capabilities.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-8 xl:gap-10">
        
        {/* LEFT PANEL — Silhouette */}
        <section className="bg-white p-8 rounded-[3rem] border border-brand-gray/50 shadow-[0_20px_50px_rgba(137,162,147,0.08)] flex flex-col h-full min-h-[500px] hover:border-brand-pink/20 transition-all duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-serif font-bold text-lg shadow-lg">1</div>
            <h2 className="text-xl font-serif font-bold text-brand-dark">Your Silhouette</h2>
          </div>

          <div 
            onClick={() => personInputRef.current?.click()}
            className={`flex-1 relative rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-6 overflow-hidden ${
              personPreview ? 'border-transparent bg-brand-cream/20' : 'border-brand-pink/20 bg-brand-cream/10 hover:bg-brand-pink/5 hover:border-brand-pink/40'
            }`}
          >
            {personPreview ? (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="w-full h-full relative"
                >
                  <img 
                    src={personPreview} 
                    alt="User Silhouette" 
                    className="w-full h-full object-contain rounded-2xl shadow-sm" 
                    onError={() => {
                      setPersonPreview(null);
                      setPersonImage(null);
                      localStorage.removeItem('stylegenie_user_image');
                    }}
                  />
                  <button 
                    className="absolute bottom-6 right-6 p-4 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-brand-dark hover:text-white transition-all z-10 border border-brand-gray/50"
                    onClick={(e) => { e.stopPropagation(); setPersonPreview(null); setPersonImage(null); localStorage.removeItem('stylegenie_user_image'); }}
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-brand-gray/50">
                  <Camera className="w-10 h-10 text-brand-pink/40" />
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-sm uppercase tracking-widest mb-2">Upload Portrait</p>
                  <p className="text-[10px] text-brand-sage font-medium uppercase tracking-widest opacity-60">Full body, clear lighting</p>
                </div>
              </div>
            )}
            <input type="file" ref={personInputRef} className="hidden" accept="image/*" onChange={handlePersonUpload} />
          </div>
        </section>

        {/* CENTER PANEL — Ensemble Selection */}
        <section className="bg-white p-8 rounded-[3rem] border border-brand-gray/50 shadow-[0_20px_50px_rgba(137,162,147,0.08)] flex flex-col h-full min-h-[500px] hover:border-brand-pink/20 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-serif font-bold text-lg shadow-lg">2</div>
              <h2 className="text-xl font-serif font-bold text-brand-dark">Curate Ensemble</h2>
            </div>
          </div>

          {/* Slot Selectors */}
          <div className="flex gap-3 mb-8">
            {[
              { id: 'tops', label: 'Tops' },
              { id: 'bottoms', label: 'Bottoms' },
              { id: 'one-pieces', label: 'Dresses' }
            ].map(slot => (
              <button
                key={slot.id}
                onClick={() => setActiveSlot(slot.id)}
                className={`flex-1 py-4 px-2 rounded-2xl border-2 transition-all duration-500 relative flex flex-col items-center justify-center gap-2 ${
                  activeSlot === slot.id ? 'border-brand-dark bg-brand-dark text-white shadow-xl' : 
                  outfit[slot.id].image ? 'border-brand-pink/30 bg-brand-cream/30 text-brand-dark' : 'border-brand-gray/50 bg-white text-brand-sage hover:border-brand-pink/30 hover:bg-brand-cream/10'
                }`}
              >
                <span className="font-bold text-[9px] uppercase tracking-[0.2em]">{slot.label}</span>
                {outfit[slot.id].image ? (
                  <div className="flex items-center gap-1 text-[8px] font-bold text-brand-pink uppercase tracking-widest">
                    <Check className="w-3 h-3" /> Selected
                  </div>
                ) : (
                  <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Empty</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col relative">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.3em] opacity-60">
                Aesthetic: {activeSlot === 'tops' ? 'Blouses & Shirts' : activeSlot === 'bottoms' ? 'Trousers & Skirts' : 'Full Ensemble'}
              </span>
            </div>

            {/* Selected Garment Display */}
            {outfit[activeSlot].preview ? (
              <div className="flex-1 relative rounded-[2.5rem] border border-brand-gray/50 overflow-hidden mb-6 bg-brand-cream/10 flex items-center justify-center p-6 transition-all duration-500 group">
                 <img src={outfit[activeSlot].preview} alt="Selected Garment" className="max-h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                 <button 
                    onClick={(e) => handleClearSlot(activeSlot, e)} 
                    className="absolute top-6 right-6 bg-white/95 p-3 rounded-full shadow-lg hover:text-white hover:bg-brand-pink transition-all border border-brand-gray/50"
                 >
                    <X className="w-4 h-4"/>
                 </button>
              </div>
            ) : (
              <div className="flex-1 relative rounded-[2.5rem] border-2 border-dashed border-brand-pink/20 bg-brand-cream/10 flex flex-col items-center justify-center p-8 mb-6">
                 <Shirt className="w-14 h-14 text-brand-pink/30 mb-6" />
                 <p className="text-sm font-bold text-brand-dark mb-2 text-center uppercase tracking-widest">Selection Empty</p>
                 <p className="text-[10px] font-medium text-brand-sage text-center max-w-[200px] uppercase tracking-widest opacity-60">Choose from boutique or upload bespoke</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <button 
                onClick={handleBrowseCatalog} 
                className="flex-1 py-4.5 bg-brand-dark text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-black transition-all shadow-lg hover:-translate-y-1"
              >
                 <ShoppingBag className="w-4 h-4 text-brand-pink" /> Boutique
              </button>
              <button 
                onClick={() => garmentInputRef.current?.click()} 
                className="flex-1 py-4.5 bg-brand-cream text-brand-sage border border-brand-pink/30 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-brand-pink hover:text-white transition-all flex items-center justify-center gap-3"
              >
                 <Upload className="w-4 h-4" /> Custom
              </button>
              <input type="file" ref={garmentInputRef} className="hidden" accept="image/*" onChange={handleGarmentUpload} />
            </div>
          </div>
        </section>

        {/* RIGHT PANEL — Mirror Preview */}
        <section className="bg-white p-8 rounded-[3rem] border-4 border-brand-cream shadow-[0_25px_60px_rgba(137,162,147,0.15)] flex flex-col h-full min-h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-cream/5 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-serif font-bold text-brand-dark">Aesthetic Mirror</h2>
            </div>
            {resultImage && (
              <button 
                onClick={handleDownload}
                className="p-3 bg-brand-cream text-brand-pink rounded-full hover:bg-brand-dark hover:text-white transition-all shadow-sm border border-brand-pink/20"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex-1 relative rounded-[2.5rem] bg-white border border-brand-gray/50 overflow-hidden flex flex-col items-center justify-center z-10">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-white/95 backdrop-blur-sm z-20">
                <div className="relative w-32 h-32 mb-8">
                   <div className="absolute inset-0 border-4 border-brand-pink/20 border-t-brand-dark rounded-full animate-spin"></div>
                   <div className="absolute inset-6 bg-brand-cream/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-brand-pink animate-pulse" />
                   </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">{stepMsg || 'Synthesizing Look...'}</h3>
                <p className="text-[10px] text-brand-sage font-bold mb-10 uppercase tracking-[0.2em] opacity-60">
                  {outfit.tops.image && outfit.bottoms.image && !outfit['one-pieces'].image 
                    ? 'Processing multi-layer ensemble (~60s)' 
                    : 'Refining silhouettes (~20s)'}
                </p>
                
                <div className="w-full max-w-[240px] h-2 bg-brand-gray/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-dark"
                  />
                </div>
              </div>
            ) : resultImage ? (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full"
                >
                  <img src={resultImage} alt="Synthesized Look" className="w-full h-full object-contain" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <button 
                      onClick={() => { setResultImage(null); }}
                      className="px-8 py-4 bg-white/95 backdrop-blur-sm text-brand-dark font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-brand-dark hover:text-white transition-all whitespace-nowrap border border-brand-gray/50"
                    >
                      Refine Ensemble
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : error ? (
              <div className="text-center p-10">
                <div className="w-20 h-20 bg-brand-pink/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-brand-pink" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Synthesis Interrupted</h3>
                <p className="text-xs text-brand-pink font-bold mt-2 mb-10 uppercase tracking-widest">{error}</p>
                <button 
                  onClick={handleTryOn}
                  className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-black transition-all"
                >
                  Retry Synthesis
                </button>
              </div>
            ) : (
              <div className="text-center p-16">
                <div className="w-24 h-40 border-4 border-brand-pink/10 rounded-[4rem] mx-auto mb-10 flex items-center justify-center bg-brand-cream/10 shadow-inner">
                  <ImageIcon className="w-12 h-12 text-brand-pink/20" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-sage/40 italic">Signature Mirror</h3>
                <p className="text-[10px] text-brand-sage/40 font-bold mt-4 uppercase tracking-[0.3em]">Your reflection awaits</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="sticky bottom-8 bg-white/90 backdrop-blur-2xl border border-brand-gray/50 p-8 rounded-[3rem] shadow-[0_40px_100px_rgba(30,26,27,0.15)] z-40 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
             <h4 className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.3em] mb-2 opacity-60">Ready to Reveal?</h4>
             <p className="text-sm font-bold text-brand-dark flex items-center gap-3">
               {canGenerate ? (
                 <span className="flex items-center gap-3 text-brand-pink">
                   <div className="w-2 h-2 bg-brand-pink rounded-full animate-pulse"></div>
                   {outfit['one-pieces'].image ? 'Full Silhouette Ready' : 
                    outfit.tops.image && outfit.bottoms.image ? 'Layered Ensemble Ready' :
                    outfit.tops.image ? 'Top Wear Selected' : 'Bottom Wear Selected'
                   }
                 </span>
               ) : (
                 <span className="text-brand-sage/60 uppercase tracking-widest text-[10px]">Complete your selection to begin synthesis</span>
               )}
             </p>
          </div>
          
          <button 
            disabled={!canGenerate || loading}
            onClick={handleTryOn}
            className={`w-full md:w-auto px-16 py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden ${
              !canGenerate || loading
                ? 'bg-brand-gray text-brand-sage/40 cursor-not-allowed opacity-50'
                : 'bg-brand-dark text-white hover:bg-brand-black hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(30,26,27,0.3)]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-brand-pink" />
                <span>Begin Synthesis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
