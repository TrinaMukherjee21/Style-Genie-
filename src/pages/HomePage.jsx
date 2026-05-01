import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeatureCards from '../components/home/FeatureCards';
import CallToAction from '../components/home/CallToAction';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-body">
      <HeroSection />
      <AboutSection />
      <FeatureCards />
      <CallToAction />
    </div>
  );
};

export default HomePage;