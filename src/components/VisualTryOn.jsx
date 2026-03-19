import { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Wand2, X, Download, Share2 } from 'lucide-react';
import { imageAnalyzer } from '../chatbot/imageAnalysis';
import API_BASE_URL from '../config';

const VisualTryOn = ({ isOpen, onClose }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzedColors, setAnalyzedColors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    
    try {
      // Try backend analysis first
      const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalyzedColors(result.colors);
        setSuggestions(result.suggestions);
      } else {
        throw new Error('Backend analysis failed');
      }
    } catch (error) {
      console.log('Using frontend analysis:', error);
      // Fallback to frontend analysis
      const img = new Image();
      img.onload = () => {
        const colors = imageAnalyzer.extractColors(img);
        setAnalyzedColors(colors);
        const suggestions = imageAnalyzer.generateSuggestions(colors);
        setSuggestions(suggestions);
        setIsAnalyzing(false);
      };
      img.src = imageData;
      return;
    }
    
    setIsAnalyzing(false);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[90vh] bg-gradient-to-br from-dark-primary via-dark-surface to-dark-card rounded-xl border border-dark-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-dark-border bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent "></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-neon-glow">
                <Wand2 className="w-5 h-5 text-white " />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Visual Try-On Studio</h2>
                <p className="text-white/80 text-sm">Upload your outfit and get AI-powered styling suggestions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Upload Section */}
          <div className="w-1/2 p-6 border-r border-dark-border">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4">Upload Your Outfit</h3>
              
              {!uploadedImage ? (
                <div 
                  className="flex-1 border-2 border-dashed border-neon-purple/30 rounded-xl bg-gradient-to-br from-neon-purple/5 to-neon-pink/5 flex flex-col items-center justify-center cursor-pointer hover:border-neon-purple/50 transition-all duration-300 relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent "></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-neon-glow">
                      <Upload className="w-8 h-8 text-brand-gold" />
                    </div>
                    <p className="text-white font-medium mb-2">Drop your outfit image here</p>
                    <p className="text-gray-400 text-sm">or click to browse files</p>
                    <p className="text-gray-500 text-xs mt-2">Supports JPG, PNG, WebP</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded outfit" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Color Analysis */}
              {analyzedColors.length > 0 && (
                <div className="mt-4 p-4 bg-dark-card rounded-xl border border-dark-border">
                  <h4 className="text-white font-medium mb-3">Detected Colors</h4>
                  <div className="flex gap-2">
                    {analyzedColors.map((colorData, index) => (
                      <div key={index} className="flex-1 text-center">
                        <div 
                          className="w-full h-8 rounded-lg mb-2 border border-dark-border"
                          style={{ backgroundColor: colorData.color }}
                        ></div>
                        <p className="text-xs text-gray-300">{colorData.name}</p>
                        <p className="text-xs text-gray-500">{colorData.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="w-1/2 p-6">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4">AI Styling Suggestions</h3>
              
              {isAnalyzing ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4 ">
                      <Sparkles className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <p className="text-white font-medium">Analyzing your outfit...</p>
                    <p className="text-gray-400 text-sm">Finding perfect matches</p>
                  </div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="flex-1 overflow-y-auto space-y-4">
                  {suggestions.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-dark-card to-dark-surface rounded-xl border border-dark-border p-4 hover:border-neon-purple/30 transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="w-20 h-24 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-lg flex items-center justify-center">
                          <div className="w-16 h-20 bg-gray-600 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-brand-gold font-bold mb-2">${item.price}</p>
                          <p className="text-gray-300 text-sm mb-2">{item.matchReason}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-dark-border rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-neon-purple to-neon-pink h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.compatibility}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-brand-gold font-medium">{item.compatibility}% match</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 bg-gradient-to-r from-neon-purple to-neon-pink text-white py-2 px-4 rounded-lg hover:from-neon-purple/80 hover:to-neon-pink/80 transition-all duration-200 text-sm font-medium">
                          Try This Combo
                        </button>
                        <button className="px-4 py-2 bg-brand-dark text-gray-300 rounded-lg hover:bg-dark-card transition-colors border border-dark-border">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Upload an outfit to get AI-powered suggestions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualTryOn;