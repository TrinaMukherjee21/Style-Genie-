import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import QuizCard from './QuizCard';
import ProgressBar from './ProgressBar';
import QuizResults from './QuizResults';

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
    <div className="min-h-screen pt-16 bg-brand-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-pink-900/20 to-[#c0a0e6]/5/30"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 text-brand-gold opacity-40 ">🧬</div>
      <div className="absolute top-32 right-20 w-6 h-6 text-brand-goldLight opacity-40 " style={{animationDelay: '1s'}}>✨</div>
      <div className="absolute bottom-40 left-20 w-10 h-10 text-brand-gold opacity-40 " style={{animationDelay: '2s'}}>⚡</div>
      <div className="absolute top-1/2 right-10 w-12 h-12 text-brand-gold opacity-30 " style={{animationDelay: '3s'}}>💫</div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-8 w-full z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 mb-4">
              <span className="text-2xl">🧬</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-brand-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Style DNA Quiz
            </h2>
            <p className="text-gray-100 text-lg mb-6 max-w-2xl mx-auto font-body font-medium leading-relaxed brightness-110">
              React fast, think less. We're reading your subconscious style preferences to decode your unique aesthetic DNA.
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
          <div className="mb-8">
            <QuizCard
              item={currentItem}
              onAnswer={handleQuizAnswer}
              questionNumber={currentQuizItem + 1}
              totalQuestions={totalItems}
            />
          </div>
        )}

        {/* Enhanced Quick Tips */}
        <div className="mt-8">
          <div className="card-premium backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/30 shadow-lg ">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body">Trust Your Gut</h4>
                  <p className="text-gray-300 text-sm">First instinct = authentic you</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body">Speed Matters</h4>
                  <p className="text-gray-300 text-sm">Quick decisions reveal truth</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-white font-medium font-body">No Wrong Answers</h4>
                  <p className="text-gray-300 text-sm">Every choice is valid</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm font-medium font-body flex items-center justify-center space-x-2">
            <span className="text-brand-gold font-bold">{currentQuizItem + 1}</span> 
            <span className="text-gray-400">of</span>
            <span className="text-brand-gold font-bold">{totalItems}</span> 
            <span className="text-gray-400">items rated</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;