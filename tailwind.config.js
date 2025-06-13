/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-gradient-to-b',
    'from-[#f8f6ef]',
    'via-[#d3af6c]',
    'to-[#3b024d]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};