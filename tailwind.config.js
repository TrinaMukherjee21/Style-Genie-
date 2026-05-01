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
        // Core Brand Colors remapped to "Classic Blush Pink" theme
        brand: {
          sage: '#89A293',          // Sage Green
          gray: '#EEEDEB',          // Warm Gray/Off White
          pink: '#DCB5BE',          // Primary Blush Pink
          pinkLight: '#EEDFE3',     // Soft Blush
          cream: '#F5F4F3',         // Lighter Cream
          dark: '#1E1A1B',          // Deep Charcoal Plum (Premium Dark)
          black: '#121212',         // Rich Ebony
        },
        
        // Light theme palette
        'light-primary': '#FFFFFF',
        'light-pink': '#EEDFE3',
        'light-rose': '#DCB5BE',
        'light-blush': '#F5F4F3',
        'light-sage': '#89A293',

        // Compatibility aliases for existing code
        'dark-primary': '#FFFFFF',
        'dark-surface': '#F5F4F3',
        'dark-card': '#FFFFFF',
        'dark-border': '#EEEDEB',
        'dark-hover': '#EEDFE3',
        'dark-secondary': '#F5F4F3',
        
        'neon-purple': '#EEDFE3',
        'neon-pink': '#DCB5BE', 
        'neon-cyan': '#EEEDEB',
        'neon-green': '#89A293',
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