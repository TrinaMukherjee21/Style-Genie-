import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trash2, 
  Share2, 
  Download, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

import API_BASE_URL_CONFIG from '../config';
const API_BASE_URL = API_BASE_URL_CONFIG;

const LookbookPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useUserContext();
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLook, setSelectedLook] = useState(null);

  useEffect(() => {
    fetchLookbook();
  }, []);

  const fetchLookbook = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lookbook`);
      const data = await response.json();
      setLooks(data);
    } catch (error) {
      console.error("Failed to fetch lookbook", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLook = async (id) => {
    // Basic implementation for deletion
    setLooks(prev => prev.filter(l => l.id !== id));
    // In a real app, send a DELETE request to the server
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">Style Gallery</p>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/30"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight mb-6">
            My Personal <span className="text-brand-pink italic">Lookbook</span>
          </h1>
          <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">A curated collection of your AI-powered virtual fits.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div>
              <Sparkles className="w-8 h-8 text-brand-pink absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-10 font-bold text-brand-sage uppercase tracking-[0.3em] text-[10px] opacity-60">Curating your style gallery...</p>
          </div>
        ) : looks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {looks.map((look) => (
              <div 
                key={look.id} 
                className="group bg-white rounded-[3.5rem] border border-brand-gray shadow-[0_15px_40px_rgba(137,162,147,0.06)] overflow-hidden hover:shadow-[0_40px_80px_rgba(137,162,147,0.15)] transition-all duration-700 flex flex-col hover:-translate-y-4"
              >
                {/* Image Area */}
                <div 
                  className="relative aspect-[3/4.5] overflow-hidden cursor-pointer bg-brand-cream/20"
                  onClick={() => setSelectedLook(look)}
                >
                  <img 
                    src={look.image_url} 
                    alt="Lookbook Entry" 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-x-6 bottom-6 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 z-10 flex gap-4">
                    <button className="flex-1 py-4 bg-white/95 backdrop-blur-md text-brand-dark rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-pink hover:text-white transition-all shadow-2xl border border-brand-gray/50">
                      <ExternalLink className="w-4 h-4" /> Details
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteLook(look.id); }}
                      className="p-4 bg-white/95 backdrop-blur-md text-brand-sage rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-2xl border border-brand-gray/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute top-6 left-6 px-5 py-2.5 bg-brand-dark/90 backdrop-blur-md text-white text-[9px] font-bold rounded-full flex items-center gap-3 shadow-2xl border border-white/10 uppercase tracking-widest z-10">
                    <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
                    AI Synthetic
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] mb-6 opacity-60">
                    <Calendar className="w-4 h-4" />
                    {look.date}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-10">
                    {look.items?.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-brand-cream/50 text-brand-sage text-[9px] font-bold rounded-xl border border-brand-pink/10 uppercase tracking-widest group-hover:bg-brand-pink group-hover:text-white transition-colors duration-500">
                        {item.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 border-t border-brand-gray/50 flex items-center justify-between">
                     <div className="flex -space-x-4">
                        {look.items?.slice(0, 3).map((it, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-xl ring-1 ring-brand-gray/50 transition-transform hover:z-20 hover:scale-110">
                            <div className="w-full h-full bg-brand-cream flex items-center justify-center text-[10px] font-bold text-brand-pink uppercase tracking-tighter">
                               {it.name[0]}
                            </div>
                          </div>
                        ))}
                     </div>
                     <span className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] opacity-60">{look.items?.length} Elements</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-48 text-center animate-fade-in relative">
            <div className="w-32 h-32 bg-brand-cream rounded-full flex items-center justify-center mb-12 shadow-inner border border-brand-pink/20 relative group">
              <div className="absolute inset-0 bg-brand-pink/10 rounded-full animate-ping opacity-20"></div>
              <Sparkles className="w-12 h-12 text-brand-pink/40 group-hover:scale-125 transition-transform duration-700" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-brand-dark mb-6">Your story begins here...</h3>
            <p className="text-brand-sage font-bold max-w-md mb-16 leading-relaxed uppercase tracking-[0.3em] text-[10px] opacity-60">
              Discover pieces that resonate with your soul and build your signature look.
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="px-16 py-6 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex items-center gap-4 uppercase tracking-[0.2em] text-xs"
            >
              Explore the Atelier <ArrowRight className="w-5 h-5 text-brand-pink" />
            </button>
          </div>
        )}
      </div>

      {/* Selected Look Modal */}
      {selectedLook && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-xl" onClick={() => setSelectedLook(null)} />
          <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-scale-in">
              <div className="w-full md:w-[55%] bg-brand-cream/30 relative overflow-hidden">
                 <img src={selectedLook.image_url} alt="Full Look" className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000" />
                 <div className="absolute top-10 left-10 px-6 py-3 bg-white/90 backdrop-blur-md text-brand-dark text-xs font-bold rounded-full flex items-center gap-3 shadow-2xl border border-brand-gray/50 uppercase tracking-[0.2em]">
                   <Sparkles className="w-4 h-4 text-brand-pink" /> AI Synthesis Complete
                 </div>
              </div>
              <div className="w-full md:w-[45%] p-12 md:p-20 overflow-y-auto bg-white flex flex-col">
                 <button onClick={() => setSelectedLook(null)} className="absolute top-10 right-10 p-4 bg-brand-cream/50 text-brand-sage rounded-full hover:bg-brand-pink hover:text-white transition-all duration-500 shadow-xl group">
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 <div className="mb-12">
                    <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.4em] mb-6">Composition Details</p>
                    <h2 className="text-5xl font-serif font-bold text-brand-dark tracking-tight leading-tight">Curated <span className="text-brand-pink italic">Ensemble</span></h2>
                 </div>
                 
                 <div className="space-y-6 mb-16 flex-1">
                   {selectedLook.items?.map((it, i) => (
                     <div key={i} className="flex items-center justify-between group p-6 rounded-[2.5rem] hover:bg-brand-cream/50 border border-brand-gray/30 hover:border-brand-pink/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center text-xs font-bold text-brand-pink uppercase tracking-widest border border-brand-gray shadow-sm group-hover:scale-110 transition-transform">
                            {it.name[0]}
                         </div>
                         <div>
                            <p className="text-base font-serif font-bold text-brand-dark mb-2 group-hover:text-brand-pink transition-colors">{it.name}</p>
                            <p className="text-[11px] font-bold text-brand-sage uppercase tracking-[0.2em] opacity-80">{it.price}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => addToCart(it)}
                         className="p-5 bg-brand-dark text-white rounded-2xl hover:bg-brand-pink hover:shadow-2xl hover:scale-110 transition-all duration-500"
                       >
                         <ShoppingBag className="w-5 h-5" />
                       </button>
                     </div>
                   ))}
                 </div>

                 <button className="w-full py-6 bg-brand-dark text-white rounded-2xl font-bold flex items-center justify-center gap-6 hover:bg-brand-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 uppercase tracking-[0.3em] text-xs">
                   <Share2 className="w-5 h-5 text-brand-pink" /> Share Identity
                 </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ className, onClick }) => (
  <svg onClick={onClick} className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default LookbookPage;
