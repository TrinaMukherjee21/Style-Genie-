import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Sparkles, RefreshCcw, Check, X, 
  ChevronRight, ArrowRight, Copy, Info, 
  ShoppingBag, Star, Zap, Camera
} from 'lucide-react';
import { analyseColourPalette } from '../lib/colourAnalysisApi';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const ColourPaletteAnalyser = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResults(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleAnalyse = async () => {
    if (!image) return;

    setIsAnalysing(true);
    setError(null);
    try {
      const analysis = await analyseColourPalette(image);
      setResults(analysis);
    } catch (err) {
      setError(err.message || 'Could not analyse the photo. Please try a clearer face photo.');
    } finally {
      setIsAnalysing(false);
    }
  };


  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopyFeedback(hex);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const getSeasonIcon = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '✨';
    }
  };

  const resetState = () => {
    setImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {!results ? (
        <div className="flex flex-col items-center justify-center">
          {/* SECTION 1: Upload Area */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-2xl aspect-[16/9] md:aspect-[21/9] rounded-[3rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden ${
              previewUrl ? 'border-brand-pink bg-white shadow-2xl' : 'border-brand-gray bg-brand-cream/10 hover:bg-white hover:border-brand-pink/50'
            }`}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-10 blur-xl scale-110" />
                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-700">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">Portrait Captured</h3>
                  <p className="text-brand-dark font-bold text-[10px] uppercase tracking-widest opacity-80">Tap to replace silhouette</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center p-8 text-center">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-brand-gray/50 mb-8 group-hover:scale-110 transition-all duration-700">
                  <Upload className="w-10 h-10 text-brand-dark/60" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-brand-dark mb-3">Upload Portrait</h3>
                <p className="text-brand-dark font-medium max-w-xs uppercase tracking-widest text-[10px] opacity-80">A clear, natural lighting photo ensures an exquisite analysis.</p>
                <div className="mt-10 flex items-center gap-3 text-[9px] font-bold text-brand-dark uppercase tracking-[0.2em] bg-white px-8 py-3 rounded-full shadow-lg border border-brand-dark/20">
                  <Camera className="w-4 h-4" /> Signature Studio Mode
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* SECTION 2: Analyse Button */}
          <div className="mt-16 w-full max-w-md">
            <button
              onClick={handleAnalyse}
              disabled={!image || isAnalysing}
              className={`w-full py-6 rounded-2xl font-bold text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(30,26,27,0.2)] transition-all duration-500 transform hover:-translate-y-1 active:scale-95 ${
                !image || isAnalysing
                  ? 'bg-brand-gray/50 text-brand-dark/70 border border-brand-dark/10 cursor-not-allowed'
                  : 'bg-brand-dark text-white hover:bg-brand-black'
              }`}
            >
              {isAnalysing ? (
                <>
                  <RefreshCcw className="w-6 h-6 animate-spin text-brand-pink" />
                  <span>Synthesizing Spectrum...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-brand-pink" />
                  <span>Begin Analysis</span>
                </>
              )}
            </button>
            {isAnalysing && (
              <p className="text-center text-brand-dark font-bold text-[10px] uppercase tracking-[0.2em] mt-6 animate-pulse opacity-80">
                Refining neural pathways (~10s)
              </p>
            )}
            {error && (
              <div className="mt-8 p-5 bg-brand-pink/5 border border-brand-pink/20 rounded-2xl text-brand-pink text-[10px] font-bold uppercase tracking-widest flex items-center gap-4 animate-shake">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <X className="w-5 h-5" />
                </div>
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SECTION 3: Results */
        <div className="animate-fade-in space-y-16">
          {/* A. Header Card */}
          <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-brand-gray shadow-[0_40px_100px_rgba(137,162,147,0.1)] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
            
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-8 border-brand-cream shadow-2xl flex-shrink-0 relative z-10 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
              <img src={previewUrl} alt="Portrait Analysis" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-cream/50 rounded-full text-brand-pink font-bold text-[10px] uppercase tracking-[0.2em] border border-brand-pink/20 mb-6">
                <span>{getSeasonIcon(results.seasonType)} {results.seasonType} Season Archetype</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-6 leading-[1.1]">{results.paletteName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-brand-dark font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
                  {results.skinTone} complex
                </span>
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
                  {results.undertone} undertone
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* B. Best Colours Grid */}
            <div className="bg-white rounded-[3rem] p-10 border border-brand-gray shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl">
              <h2 className="text-xl font-serif font-bold text-brand-dark mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/20 shadow-sm">
                  <Check className="w-6 h-6 text-brand-sage" />
                </div>
                Your Harmonious Palette
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {results.bestColours.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    <button
                      onClick={() => copyToClipboard(color.hex)}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-6 relative border-4 border-white"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}>
                        <Copy className="w-5 h-5 text-white" />
                      </div>
                      {copyFeedback === color.hex && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl animate-bounce">Copied</div>
                      )}
                    </button>
                    <span className="mt-4 text-[9px] font-bold text-brand-dark text-center uppercase tracking-widest opacity-80">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Colours to Avoid */}
            <div className="bg-white rounded-[3rem] p-10 border border-brand-gray shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl">
              <h2 className="text-xl font-serif font-bold text-brand-dark mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/20 shadow-sm">
                  <X className="w-6 h-6 text-brand-pink" />
                </div>
                Discordant Tones
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {results.avoidColours.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center group opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden border-4 border-white"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                         <X className="w-8 h-8 text-brand-dark/20" />
                      </div>
                    </div>
                    <span className="mt-4 text-[9px] font-bold text-brand-dark text-center uppercase tracking-widest line-through opacity-60">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* D. Style Tips */}
            <div className="bg-white rounded-[3rem] p-10 border border-brand-gray shadow-sm transition-all duration-500 hover:shadow-xl">
              <h2 className="text-xl font-serif font-bold text-brand-dark mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/20 shadow-sm">
                  <Zap className="w-6 h-6 text-brand-pink" />
                </div>
                Curatorial Guidance
              </h2>
              <ul className="space-y-5">
                {results.styleTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-5 p-5 rounded-2xl bg-brand-cream/20 border border-transparent hover:border-brand-pink/20 hover:bg-white hover:shadow-lg transition-all duration-500 group">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5 group-hover:scale-110 transition-all duration-500 border border-brand-gray/50">
                      <Check className="w-4 h-4 text-brand-pink" />
                    </div>
                    <p className="text-brand-dark font-medium text-sm leading-relaxed opacity-80">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* E. Analysis Note */}
            <div className="bg-brand-cream/20 rounded-[3rem] p-10 border border-brand-pink/10 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-xl">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-pink/10 blur-[80px] rounded-full pointer-events-none"></div>
               <h2 className="text-xl font-serif font-bold text-brand-dark mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-brand-gray/50">
                  <Info className="w-6 h-6 text-brand-pink" />
                </div>
                Aesthetic Narrative
              </h2>
              <div className="relative pt-4">
                <span className="absolute -top-6 -left-4 text-8xl text-brand-pink opacity-10 font-serif">"</span>
                <p className="text-brand-dark font-medium leading-relaxed italic relative z-10 px-6 text-lg opacity-80">
                  {results.analysisNote}
                </p>
                <span className="absolute -bottom-12 -right-4 text-8xl text-brand-pink opacity-10 font-serif">"</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Try Again Button */}
          <div className="flex justify-center pt-12 pb-20">
            <button
              onClick={resetState}
              className="px-12 py-5 bg-brand-cream text-brand-dark border border-brand-gray rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-dark hover:text-white hover:border-brand-dark hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4"
            >
              <RefreshCcw className="w-5 h-5" />
              Analyze Bespoke Silhouette
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColourPaletteAnalyser;
