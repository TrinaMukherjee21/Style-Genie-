import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's the specific object rendering error
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('Object rendering error detected. This is likely due to trying to render an object directly in JSX.');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center pt-16">
          <div className="text-center glass-effect p-12 rounded-3xl border-2 border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">We encountered an error while loading your dashboard.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-primary px-6 py-3 rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;