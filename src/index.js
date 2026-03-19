// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css';
import './styles/themes/light-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundary to catch any rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);