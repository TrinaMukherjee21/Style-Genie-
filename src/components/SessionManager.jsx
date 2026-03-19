// src/components/SessionManager.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const SessionManager = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const hasShownExpiryAlert = useRef(false);

  useEffect(() => {
    if (!user) return;

    // Check session validity on mount and every minute
    const checkSessionValidity = () => {
      const token = localStorage.getItem('access_token');
      const tokenTimestamp = localStorage.getItem('token_timestamp');

      if (!token || !tokenTimestamp) {
        console.log('No token found, logging out');
        logout();
        navigate('/login');
        return false;
      }

      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

      // If session expired, logout
      if (tokenAge > maxTokenAge) {
        if (!hasShownExpiryAlert.current) {
          hasShownExpiryAlert.current = true;
          alert('Your session has expired. Please log in again.');
        }
        logout();
        navigate('/login');
        return false;
      }

      return true;
    };

    // Initial check
    if (!checkSessionValidity()) return;

    // Check session every minute
    const checkInterval = setInterval(() => {
      checkSessionValidity();
    }, 60 * 1000);

    // Activity events that should extend the session
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    let lastActivity = Date.now();

    const handleActivity = () => {
      const now = Date.now();
      const token = localStorage.getItem('access_token');
      const tokenTimestamp = localStorage.getItem('token_timestamp');

      if (!token || !tokenTimestamp) return;

      // Check if session is still valid before extending
      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const maxTokenAge = 4 * 60 * 60 * 1000; // 4 hours

      if (tokenAge > maxTokenAge) {
        // Session expired during use
        checkSessionValidity();
        return;
      }

      // Only extend session if it's been more than 5 minutes since last extension
      if (now - lastActivity > 5 * 60 * 1000) {
        localStorage.setItem('token_timestamp', Date.now().toString());
        console.log('Session extended due to user activity');
        lastActivity = now;
      }
    };

    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(checkInterval);
      hasShownExpiryAlert.current = false;
    };
  }, [user, logout, navigate]);

  // This component doesn't render anything visible
  return null;
};

export default SessionManager;