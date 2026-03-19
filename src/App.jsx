
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import QuizRouter from './components/quiz/QuizRouter';
import QuizResults from './components/quiz/QuizResults';
import DashboardPage from './pages/DashboardPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProductsPage from './pages/ProductsPage';
import GenderSelectionPage from './pages/GenderSelectionPage';
import GenderSelectionModal from './components/common/GenderSelectionModal';
 
import ColorfulDemo from './components/common/ColorfulDemo';
import EnhancedChatBot from './components/EnhancedChatBot';
import NotificationSystem from './components/common/NotificationSystem';
import SessionManager from './components/SessionManager';

import { useUserContext } from './context/UserContext';
import './App.css';

function App() {
  const { user, preferences } = useUserContext();
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Show gender modal only for new users who haven't selected gender
  useEffect(() => {
    if (user && !preferences?.gender) {
      const savedGender = localStorage.getItem('user_gender_preference');
      // Check if user has gender in their profile (for existing users)
      const userHasGender = user.gender && user.gender !== 'prefer-not-to-say';
      
      if (!savedGender && !userHasGender) {
        setShowGenderModal(true);
      }
    }
  }, [user, preferences?.gender]);

  const handleGenderSelect = (gender) => {
    setShowGenderModal(false);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<ColorfulDemo />} />
          
          {/* Auth routes - redirect to home if already logged in */}
          <Route 
            path="/login" 
            element={user ? <HomePage /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <HomePage /> : <RegisterPage />} 
          />
          
          {/* Public gender selection route */}
          <Route 
            path="/gender-selection" 
            element={<GenderSelectionPage />} 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <QuizRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/results" 
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard - accessible to all authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <EnhancedDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Enhanced ChatBot - show for authenticated users */}
        {user && <EnhancedChatBot />}

        {/* Real-time Notifications */}
        {user && <NotificationSystem />}

        {/* Session Manager - handle automatic logout */}
        {user && <SessionManager />}

        {/* Gender Selection Modal */}
        <GenderSelectionModal
          isOpen={showGenderModal}
          onClose={() => setShowGenderModal(false)}
          onGenderSelect={handleGenderSelect}
        />
      </Layout>
    </Router>
  );
}

export default App;