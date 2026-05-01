
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import ProductsPage from './pages/ProductsPage';
import LookbookPage from './pages/LookbookPage';
import GenderSelectionPage from './pages/GenderSelectionPage';
import GenderSelectionModal from './components/common/GenderSelectionModal';
import StudioPage from './pages/StudioPage';
import TryOnPage from './pages/TryOnPage';
import ColourAnalysisPage from './pages/ColourAnalysisPage';


 
import ColorfulDemo from './components/common/ColorfulDemo';
import StyleBotIframe from './components/StyleBotIframe';
import NotificationSystem from './components/common/NotificationSystem';
import SessionManager from './components/SessionManager';
import ErrorBoundary from './components/common/ErrorBoundary';

import { useUserContext } from './context/UserContext';
import './App.css';

import API_BASE_URL from './config';

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

  // Fetch and cache the fresh DummyJSON catalog globally for fallbacks
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/catalog`);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('stylegenie_catalog', JSON.stringify(data));
          console.log('✅ Global catalog cached for fallbacks');
        }
      } catch (e) {
        console.error('Failed to fetch catalog:', e);
      }
    };
    fetchCatalog();
  }, []);

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
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsPage />
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
            path="/lookbook" 
            element={
              <ProtectedRoute>
                <LookbookPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tryon" 
            element={
              <ProtectedRoute>
                <TryOnPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/colour-analysis" 
            element={
              <ProtectedRoute>
                <ColourAnalysisPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/studio" 
            element={
              <ProtectedRoute>
                <TryOnPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Premium Aura Style AI Counselor - Now embedded via Iframe */}
        {user && <StyleBotIframe />}

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