import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Wand2 } from 'lucide-react';

const StyleBotIframe = () => {
  const [isOpen, setIsOpen] = useState(false);

  // The fashion-app will be running on port 3005
  const EMBED_URL = "http://localhost:3005/embed";

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 md:w-20 md:h-20 bg-brand-dark rounded-[2rem] shadow-[0_20px_50px_rgba(30,26,27,0.3)] hover:shadow-brand-pink/40 hover:scale-110 transition-all duration-700 flex items-center justify-center relative overflow-hidden group border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            <div className="relative z-10 flex items-center justify-center">
              <Wand2 className="w-7 h-7 md:w-9 md:h-9 text-brand-pink" />
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white absolute -top-2 -right-2 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* Iframe Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:top-24 md:right-10 md:bottom-10 md:w-[480px] z-[60] flex flex-col bg-white md:rounded-[3.5rem] shadow-[0_50px_100px_rgba(30,26,27,0.2)] overflow-hidden border border-brand-gray backdrop-blur-3xl transition-all duration-700 animate-in fade-in zoom-in slide-in-from-bottom-20">
          {/* Header */}
          <div className="px-8 md:px-10 py-6 md:py-8 border-b border-brand-gray flex items-center justify-between bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-30"></div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-cream border border-brand-pink/10 flex items-center justify-center text-brand-pink shadow-inner relative group">
                <div className="absolute inset-0 bg-brand-pink/10 rounded-2xl animate-ping opacity-20"></div>
                <Sparkles size={24} className="relative z-10 group-hover:scale-125 transition-transform duration-700" />
              </div>
              <div>
                <h3 className="text-brand-dark font-serif font-bold text-lg md:text-xl tracking-tight leading-tight">The <span className="text-brand-pink italic">Muse</span></h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse shadow-[0_0_10px_rgba(212,136,152,0.8)]"></div>
                  <span className="text-[9px] text-brand-sage font-black uppercase tracking-[0.3em] opacity-60">Signature AI Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl hover:bg-brand-cream text-brand-sage hover:text-brand-dark transition-all duration-500 border border-transparent hover:border-brand-gray"
            >
              <X size={24} />
            </button>
          </div>

          {/* Embedded Chat Interface */}
          <div className="flex-1 relative w-full bg-brand-cream/10 min-h-0">
            <iframe
              src={EMBED_URL}
              className="absolute inset-0 w-full h-full border-none"
              title="StyleGenie Fashion AI"
              allow="camera; microphone; clipboard-write; encrypted-media"
            />
            {/* Overlay Gradient for premium feel */}
            <div className="absolute inset-0 pointer-events-none border-x-8 border-white/0"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default StyleBotIframe;

