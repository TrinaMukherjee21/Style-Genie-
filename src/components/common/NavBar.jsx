import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus, MessageCircle, Brain, Sparkles, RotateCcw, ShoppingBag, Star, Package, Heart, Zap } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { useAppContext } from '../../context/AppContext';
import StyleGenieLogo from './Logo';
import glitterBg from '../../assets/images/pink_glitter_bg.jpg';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUserDisplayName, userProfile } = useUserContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Analysis', path: '/colour-analysis', icon: Brain },
    { name: 'Try On', path: '/tryon', icon: Sparkles },
    { name: 'Lookbook', path: '/lookbook', icon: Star }
  ];

  const authItems = [
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Register', path: '/register', icon: UserPlus }
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const getNavClasses = (isActive) => {
    return isActive 
      ? 'bg-brand-cream border-brand-pink/30 text-brand-dark font-bold shadow-sm' 
      : 'text-brand-sage hover:text-brand-dark hover:bg-brand-cream/50 border-transparent';
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-brand-pink/10 shadow-sm transition-all duration-500 overflow-hidden"
        style={{ backgroundImage: `url(${glitterBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Subtle overlay to ensure text readability over the glitter */}
        <div className="absolute inset-0 bg-white/30 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[#FDF8F9]/40 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Premium Typography Logo */}
          <div 
            className="cursor-pointer hover:scale-105 transition-all duration-700 flex flex-col items-center justify-center group"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center gap-3 md:gap-4 font-serif uppercase tracking-[0.2em] md:tracking-[0.4em] text-lg md:text-2xl mb-1">
              <span className="text-brand-sage font-light">Style</span>
              <div className="relative flex items-center">
                <span className="text-brand-pink font-light">Genie</span>
                {/* Decorative Sparkle on the 'i' */}
                <div className="absolute top-[-4px] right-[14px]">
                  <Sparkles className="w-2.5 h-2.5 text-brand-pink/60 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Decorative Underline with Sparkle */}
            <div className="flex items-center w-full max-w-[180px] gap-3 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-[0.5px] bg-brand-sage flex-grow"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink"></div>
              <div className="h-[0.5px] bg-brand-sage flex-grow"></div>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User greeting */}
                <div className="hidden lg:flex items-center space-x-4 bg-white/60 px-6 py-2.5 rounded-2xl border border-brand-pink/10 group hover:border-brand-pink/30 transition-all duration-500 shadow-sm">
                  <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-brand-dark text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                    {getUserDisplayName()}
                  </span>
                </div>

                {/* Navigation items (Desktop) */}
                <div className="hidden md:flex items-center space-x-3">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`nav-item-enhanced ${getNavClasses(isActive)} border transition-all duration-500 flex items-center space-x-3 px-5 py-3 rounded-2xl group`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-pink' : 'text-brand-sage group-hover:text-brand-dark'}`} />
                        <span className="hidden lg:inline font-bold tracking-[0.1em] whitespace-nowrap text-[10px] uppercase">{item.name}</span>
                      </button>
                    );
                  })}
                  
                  {/* Logout Button (Desktop) */}
                  <button
                    onClick={handleLogout}
                    className="nav-item-enhanced text-brand-sage hover:text-brand-pink hover:bg-brand-cream/50 border-transparent border transition-all duration-500 flex items-center space-x-3 px-5 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[0.1em]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>

                {/* Mobile Logout (Top Right) */}
                <button
                  onClick={handleLogout}
                  className="md:hidden p-3 text-brand-sage hover:text-brand-pink rounded-2xl bg-brand-cream/50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {!isAuthPage && (
                  <div className="hidden sm:flex items-center space-x-3">
                    {authItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`nav-item-enhanced ${getNavClasses(false)} border transition-all duration-500 flex items-center space-x-3 px-5 py-3 rounded-2xl group text-[10px] font-bold uppercase tracking-[0.1em]`}
                        >
                          <Icon className="w-4 h-4 text-brand-sage group-hover:text-brand-dark" />
                          <span className="whitespace-nowrap">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Get Started Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="bg-brand-dark text-white px-4 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold transition-all duration-500 flex items-center space-x-2 sm:space-x-3 hover:bg-brand-black hover:shadow-[0_10px_30px_rgba(30,26,27,0.2)] hover:-translate-y-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 h-4 text-brand-pink animate-pulse" />
                  <span className="whitespace-nowrap">Join Boutique</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Bottom App Navigation Bar (Mobile Only) */}
    {user && (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-brand-gray/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe pt-3 px-6 rounded-t-[2.5rem]">
        <div className="flex justify-between items-center h-20">
          {navItems.filter(i => ['Analysis', 'Products', 'Lookbook'].includes(i.name)).map((item) => {

            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-24 h-full rounded-3xl transition-all duration-500 ${
                  isActive ? 'text-brand-pink scale-110' : 'text-brand-sage hover:text-brand-dark'
                }`}
              >
                <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-brand-cream shadow-inner' : ''}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-brand-pink/20' : ''}`} />
                </div>
                <span className={`text-[9px] mt-2 font-bold tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    )}
    </>
  );
};

export default NavBar;