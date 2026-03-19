import React, { useState, useEffect } from 'react';
import { Heart, SkipForward, Timer, Zap, X, Minus, Plus } from 'lucide-react';

const QuizCard = ({ item, onAnswer, questionNumber, totalQuestions }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setTimeLeft(10);
    setIsAnswered(false);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isAnswered) {
            handleAnswer(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (event) => {
      if (isAnswered) return;
      
      if (event.key === '1') {
        handleAnswer('hate');
      } else if (event.key === '2') {
        handleAnswer('dislike');
      } else if (event.key === '3') {
        handleAnswer('like');
      } else if (event.key === '4') {
        handleAnswer('love');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [item.id, isAnswered]);

  const handleAnswer = (preference) => {
    if (isAnswered) return;
    setIsAnswered(true);
    onAnswer(preference, item.id);
  };

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      {/* Timer */}
      <div className="flex items-center justify-center mb-6">
        <div className="glass-effect rounded-full px-6 py-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
          <div className="flex items-center space-x-3">
            <Timer className={`w-5 h-5 ${timeLeft <= 3 ? 'text-red-400' : 'text-brand-gold'}`} />
            <span className={`font-mono text-xl font-bold transition-colors duration-300 ${timeLeft <= 3 ? 'text-red-400' : 'text-brand-gold'}`}>
              {timeLeft}s
            </span>
            <Zap className="w-5 h-5 text-yellow-400 " />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-[#d4af37]/5 rounded-3xl shadow-2xl border border-purple-200 p-8 group backdrop-blur-sm">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full blur-xl "></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-[#eacc6e]/5 rounded-full blur-lg "></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-[#eacc6e]/20 border border-[#eacc6e]/20 to-[#eacc6e]/5 rounded-full blur-2xl opacity-20 "></div>
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0  opacity-10"></div>
        
        {/* Content Container */}
        <div className="relative z-10">
        {/* Question Counter */}
        <div className="text-center mb-4">
          <span className="text-sm font-semibold text-purple-600 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-200">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative mb-6 overflow-hidden rounded-2xl group shadow-lg">
          <img 
            src={item.image}
            alt={item.type}
            className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop&q=80';
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Item Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-filter backdrop-blur-lg rounded-xl p-4 border border-purple-200 shadow-lg">
              <h3 className="text-gray-900 font-bold text-xl mb-2">{item.type}</h3>
              <p className="text-gray-700 text-sm mb-3 font-medium">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags?.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button 
            onClick={() => handleAnswer('hate')}
            disabled={isAnswered}
            className="bg-gradient-to-r from-red-500 to-[#eacc6e]/5 hover:from-red-600 hover:to-[#eacc6e]/5 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/30"
          >
            <X className="w-5 h-5" />
            <span>Hate</span>
          </button>
          
          <button 
            onClick={() => handleAnswer('dislike')}
            disabled={isAnswered}
            className="bg-gradient-to-r from-[#c0a0e6]/20 border border-[#c0a0e6]/20 to-[#eacc6e]/5 hover:from-[#c0a0e6]/20 border border-[#c0a0e6]/20 hover:to-[#eacc6e]/5 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/30"
          >
            <Minus className="w-5 h-5" />
            <span>Dislike</span>
          </button>
          
          <button 
            onClick={() => handleAnswer('like')}
            disabled={isAnswered}
            className="bg-gradient-to-r from-blue-500 to-[#eacc6e]/5 hover:from-blue-600 hover:to-[#eacc6e]/5 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Like</span>
          </button>
          
          <button 
            onClick={() => handleAnswer('love')}
            disabled={isAnswered}
            className="bg-gradient-to-r from-[#eacc6e]/20 border border-[#eacc6e]/20 to-[#eacc6e]/5 hover:from-[#eacc6e]/20 border border-[#eacc6e]/20 hover:to-[#eacc6e]/5 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/30"
          >
            <Heart className="w-5 h-5" />
            <span>Love</span>
          </button>
        </div>

        {/* Enhanced Keyboard Hints */}
        <div className="mt-4 flex justify-center space-x-4 text-gray-100 text-sm font-semibold brightness-110">
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono text-white border border-white/20 shadow-sm">1</kbd>
            <span>Hate</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono text-white border border-white/20 shadow-sm">2</kbd>
            <span>Dislike</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono text-white border border-white/20 shadow-sm">3</kbd>
            <span>Like</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono text-white border border-white/20 shadow-sm">4</kbd>
            <span>Love</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;