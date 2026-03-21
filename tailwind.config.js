/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cra: {
          dark: '#0d1b2a',
          'dark-mid': '#12263a',
          green: '#a3d44a',
          'green-glow': '#b8e05d',
          'green-dark': '#7aab2e',
          gray: '#8a9bae',
        },
      },
      fontFamily: {
        bebas: ['Capture', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
