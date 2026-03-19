// tailwind.config.js - Minimal Professional Theme
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors (Dark Navy, Gold, Lavender)
        brand: {
          navy: '#120D20',      // Deep dark navy background
          dark: '#1A162D',      // Slightly lighter card background
          gold: '#d4af37',      // Primary elegant gold accent
          goldLight: '#eacc6e',
          lavender: '#c0a0e6',  // Secondary lilac/lavender accent
          lavenderDark: '#9b76cc',
        },
        
        // Dark theme colors mapped to brand
        'dark-primary': '#120D20',
        'dark-surface': '#1A162D', 
        'dark-card': '#221A3B',
        'dark-border': '#35295D',
        'dark-hover': '#2D234A',
        
        // Re-mapped Neon variables to Brand colors to prevent crashes in old components while refactoring
        'neon-purple': '#c0a0e6',
        'neon-pink': '#c0a0e6', 
        'neon-cyan': '#c0a0e6',
        'neon-green': '#d4af37',
        'neon-orange': '#d4af37',
        'neon-yellow': '#d4af37',
        'neon-blue': '#c0a0e6',
        'neon-indigo': '#c0a0e6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        // Removing excessive neon and pulse animations. Keeping functional ones.
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out'
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
}