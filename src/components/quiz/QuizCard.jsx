import React, { useState, useEffect } from 'react';
import { Heart, SkipForward, Timer, Zap, X, Minus, Plus, Check } from 'lucide-react';

const QuizCard = ({ item, onAnswer, questionNumber, totalQuestions }) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setIsAnswered(false);
    setSelectedIndex(null);
  }, [item.id]);

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);
    
    setTimeout(() => {
      onAnswer(index, item.id);
    }, 50);
  };

  return (
    <div className="max-w-2xl mx-auto animate-scale-in">
      {/* Light Theme Card */}
      <div className="relative overflow-hidden bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(30,26,27,0.05)] border border-brand-gray p-10 md:p-16 group transition-all duration-700 hover:shadow-2xl hover:border-brand-pink/20">
        
        {/* Soft Background Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[3.5rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 blur-[100px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sage/5 blur-[100px] opacity-80"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 text-center">
          {/* Question Counter Bubble */}
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.4em] uppercase font-black text-brand-pink bg-brand-cream/50 px-8 py-3 border border-brand-pink/20 rounded-full shadow-sm">
              Inquiry {questionNumber} / {totalQuestions}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-12 px-2 lg:px-10">
            <h3 className="text-brand-dark font-serif font-bold text-3xl lg:text-5xl mb-6 leading-tight tracking-tight">
              {item.question}
            </h3>
            {/* Subtle Divider Line */}
            <div className="w-16 h-1.5 bg-brand-pink mx-auto rounded-full mt-4 opacity-40"></div>
          </div>

          {/* MCQ Options */}
          <div className="space-y-5 mb-4">
            {item.options?.map((option, index) => (
              <button 
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 transform flex items-center justify-between group/opt ${
                  selectedIndex === index 
                    ? 'bg-brand-dark border-brand-dark text-white shadow-2xl scale-[1.02]' 
                    : 'bg-white border-brand-gray text-brand-sage hover:border-brand-pink/30 hover:bg-brand-cream/30 hover:-translate-y-1'
                }`}
                style={{
                  opacity: (isAnswered && selectedIndex !== index) ? 0.4 : 1,
                  cursor: isAnswered ? 'not-allowed' : 'pointer'
                }}
              >
                <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-500 ${selectedIndex === index ? 'text-white' : 'text-brand-dark'}`}>
                  {option.text}
                </span>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    selectedIndex === index 
                      ? 'bg-brand-pink border-brand-pink rotate-12 scale-110 shadow-lg' 
                      : 'bg-white border-brand-gray group-hover/opt:border-brand-pink/50'
                  }`}
                >
                  {selectedIndex === index && (
                    <Check className="w-5 h-5 text-white stroke-[4px]" />
                  )}
                  {selectedIndex !== index && (
                    <div className="w-2 h-2 rounded-full bg-brand-gray group-hover/opt:bg-brand-pink transition-colors" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <p className="mt-12 text-[10px] font-black text-brand-sage uppercase tracking-[0.4em] opacity-40">
            Signature Aesthetic Mapping Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;