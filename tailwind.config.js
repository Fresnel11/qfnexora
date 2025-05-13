/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff',
        secondary: '#7b2dff',
        tertiary: '#ff2d7b',
        dark: '#0a0a1a',
        light: '#f0f8ff',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      boxShadow: {
        'neon': '0 0 5px var(--color), 0 0 10px var(--color)',
        'neon-intense': '0 0 10px var(--color), 0 0 20px var(--color), 0 0 30px var(--color)',
      },
    },
  },
  plugins: [],
};