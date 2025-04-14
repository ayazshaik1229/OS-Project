/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        oxanium: ['Oxanium', 'sans-serif'],
      },
      colors: {
        'neon-blue': '#00f3ff',
        'neon-green': '#00ff9d',
        'cyber-black': '#0d1117',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        glow: {
          '0%': { 'text-shadow': '0 0 10px #00f3ff' },
          '100%': { 'text-shadow': '0 0 20px #00f3ff, 0 0 30px #00f3ff' },
        },
      },
    },
  },
  plugins: [],
};