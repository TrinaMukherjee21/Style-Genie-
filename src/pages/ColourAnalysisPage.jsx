import React from 'react';
import ColourPaletteAnalyser from '../components/ColourPaletteAnalyser';
import { Sparkles } from 'lucide-react';

const ColourAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24 relative overflow-hidden">
      {/* Premium Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-cream/80 backdrop-blur-md rounded-full shadow-sm border border-brand-dark/20 text-brand-dark font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Sparkles className="w-4 h-4" /> AI Aesthetic Atelier
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-brand-dark tracking-tight leading-[1.1]">
            Chroma <span className="text-brand-pink italic">Analysis</span>
          </h1>
          <p className="text-brand-dark text-base md:text-xl font-bold max-w-3xl mx-auto leading-relaxed opacity-80">
            Unveil your signature spectrum. Our neural engine synthesizes your unique characteristics to curate a bespoke sartorial palette.
          </p>
        </div>

        {/* Main Component */}
        <div className="animate-fade-in">
          <ColourPaletteAnalyser />
        </div>
      </div>
    </div>
  );
};

export default ColourAnalysisPage;
