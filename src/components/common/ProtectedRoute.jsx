// src/components/common/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireQuiz = false }) => {
  const { user, loading, userProfile, logout } = useUserContext();
  const navigate = useNavigate();

  // Validate session on every protected route access
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (!token || !tokenTimestamp) {
      if (user) {
        // User state exists but no token - force logout
        logout();
        navigate('/login', { replace: true });
      }
      return;
    }

    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

    if (tokenAge > maxTokenAge) {
      // Session expired
      console.log('Session expired in ProtectedRoute, logging out');
      logout();
      navigate('/login', { replace: true });
    }
  }, [user, logout, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="purple" />
          <p className="text-white mt-4 font-bold">Authenticating with Aura Style...</p>
        </div>
      </div>
    );
  }

  // Panic Guard: If user is missing but we just started, wait a moment before redirecting
  // This prevents flickering redirects during state updates
  if (!user && !loading) {
     const token = localStorage.getItem('access_token');
     if (token) {
       return (
         <div className="min-h-screen bg-brand-navy flex items-center justify-center">
           <LoadingSpinner size="lg" color="purple" />
         </div>
       );
     }
  }

  // Check if user is authenticated
  if (!user) {
    if (!loading) {
      console.warn('ProtectedRoute: user is null while loading is false. Redirecting to /login');
    }
    return <Navigate to="/login" replace />;
  }

  // Check if quiz completion is required (only for specific routes)
  if (requireQuiz && !userProfile?.personalityType && !userProfile?.primaryAesthetic) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center pt-16">
        <div className="text-center glass-effect p-12 rounded-3xl border-2 border-purple-500/30 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-white mb-4 font-heading">Quiz Required!</h2>
          <p className="text-gray-300 font-body mb-6">
            Please complete the Style Quiz to access this feature.
          </p>
          <button
            onClick={() => window.location.href = '/quiz'}
            className="bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Take Quiz Now
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;