import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.name?.split(' ')[0] || '',
        lastName: formData.name?.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        password: formData.password,
        gender: formData.gender || 'prefer-not-to-say'
      };

      const result = await register(userData);
      if (result.success) {
        // Save gender preference
        if (formData.gender) {
          localStorage.setItem('user_gender_preference', formData.gender);
        }

        // Registration was successful - go to quiz page to establish DNA
        console.log('RegisterPage: Registration successful, redirecting to quiz');
        navigate('/quiz');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center pt-16">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h2 className="text-4xl font-bold mb-2 font-heading text-hero">Join StyleGenie</h2>
          <p className="text-text-secondary font-body">Create your account and discover your style DNA</p>
        </div>

        {/* Register Form */}
        <div className="glass-effect rounded-2xl p-8 border border-[#d4af37]/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#d4af37]/70" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-enhanced w-full !pl-12 !pr-4 py-3"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#d4af37]/70" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-enhanced w-full !pl-12 !pr-4 py-3"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#d4af37]/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-enhanced w-full !pl-12 !pr-12 py-3"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#d4af37]/70" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-enhanced w-full !pl-12 !pr-12 py-3"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Gender Selection Field */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                I'm shopping for (This helps us personalize your experience)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'male'})}
                  className={`py-3 px-4 rounded-xl font-medium transition-all border-2 ${
                    formData.gender === 'male'
                      ? 'bg-brand-dark text-[#d4af37] border-[#d4af37]'
                      : 'bg-[#d4af37]/5 text-text-muted border-[#d4af37]/10 hover:border-[#d4af37]/30'
                  }`}
                >
                  👔 Men
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'female'})}
                  className={`py-3 px-4 rounded-xl font-medium transition-all border-2 ${
                    formData.gender === 'female'
                      ? 'bg-brand-dark text-[#d4af37] border-[#d4af37]'
                      : 'bg-[#d4af37]/5 text-text-muted border-[#d4af37]/10 hover:border-[#d4af37]/30'
                  }`}
                >
                  👗 Women
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'unisex'})}
                  className={`py-3 px-4 rounded-xl font-medium transition-all border-2 ${
                    formData.gender === 'unisex'
                      ? 'bg-brand-dark text-[#d4af37] border-[#d4af37]'
                      : 'bg-[#d4af37]/5 text-text-muted border-[#d4af37]/10 hover:border-[#d4af37]/30'
                  }`}
                >
                  ✨ Unisex
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'prefer-not-to-say'})}
                  className={`py-3 px-4 rounded-xl font-medium transition-all border-2 ${
                    formData.gender === 'prefer-not-to-say'
                      ? 'bg-brand-dark text-[#d4af37] border-[#d4af37]'
                      : 'bg-[#d4af37]/5 text-text-muted border-[#d4af37]/10 hover:border-[#d4af37]/30'
                  }`}
                >
                  🤐 Skip
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center space-x-2 shadow-lg shadow-[#d4af37]/10"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-black">Create Account</span>
                  <ArrowRight className="w-5 h-5 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm font-body">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-accent font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;