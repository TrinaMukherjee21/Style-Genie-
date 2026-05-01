import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-brand-pink/30 selection:text-brand-dark">
      <NavBar />
      {/* pt-20/24 matches the NavBar height, pb-24 ensures space for mobile bottom nav */}
      <main className="relative pt-20 md:pt-24 pb-24 md:pb-0 animate-fade-in">
        
        {/* Global Transparent Background */}
        <div 
          className="fixed inset-0 top-20 md:top-24 opacity-30 md:opacity-50 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/bg-logo.png')",
            backgroundSize: "80% auto",
            backgroundPosition: "center 20%",
            backgroundRepeat: "no-repeat"
          }}
        />

        {children}
      </main>
    </div>
  );
};

export default Layout;