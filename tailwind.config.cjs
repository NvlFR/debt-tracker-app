// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = { // Ubah export default menjadi module.exports
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background-light': '#f8f9fa',
        'background-dark': '#1a202c',
        'text-light': '#2d3748',
        'text-dark': '#e2e8f0',
        'primary-light': '#4c51bf',
        'primary-dark': '#81e6d9',
        'secondary-light': '#5a67d8',
        'secondary-dark': '#4fd1c5',
        'accent-light': '#ecc94b',
        'accent-dark': '#f6e05e',
      },
    },
  },
  plugins: [],
};