import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useUserContext } from '../../context/UserContext';
import QuizPage from '../../pages/QuizPage';

const QuizRouter = () => {
  const { quizCompleted } = useAppContext();
  const { userProfile } = useUserContext();
  
  // Always show QuizPage. QuizContainer will handle whether to show questions or results.
  // This allows users to see their results after completion and retake the quiz if they wish.
  return <QuizPage />;
  
  return <QuizPage />;
  
  return <QuizPage />;
};

export default QuizRouter;