// src/context/UserContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

const initialUserState = {
  user: null,
  userProfile: null,
  preferences: {
    notifications: true,
    emailUpdates: true,
    shareData: false,
    darkMode: true,
    currency: 'USD',
    language: 'en',
    gender: localStorage.getItem('user_gender_preference') || 'unspecified'
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
    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload
      };
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload)
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload
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
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_PURCHASE':
      return {
        ...state,
        purchases: [action.payload, ...state.purchases]
      };
    case 'ADD_TO_STYLE_HISTORY':
      return {
        ...state,
        styleHistory: [action.payload, ...state.styleHistory.slice(0, 49)] // Keep last 50 entries
      };
    case 'SET_PRIVACY_SETTINGS':
      return {
        ...state,
        privacySettings: { ...state.privacySettings, ...action.payload }
      };
    case 'ADD_SOCIAL_CONNECTION':
      return {
        ...state,
        socialConnections: [...state.socialConnections, action.payload]
      };
    case 'REMOVE_SOCIAL_CONNECTION':
      return {
        ...state,
        socialConnections: state.socialConnections.filter(conn => conn.id !== action.payload)
      };
    case 'LOGOUT_USER':
      return initialUserState;
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [storedUser, setStoredUser] = useLocalStorage('stylegenieUser', null);
  const [storedProfile, setStoredProfile] = useLocalStorage('stylegenieProfile', null);
  const [storedPreferences, setStoredPreferences] = useLocalStorage('stylegeniePreferences', null);
  const [storedFavorites, setStoredFavorites] = useLocalStorage('stylegenieFavorites', []);
  const [storedCart, setStoredCart] = useLocalStorage('stylegenieCart', []);

  // Load user data from localStorage on mount and check session validity (only run once)
  useEffect(() => {
    // Check if session is still valid
    const token = localStorage.getItem('access_token');
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    if (token && tokenTimestamp) {
      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

      if (tokenAge > maxTokenAge) {
        // Session expired, clear everything
        console.log('Session expired on app load, clearing data');
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_timestamp');
        localStorage.removeItem('auth_mode');
        localStorage.removeItem('user_gender_preference');
        setStoredUser(null);
        setStoredProfile(null);
        setStoredPreferences(null);
        setStoredFavorites([]);
        setStoredCart([]);
        return;
      }
    } else if (storedUser) {
      // User data exists but no valid token - clear everything
      console.log('No valid session token, clearing stored user data');
      setStoredUser(null);
      setStoredProfile(null);
      setStoredPreferences(null);
      setStoredFavorites([]);
      setStoredCart([]);
      return;
    }

    if (storedUser) {
      dispatch({ type: 'SET_USER', payload: storedUser });
    }
    if (storedProfile) {
      dispatch({ type: 'SET_USER_PROFILE', payload: storedProfile });
    }
    if (storedPreferences) {
      dispatch({ type: 'SET_PREFERENCES', payload: storedPreferences });
    }
    // Set favorites and cart directly instead of adding one by one
    if (storedFavorites.length > 0) {
      dispatch({ type: 'SET_FAVORITES', payload: storedFavorites });
    }
    if (storedCart.length > 0) {
      dispatch({ type: 'SET_CART', payload: storedCart });
    }
  }, []); // Empty dependency array - only run on mount

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (state.user) {
      setStoredUser(state.user);
    }
  }, [state.user, setStoredUser]);

  useEffect(() => {
    if (state.userProfile) {
      setStoredProfile(state.userProfile);
    }
  }, [state.userProfile, setStoredProfile]);

  useEffect(() => {
    setStoredPreferences(state.preferences);
  }, [state.preferences, setStoredPreferences]);

  useEffect(() => {
    setStoredFavorites(state.favorites);
  }, [state.favorites, setStoredFavorites]);

  useEffect(() => {
    setStoredCart(state.cart);
  }, [state.cart, setStoredCart]);

  const value = {
    ...state,
    dispatch,
    
    // User actions
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setUserProfile: (profile) => dispatch({ type: 'SET_USER_PROFILE', payload: profile }),
    updateUserProfile: (updates) => dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates }),
    
    // Preferences actions
    setPreferences: (preferences) => dispatch({ type: 'SET_PREFERENCES', payload: preferences }),
    updatePreference: (key, value) => dispatch({ 
      type: 'UPDATE_PREFERENCE', 
      payload: { key, value } 
    }),
    setGender: (gender) => {
      localStorage.setItem('user_gender_preference', gender);
      dispatch({ 
        type: 'UPDATE_PREFERENCE', 
        payload: { key: 'gender', value: gender } 
      });
    },
    
    // Favorites actions
    addToFavorites: (item) => dispatch({ type: 'ADD_TO_FAVORITES', payload: item }),
    removeFromFavorites: (id) => dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id }),
    isFavorite: (id) => state.favorites.some(item => item.id === id),
    
    // Cart actions
    addToCart: (item) => dispatch({ type: 'ADD_TO_CART', payload: item }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
    updateCartQuantity: (id, quantity) => dispatch({ 
      type: 'UPDATE_CART_QUANTITY', 
      payload: { id, quantity } 
    }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    getCartTotal: () => state.cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0),
    getCartItemCount: () => state.cart.reduce((count, item) => count + item.quantity, 0),
    
    // Purchase actions
    addPurchase: (purchase) => dispatch({ type: 'ADD_PURCHASE', payload: purchase }),
    
    // Style history actions
    addToStyleHistory: (entry) => dispatch({ type: 'ADD_TO_STYLE_HISTORY', payload: entry }),
    
    // Privacy settings actions
    setPrivacySettings: (settings) => dispatch({ type: 'SET_PRIVACY_SETTINGS', payload: settings }),
    
    // Social connections actions
    addSocialConnection: (connection) => dispatch({ type: 'ADD_SOCIAL_CONNECTION', payload: connection }),
    removeSocialConnection: (id) => dispatch({ type: 'REMOVE_SOCIAL_CONNECTION', payload: id }),
    
    // Authentication actions
    logout: () => {
      dispatch({ type: 'LOGOUT_USER' });
      setStoredUser(null);
      setStoredProfile(null);
      setStoredPreferences(null);
      setStoredFavorites([]);
      setStoredCart([]);

      // Clear all session-related data
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_timestamp');
      localStorage.removeItem('auth_mode');
      localStorage.removeItem('user_gender_preference');
      localStorage.removeItem('stylegenieUser');
      localStorage.removeItem('stylegenieProfile');
      localStorage.removeItem('stylegeniePreferences');
      localStorage.removeItem('stylegenieFavorites');
      localStorage.removeItem('stylegenieCart');

      // Clear any quiz or dashboard data
      localStorage.removeItem('user_quiz_results');
      localStorage.removeItem('user_recommendations');
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('user_inbox_cache');
      localStorage.removeItem('user_dashboard_state');
    },
    
    // Quiz actions
    submitQuiz: async (answers, profile) => {
      // 1. Update local state
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      
      // 2. Persist to master user record if logged in
      if (state.user?.email) {
        try {
          const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');
          if (users[state.user.email]) {
            users[state.user.email].profile = profile;
            users[state.user.email].quizAnswers = answers;
            localStorage.setItem('stylegenie_users', JSON.stringify(users));
            console.log('Quiz data persisted to permanent user record for:', state.user.email);
          }
        } catch (error) {
          console.error('Failed to persist quiz data to master record:', error);
        }
      }
      
      return { success: true };
    },
    
    // Utility functions
    isAuthenticated: () => !!state.user,
    hasProfile: () => !!state.userProfile,
    getUserDisplayName: () => state.user?.name || state.user?.email || 'Style Explorer',
    getProfileCompleteness: () => {
      if (!state.userProfile) return 0;
      const fields = ['personalityType', 'aesthetics', 'cloutScore'];
      const completedFields = fields.filter(field => state.userProfile[field]);
      return Math.round((completedFields.length / fields.length) * 100);
    }
  };

  console.log("UserContext value keys:", Object.keys(value));

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

// Custom hook for user authentication
export function useAuth() {
  const { user, setUser, logout, isAuthenticated } = useUserContext();
  
  const login = async (credentials) => {
    // Use local authentication directly
    try {
      const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');
      const user = users[credentials.email];

      if (!user || user.password !== credentials.password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      users[credentials.email] = user;
      localStorage.setItem('stylegenie_users', JSON.stringify(users));

      // Set user data
      const userData = {
        id: user.id,
        email: user.email,
        name: user.firstName || user.username || 'Style Explorer',
        username: user.username,
        gender: user.gender || 'prefer-not-to-say',
        profile: user.profile || {},
        createdAt: user.createdAt
      };

      const token = `local_${Date.now()}_${user.id}`;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_timestamp', Date.now().toString());
      localStorage.setItem('auth_mode', 'local');

      // Save gender preference
      if (user.gender) {
        localStorage.setItem('user_gender_preference', user.gender);
      }

      setUser(userData);
      
      // Restore user profile if it exists
      if (user.profile && Object.keys(user.profile).length > 0) {
        dispatch({ type: 'SET_USER_PROFILE', payload: user.profile });
        console.log('Restored user profile from permanent record:', user.profile);
      }
      
      return { success: true, user: userData };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };
  
  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('stylegenie_users') || '{}');

      // Check if user exists
      if (users[userData.email]) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        password: userData.password,
        gender: userData.gender || 'prefer-not-to-say',
        profile: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          gender: userData.gender || 'prefer-not-to-say'
        },
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      users[userData.email] = newUser;
      localStorage.setItem('stylegenie_users', JSON.stringify(users));

      // Set user data (without password)
      const userForState = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.firstName || newUser.username || 'Style Explorer',
        username: newUser.username,
        gender: newUser.gender,
        profile: newUser.profile,
        createdAt: newUser.createdAt
      };

      const token = `local_${Date.now()}_${newUser.id}`;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_timestamp', Date.now().toString());
      localStorage.setItem('auth_mode', 'local');

      // Save gender preference
      localStorage.setItem('user_gender_preference', newUser.gender);

      setUser(userForState);
      return { success: true, user: userForState };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };
  
  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticated()
  };
}