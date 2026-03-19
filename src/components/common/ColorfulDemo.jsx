// src/components/common/ColorfulDemo.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Zap, Star, Heart, Sparkles, Sun, Moon } from 'lucide-react';

const ColorfulDemo = () => {
  const { theme, toggleTheme } = useTheme();

  const colorCards = [
    {
      name: 'Purple Power',
      colorClass: 'neon-purple',
      bgClass: 'card-neon-purple',
      icon: Zap,
      description: 'Electric and energetic'
    },
    {
      name: 'Pink Passion',
      colorClass: 'neon-pink', 
      bgClass: 'card-neon-pink',
      icon: Heart,
      description: 'Bold and beautiful'
    },
    {
      name: 'Cyan Cool',
      colorClass: 'neon-cyan',
      bgClass: 'card-neon-cyan', 
      icon: Star,
      description: 'Fresh and modern'
    },
    {
      name: 'Green Glow',
      colorClass: 'neon-green',
      bgClass: 'card-neon-green',
      icon: Sparkles,
      description: 'Natural and vibrant'
    }
  ];

  const buttonVariants = [
    { class: 'btn-primary', label: 'Primary' },
    { class: 'btn-secondary', label: 'Secondary' },
    { class: 'btn-accent', label: 'Accent' },
    { class: 'btn-success', label: 'Success' },
    { class: 'btn-outline', label: 'Outline' }
  ];

  return (
    <div className="min-h-screen p-8 bg-brand-navy [data-theme=light] &:bg-light-primary transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Palette className="w-8 h-8 text-purple neon-purple " />
            <h1 className="text-5xl font-bold text-glow-purple">
              Colorful Theme System
            </h1>
            <Palette className="w-8 h-8 text-pink neon-pink " />
          </div>
          
          <p className="text-xl text-gray-300 [data-theme=light] &:text-gray-600 mb-6">
            Experience vibrant colors that adapt beautifully to both light and dark modes
          </p>

          {/* Theme Toggle Demo */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Sun className="w-5 h-5 text-brand-gold opacity-50" />
            <button
              onClick={toggleTheme}
              className="btn-primary px-8 py-3 rounded-full text-lg font-semibold"
            >
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
            <Moon className="w-5 h-5 text-brand-gold opacity-50" />
          </div>
        </div>

        {/* Color Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {colorCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.name}
                className={`card-enhanced ${card.bgClass} p-6 animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center -neon ${card.colorClass}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${card.colorClass}`}>
                    {card.name}
                  </h3>
                  <p className="text-gray-300 [data-theme=light] &:text-gray-600">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button Showcase */}
        <div className="card-enhanced p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-glow-cyan">
            Interactive Button Collection
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {buttonVariants.map((btn) => (
              <button
                key={btn.label}
                className={`${btn.class} px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bars Demo */}
        <div className="card-enhanced p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-glow-green">
            Animated Progress Bars
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-purple neon-purple font-semibold">Purple Magic</span>
                <span className="text-purple neon-purple">85%</span>
              </div>
              <div className="progress-bar-enhanced">
                <div className="progress-fill-purple " style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-pink neon-pink font-semibold">Pink Power</span>
                <span className="text-pink neon-pink">70%</span>
              </div>
              <div className="progress-bar-enhanced">
                <div className="progress-fill-pink " style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Effects Showcase */}
        <div className="card-enhanced p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-glow-pink">
            Glowing Text Effects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-glow-purple mb-2">Purple</h3>
              <p className="neon-purple">Mystical vibes</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-glow-pink mb-2">Pink</h3>
              <p className="neon-pink">Playful energy</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-glow-cyan mb-2">Cyan</h3>
              <p className="neon-cyan">Cool freshness</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-glow-green mb-2">Green</h3>
              <p className="neon-green">Natural harmony</p>
            </div>
          </div>
        </div>

        {/* Background Patterns */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card-enhanced  p-8">
            <h3 className="text-2xl font-bold text-center mb-4 text-glow-purple">
              Dotted Pattern
            </h3>
            <p className="text-center text-gray-300 [data-theme=light] &:text-gray-600">
              Subtle dots create visual interest
            </p>
          </div>
          <div className="card-enhanced  p-8">
            <h3 className="text-2xl font-bold text-center mb-4 text-glow-cyan">
              Grid Pattern
            </h3>
            <p className="text-center text-gray-300 [data-theme=light] &:text-gray-600">
              Clean grid lines for structure
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="text-center">
          <div className="inline-flex gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full  flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-pink-500 rounded-full  flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-cyan-500 rounded-full  flex items-center justify-center" style={{ animationDelay: '2s' }}>
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full  flex items-center justify-center" style={{ animationDelay: '3s' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorfulDemo;