import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-light-primary">
      <NavBar />
      <main className="relative pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;