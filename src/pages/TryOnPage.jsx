import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VirtualTryOn from '../components/VirtualTryOn';

const TryOnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productImage = searchParams.get('productImage') || undefined;
  const productName = searchParams.get('productName') || undefined;
  const productCategory = searchParams.get('productCategory') || undefined;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-gray/50 pb-12">
          <div>
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center gap-3 text-brand-sage font-bold text-[10px] uppercase tracking-[0.2em] hover:text-brand-dark transition-all mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Return to Collections
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-brand-pink uppercase tracking-[0.3em]">AI Dressing Room</p>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark tracking-tight">
                Virtual <span className="text-brand-pink italic">Try-On</span>
              </h1>
            </div>
            <p className="text-brand-sage font-medium text-base md:text-lg max-w-xl mt-6 leading-relaxed opacity-80">
              Visualize your future wardrobe in real-time. Our advanced AI synthesis brings high-end boutiques directly to your silhouette.
            </p>
          </div>
        </div>

        {/* Main Component */}
        <div className="mt-12 animate-fade-in">
          <VirtualTryOn 
            selectedProductImage={productImage} 
            selectedProductName={productName} 
            selectedProductCategory={productCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;
