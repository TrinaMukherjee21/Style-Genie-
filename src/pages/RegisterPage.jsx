import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth, useUserContext } from '../context/UserContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setGender } = useUserContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', gender: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields'); return false;
    }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters long'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { setError('Please enter a valid email address'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true); setError('');
    try {
      const userData = {
        firstName: formData.name?.split(' ')[0] || '',
        lastName: formData.name?.split(' ').slice(1).join(' ') || '',
        email: formData.email, password: formData.password,
        gender: formData.gender || 'prefer-not-to-say'
      };
      const result = await register(userData);
      if (result.success) {
        if (formData.gender) {
          localStorage.setItem('user_gender_preference', formData.gender);
          if (typeof setGender === 'function') setGender(formData.gender);
        }
        navigate('/');
      } else { setError(result.error || 'Registration failed. Please try again.'); }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const inputClass = "w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-pink/20 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition-all";
  const labelClass = "block text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] mb-2";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28 md:pt-32 pb-16">
      {/* Premium bloom - Using new palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-brand-pink/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="max-w-md w-full mx-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-cream border border-brand-pink/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Sparkles className="w-10 h-10 text-brand-pink" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">Join the Boutique</h2>
          <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Begin your curated style journey</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 border border-brand-gray shadow-[0_25px_60px_rgba(137,162,147,0.1)] transition-all duration-500 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold" 
                  placeholder="Your full name" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">Email or Username</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold" 
                  placeholder="Email or Username" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold" 
                  placeholder="Create a password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-brand-dark opacity-60 hover:text-brand-pink hover:opacity-100 transition-all">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-brand-dark mb-3 uppercase tracking-[0.2em]">Verify Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-dark opacity-60 group-focus-within:text-brand-pink group-focus-within:opacity-100 transition-all" />
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4 bg-brand-cream/30 border border-brand-gray/50 rounded-2xl text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:bg-white focus:border-brand-pink focus:ring-8 focus:ring-brand-pink/5 transition-all font-bold" 
                  placeholder="Repeat password" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-brand-dark opacity-60 hover:text-brand-pink hover:opacity-100 transition-all">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-[10px] font-bold text-brand-sage mb-4 uppercase tracking-[0.2em] text-center opacity-60">Atelier Direction</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'male', label: 'Men' },
                  { value: 'female', label: 'Women' },
                  { value: 'unisex', label: 'Unisex' },
                  { value: 'prefer-not-to-say', label: 'Skip' },
                ].map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setFormData({...formData, gender: value})}
                    className={`py-3.5 px-4 rounded-xl font-bold transition-all duration-500 border text-[10px] uppercase tracking-[0.2em] ${
                      formData.gender === value
                        ? 'bg-brand-dark text-white border-brand-dark shadow-xl'
                        : 'bg-white text-brand-sage border-brand-gray/50 hover:border-brand-pink hover:bg-brand-pink/5'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-4 animate-shake">
                <p className="text-brand-pink text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 mt-4 text-xs uppercase tracking-[0.2em]">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Membership</span>
                  <ArrowRight className="w-5 h-5 text-brand-pink" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-brand-dark text-sm font-bold">
              Already a Member?{' '}
              <Link to="/login" className="text-brand-pink hover:text-brand-dark font-black transition-all underline underline-offset-8">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-brand-dark/70 text-[9px] uppercase tracking-widest font-bold">
            Join the elite circle of StyleGenie &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;