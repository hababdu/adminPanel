const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... barcha primary ranglari
          900: '#0c4a6e',
        },
        // Boshqa ranglar...
      },
    },
  },
  plugins: [],
};