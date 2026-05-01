import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { setError('Please fill in all fields'); return; }
    setIsLoading(true); setError('');
    try {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) { navigate('/'); }
      else { setError(result.error || 'Login failed. Please try again.'); }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const result = await login({ email: 'demo@stylegenie.com', name: 'Demo User' });
      if (result.success) { navigate('/'); }
    } catch (err) { setError('Demo login failed'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-24 md:pt-32 pb-12">
      {/* Premium bloom - Using new palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-brand-pink/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="max-w-md w-full mx-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-cream border border-brand-pink/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Sparkles className="w-10 h-10 text-brand-pink" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">Welcome Back</h2>
          <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Your Atelier experience awaits</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 border border-brand-gray shadow-[0_25px_60px_rgba(137,162,147,0.1)] transition-all duration-500 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">
                Email or Username
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4.5 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold"
                  placeholder="Email or Username" required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input
                  type={showPassword ? 'text' : 'password'} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4.5 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold"
                  placeholder="Enter password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-brand-dark opacity-60 hover:text-brand-pink hover:opacity-100 transition-all">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-4 animate-shake">
                <p className="text-brand-pink text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={isLoading}
              className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 text-xs uppercase tracking-[0.2em]">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize Experience</span>
                  <ArrowRight className="w-5 h-5 text-brand-pink" />
                </>
              )}
            </button>

            <div className="flex items-center gap-6 py-2">
              <div className="h-px bg-brand-gray/50 flex-grow"></div>
              <span className="text-[10px] font-bold text-brand-sage opacity-40 uppercase tracking-widest">or</span>
              <div className="h-px bg-brand-gray/50 flex-grow"></div>
            </div>

            {/* Demo Login */}
            <button type="button" onClick={handleDemoLogin} disabled={isLoading}
              className="w-full bg-brand-cream/50 text-brand-dark py-4 rounded-2xl font-bold hover:bg-brand-pink hover:text-white border border-brand-gray/50 transition-all duration-500 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]">
              Explore Atelier Preview
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-brand-dark text-sm font-bold">
              New to the Boutique?{' '}
              <Link to="/register" className="text-brand-pink hover:text-brand-dark font-black transition-all underline underline-offset-8">
                Create Membership
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-brand-dark/70 text-[9px] uppercase tracking-widest font-bold">
            Secured by StyleGenie AI &copy; 2026 Atelier Concierge
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;