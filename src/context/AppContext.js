// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

const initialState = {
  currentPage: 'home',
  recommendations: [],
  isLoading: false,
  error: null,
  notifications: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'ADD_RECOMMENDATION':
      return { 
        ...state, 
        recommendations: [action.payload, ...state.recommendations] 
      };
    case 'REMOVE_RECOMMENDATION':
      return { 
        ...state, 
        recommendations: state.recommendations.filter(rec => rec.id !== action.payload) 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { 
          id: Date.now(), 
          ...action.payload 
        }] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(notif => notif.id !== action.payload) 
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedRecommendations, setStoredRecommendations] = useLocalStorage('stylegenieRecommendations', []);
  // Initialize from localStorage only once on mount
  useEffect(() => {
    // Load recommendations
    if (storedRecommendations.length > 0) {
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: storedRecommendations });
    }
  }, []); // Run only once on mount

  const value = {
    ...state,
    dispatch,
    
    // Page navigation actions
    setCurrentPage: (page) => dispatch({ type: 'SET_CURRENT_PAGE', payload: page }),
    
    // Recommendations actions
    setRecommendations: (recs) => dispatch({ type: 'SET_RECOMMENDATIONS', payload: recs }),
    addRecommendation: (rec) => dispatch({ type: 'ADD_RECOMMENDATION', payload: rec }),
    removeRecommendation: (id) => dispatch({ type: 'REMOVE_RECOMMENDATION', payload: id }),
    
    // Loading and error actions
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    
    // Notification actions
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
    
    // App reset
    resetApp: () => dispatch({ type: 'RESET_APP' })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}