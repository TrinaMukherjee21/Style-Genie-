import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import QuizCard from './QuizCard';
import ProgressBar from './ProgressBar';
import QuizResults from './QuizResults';
import { Sparkles, Brain, Zap, Target } from 'lucide-react';

const QuizContainer = () => {
  const {
    quizProgress,
    currentQuizItem,
    currentItem,
    totalItems,
    handleQuizAnswer,
    isQuizComplete
  } = useQuiz();

  if (isQuizComplete) {
    return <QuizResults />;
  }

  return (
    <div className="min-h-screen pt-24 bg-white relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-sage/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Floating Background Icons */}
      <div className="absolute top-40 right-24 text-brand-pink/20 animate-pulse" style={{animationDuration: '4s'}}>
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute bottom-60 left-24 text-brand-sage/10 animate-pulse" style={{animationDuration: '6s'}}>
        <Zap className="w-16 h-16" />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-6 py-12 w-full z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-brand-cream border border-brand-pink/20 shadow-inner mb-8 relative group">
              <div className="absolute inset-0 bg-brand-pink/10 rounded-[2.5rem] animate-ping opacity-20"></div>
              <span className="text-4xl relative z-10 group-hover:scale-125 transition-transform duration-700">🧬</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-brand-dark tracking-tight leading-tight">
              Aesthetic <span className="text-brand-pink italic">DNA</span>
            </h2>
            <p className="text-brand-sage text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[0.2em] opacity-60">
              React intuitively. We're decoding your subconscious style narrative.
            </p>
          </div>
          
          <ProgressBar 
            progress={quizProgress} 
            currentItem={currentQuizItem + 1} 
            totalItems={totalItems} 
          />
        </div>

        {/* Quiz Card */}
        {currentItem && (
          <div className="mb-16">
            <QuizCard
              key={currentItem.id}
              item={currentItem}
              onAnswer={handleQuizAnswer}
              questionNumber={currentQuizItem + 1}
              totalQuestions={totalItems}
            />
          </div>
        )}

        {/* Enhanced Quick Tips */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-md rounded-[3.5rem] p-12 border border-brand-gray shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-pink/5 blur-3xl rounded-full"></div>
            <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
              <div className="flex flex-col items-center space-y-5">
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/10 shadow-sm group hover:scale-110 transition-transform duration-500">
                  <Brain className="w-8 h-8 text-brand-pink" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-serif font-bold text-lg mb-2">Trust Your Gut</h4>
                  <p className="text-brand-sage text-xs font-black uppercase tracking-widest opacity-60">First instinct = authenticity</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-5">
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/10 shadow-sm group hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8 text-brand-pink" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-serif font-bold text-lg mb-2">Speed Matters</h4>
                  <p className="text-brand-sage text-xs font-black uppercase tracking-widest opacity-60">Quick decisions reveal truth</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-5">
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center border border-brand-pink/10 shadow-sm group hover:scale-110 transition-transform duration-500">
                  <Target className="w-8 h-8 text-brand-pink" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-serif font-bold text-lg mb-2">No Wrong Answers</h4>
                  <p className="text-brand-sage text-xs font-black uppercase tracking-widest opacity-60">Every choice is valid</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-4 bg-brand-dark px-10 py-5 rounded-full shadow-2xl border border-white/10 group">
            <span className="text-white font-serif font-bold text-xl">{currentQuizItem + 1}</span> 
            <span className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">of</span>
            <span className="text-white font-serif font-bold text-xl">{totalItems}</span> 
            <span className="text-brand-pink font-black text-[10px] uppercase tracking-[0.3em] ml-4 animate-pulse">Encoded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;