// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Pastikan ini ada untuk fitur dark mode berbasis class
  content: [
    "./index.html",
    // Pastikan jalur ini mencakup semua file React kamu
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#6366F1', // Indigo 500
          dark: '#4F46E5',  // Indigo 600
        },
        secondary: {
          light: '#A78BFA', // Violet 400
          dark: '#8B5CF6',  // Violet 500
        },
        background: {
          light: '#F8FAFC', // Slate 50
          dark: '#1E293B',  // Slate 800
        },
        text: {
          light: '#1F2937', // Gray 900
          dark: '#E2E8F0',  // Slate 200
        },
      },
    },
  },
  plugins: [],
};