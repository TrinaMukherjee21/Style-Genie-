import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus, MessageCircle, Brain, Sparkles, RotateCcw, ShoppingBag, Star, Package } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useAppContext } from '../../context/AppContext';
import StyleGenieLogo from './Logo';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUserDisplayName, userProfile } = useUserContext();
  const { quizCompleted } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user has completed quiz (either from context or user profile)
  const hasCompletedQuiz = quizCompleted || (userProfile && (userProfile.personalityType || userProfile.primaryAesthetic || userProfile.aesthetics));
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Cart', path: '/cart', icon: ShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: Star },
    { name: 'Profile', path: '/profile', icon: User },
    hasCompletedQuiz 
      ? { name: 'Quiz Results', path: '/quiz/results', icon: Sparkles }
      : { name: 'Take Quiz', path: '/quiz', icon: Brain }
  ];

  const authItems = [
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Register', path: '/register', icon: UserPlus }
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const getNavClasses = (isActive) => {
    return isActive 
      ? 'bg-brand-gold/10 border-[#d4af37]/40 text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
      : 'text-gray-300 hover:text-brand-gold hover:bg-brand-gold/20 border-transparent hover:border-[#d4af37]/20';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#120D20]/90 backdrop-blur-xl border-b border-[#35295D] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/')}
          >
            <StyleGenieLogo size="md" animated={true} showText={true} />
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated user menu
              <>
                {/* User greeting */}
                <div className="hidden lg:flex items-center space-x-3 bg-[#1A162D] px-5 py-2.5 rounded-full border border-[#35295D] shadow-inner">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#eacc6e] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    <User className="w-4.5 h-4.5 text-[#120D20]" />
                  </div>
                  <span className="text-white text-sm font-medium tracking-wide">
                    {getUserDisplayName()}
                  </span>
                </div>

                {/* Navigation items */}
                <div className="flex items-center space-x-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`nav-item-enhanced ${getNavClasses(isActive)} border transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg group`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold'}`} />
                        <span className="hidden sm:inline font-medium tracking-tight whitespace-nowrap">{item.name}</span>
                      </button>
                    );
                  })}
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="nav-item-enhanced text-gray-400 hover:text-red-400 hover:bg-red-400/10 border-transparent border transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              // Non-authenticated user menu
              <div className="flex items-center space-x-4">
                {!isAuthPage && (
                  <div className="flex items-center space-x-2">
                    {authItems.map((item) => {
                      const Icon = item.icon;
                      
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`nav-item-enhanced ${getNavClasses(false)} border transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg group`}
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-gold" />
                          <span className="hidden sm:inline font-medium tracking-tight whitespace-nowrap">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Get Started Button */}
                <button
                  onClick={() => navigate('/quiz')}
                  className="btn-primary px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg shadow-brand-gold/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;