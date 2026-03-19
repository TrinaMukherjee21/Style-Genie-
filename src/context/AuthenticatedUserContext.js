// src/context/AuthenticatedUserContext.js - Updated with MongoDB authentication
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const UserContext = createContext();

const initialUserState = {
  user: null,
  userProfile: null,
  loading: true,
  preferences: {
    notifications: true,
    emailUpdates: true,
    shareData: false,
    darkMode: true,
    currency: 'USD',
    language: 'en',
    gender: null // 'male', 'female', 'non-binary', 'prefer-not-to-say'
  },
  favorites: [],
  cart: [],
  purchases: [],
  styleHistory: [],
  socialConnections: [],
  privacySettings: {
    profileVisible: true,
    showPurchases: false,
    allowRecommendations: true
  }
};

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload,
        loading: false 
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        user: null, 
        userProfile: null,
        loading: false 
      };
    case 'LOGOUT':
      return { 
        ...initialUserState,
        loading: false 
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return { 
        ...state, 
        userProfile: { ...state.userProfile, ...action.payload } 
      };
    case 'SET_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    case 'SET_GENDER':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          gender: action.payload
        }
      };
    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.payload.key]: action.payload.value
        }
      };
    case 'ADD_TO_FAVORITES':
      const existingFav = state.favorites.find(item => item.id === action.payload.id);
      if (existingFav) return state;
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload)
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load saved gender preference
        const savedGender = localStorage.getItem('user_gender_preference');
        if (savedGender) {
          dispatch({ type: 'SET_GENDER', payload: savedGender });
        }

        const token = localStorage.getItem('access_token');
        const tokenTimestamp = localStorage.getItem('token_timestamp');

        if (token && token.startsWith('local_')) {
          // Check if token is expired (4 hours = 4 * 60 * 60 * 1000 ms)
          const tokenAge = Date.now() - parseInt(tokenTimestamp || '0');
          const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

          if (tokenAge > maxTokenAge) {
            console.log('Session expired, logging out');
            logout();
            return;
          }

          // Try to restore user from localStorage
          const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');
          const userEmail = Object.keys(users).find(email => {
            const user = users[email];
            return token.includes(user.id);
          });

          if (userEmail) {
            const user = users[userEmail];

            // Check if user account should expire (30 days without login)
            const lastLogin = new Date(user.lastLogin || user.createdAt);
            const daysSinceLogin = (Date.now() - lastLogin.getTime()) / (24 * 60 * 60 * 1000);

            if (daysSinceLogin > 30) {
              console.log('Account inactive for too long, logging out');
              logout();
              return;
            }

            const userData = {
              id: user.id,
              email: user.email,
              username: user.username,
              profile: user.profile || {}
            };
            dispatch({ type: 'LOGIN_SUCCESS', payload: userData });

            // Update last active timestamp
            user.lastActive = new Date().toISOString();
            users[userEmail] = user;
            localStorage.setItem('stylegenie_users', JSON.stringify(users));
          } else {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();

    // Set up session check interval (check every 5 minutes)
    const sessionCheckInterval = setInterval(() => {
      checkSessionValidity();
    }, 5 * 60 * 1000);

    return () => clearInterval(sessionCheckInterval);
  }, []);

  // Authentication functions
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Use local authentication
      const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');
      const user = users[email];
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Update last login
      user.lastLogin = new Date().toISOString();
      users[email] = user;
      localStorage.setItem('stylegenie_users', JSON.stringify(users));
      
      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile || {}
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      
      // Apply pending gender selection if exists
      const pendingGender = localStorage.getItem('pending_gender_selection');
      if (pendingGender) {
        dispatch({ type: 'SET_GENDER', payload: pendingGender });
        localStorage.removeItem('pending_gender_selection');
      }
      
      const token = `local_${Date.now()}_${user.id}`;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_timestamp', Date.now().toString());

      return { user: userData };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');
      
      // Check if user exists
      if (users[userData.email]) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        password: userData.password,
        profile: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        },
        createdAt: new Date().toISOString()
      };
      
      users[userData.email] = newUser;
      localStorage.setItem('stylegenie_users', JSON.stringify(users));
      
      const userForState = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        profile: newUser.profile
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userForState });
      
      // Apply pending gender selection if exists
      const pendingGender = localStorage.getItem('pending_gender_selection');
      if (pendingGender) {
        dispatch({ type: 'SET_GENDER', payload: pendingGender });
        localStorage.removeItem('pending_gender_selection');
      }
      
      const token = `local_${Date.now()}_${newUser.id}`;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_timestamp', Date.now().toString());

      return { user: userForState };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    // Clear user-specific data from localStorage
    const userSpecificKeys = [
      'user_quiz_results',
      'user_recommendations',
      'user_preferences',
      'user_inbox_cache',
      'user_dashboard_state',
      'access_token',
      'token_timestamp'
    ];

    userSpecificKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    dispatch({ type: 'LOGOUT' });
  };

  // Session validation function
  const checkSessionValidity = () => {
    const token = localStorage.getItem('access_token');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (!token || !tokenTimestamp) {
      return;
    }

    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

    if (tokenAge > maxTokenAge) {
      console.log('Session expired during use, logging out');
      logout();
    }
  };

  // Function to extend session when user is active
  const extendSession = () => {
    const token = localStorage.getItem('access_token');
    if (token && state.user) {
      localStorage.setItem('token_timestamp', Date.now().toString());
      console.log('Session extended due to user activity');
    }
  };

  // Comprehensive user data loader
  const loadCompleteUserData = async (user) => {
    console.log('🚀 Loading complete user data for:', user.email);
    
    try {
      // 1. Load Quiz Results
      await loadUserQuizResults(user);
      
      // 2. Load User Recommendations
      await loadUserRecommendations(user);
      
      // 3. Load User Preferences  
      await loadUserPreferences(user);
      
      // 4. Trigger Inbox Generation
      await triggerInboxSetup(user);
      
      console.log('✅ Complete user data loading finished');
    } catch (error) {
      console.error('❌ Error in comprehensive data loading:', error);
    }
  };

  const loadUserQuizResults = async (user) => {
    try {
      console.log('📝 Loading quiz results...');
      
      if (user.quizResult) {
        console.log('✅ Found quiz results in user data:', user.quizResult);
        dispatch({ type: 'SET_USER_PROFILE', payload: user.quizResult.styleProfile });
        
        // Save to localStorage for offline access
        localStorage.setItem('user_quiz_results', JSON.stringify(user.quizResult));
      } else {
        // Try localStorage fallback
        const savedQuizResults = localStorage.getItem('user_quiz_results');
        if (savedQuizResults) {
          console.log('📋 Loading quiz results from localStorage fallback');
          const quizData = JSON.parse(savedQuizResults);
          dispatch({ type: 'SET_USER_PROFILE', payload: quizData });
        } else {
          console.log('❓ No quiz results found - user needs to take quiz');
        }
      }
    } catch (error) {
      console.error('❌ Error loading quiz results:', error);
    }
  };

  const loadUserRecommendations = async (user) => {
    try {
      console.log('🎯 Loading user recommendations...');
      
      // Check if we have cached recommendations
      const cachedRecs = localStorage.getItem(`user_recommendations_${user._id || user.id}`);
      if (cachedRecs) {
        const recommendations = JSON.parse(cachedRecs);
        // Check if recommendations are recent (less than 24 hours old)
        const cacheTime = localStorage.getItem(`user_recommendations_time_${user._id || user.id}`);
        const isRecent = cacheTime && (Date.now() - parseInt(cacheTime)) < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          console.log('✅ Using cached recommendations');
          // Set recommendations in context if available
          if (window.setRecommendations) {
            window.setRecommendations(recommendations);
          }
          return;
        }
      }
      
      console.log('🔄 Will fetch fresh recommendations when dashboard loads');
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
    }
  };

  const loadUserPreferences = async (user) => {
    try {
      console.log('⚙️ Loading user preferences...');
      
      const savedPrefs = localStorage.getItem(`user_preferences_${user._id || user.id}`);
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        console.log('✅ User preferences loaded from cache');
      }
    } catch (error) {
      console.error('❌ Error loading preferences:', error);
    }
  };

  const triggerInboxSetup = async (user) => {
    try {
      console.log('📬 Setting up inbox...');
      
      // Set a flag that the dashboard can check to auto-generate messages
      localStorage.setItem('trigger_inbox_setup', 'true');
      localStorage.setItem('inbox_setup_user', JSON.stringify(user));
      
      console.log('✅ Inbox setup triggered');
    } catch (error) {
      console.error('❌ Error setting up inbox:', error);
    }
  };

  // Quiz functions
  const submitQuiz = async (quizData, styleProfile) => {
    try {
      const response = await authService.submitQuiz(quizData, styleProfile);
      
      // Update user profile with quiz results - use styleProfile data
      const quizResult = {
        quizResult: { quizData, styleProfile },
        personalityType: styleProfile.personalityType,
        primaryAesthetic: styleProfile.primaryAesthetic,
        secondaryAesthetics: styleProfile.secondaryAesthetics,
        aesthetics: styleProfile.aesthetics,
        cloutScore: styleProfile.cloutScore,
        confidence: styleProfile.confidence
      };
      
      dispatch({ 
        type: 'UPDATE_USER_PROFILE', 
        payload: quizResult
      });
      
      // Also save to localStorage for persistence with user ID
      localStorage.setItem('user_quiz_results', JSON.stringify(quizResult));
      localStorage.setItem(`user_quiz_results_${user._id || user.id}`, JSON.stringify(quizResult));
      
      return response;
    } catch (error) {
      console.error('Quiz submission error:', error);
      throw error;
    }
  };

  // Favorites functions (with backend sync)
  const addToFavorites = async (product) => {
    try {
      // Optimistic update
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
      
      // Sync with backend
      await authService.addToFavorites(product);
    } catch (error) {
      // Revert optimistic update on error
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      // Optimistic update
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
      
      // Sync with backend
      await authService.removeFromFavorites(productId);
    } catch (error) {
      // Revert optimistic update on error (would need the full product object)
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (productId) => {
    return state.favorites.some(item => item.id === productId || item.productId === productId);
  };

  // Cart functions
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // User profile functions
  const updateUserProfile = (updates) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
  };

  const updatePreference = (key, value) => {
    dispatch({ type: 'UPDATE_PREFERENCE', payload: { key, value } });
  };

  const setGender = (gender) => {
    dispatch({ type: 'SET_GENDER', payload: gender });
    // Save to localStorage for persistence
    localStorage.setItem('user_gender_preference', gender);
  };

  // Helper functions
  const getUserDisplayName = () => {
    if (!state.user) return 'User';
    return state.user.profile?.firstName || state.user.username || state.user.email.split('@')[0];
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (!token || !tokenTimestamp || !state.user) {
      return false;
    }

    // Check if token is still valid
    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

    if (tokenAge > maxTokenAge) {
      logout();
      return false;
    }

    return true;
  };

  const value = {
    // State
    user: state.user,
    userProfile: state.userProfile,
    loading: state.loading,
    preferences: state.preferences,
    favorites: state.favorites,
    cart: state.cart,
    purchases: state.purchases,
    styleHistory: state.styleHistory,
    socialConnections: state.socialConnections,
    privacySettings: state.privacySettings,

    // Authentication functions
    login,
    register,
    logout,
    isAuthenticated,

    // Quiz functions
    submitQuiz,

    // Favorites functions
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    // User profile functions
    updateUserProfile,
    updatePreference,
    setGender,

    // Session management functions
    checkSessionValidity,
    extendSession,

    // Helper functions
    getUserDisplayName
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};