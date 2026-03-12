/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: '#1B9AAA',
        'dark-red': '#B5173A',
        amber: '#FFC43D',
        mint: '#06D6A0',
        'mint-tint': '#F8FFE5',
        ink: '#1a1a1a',
      },
      fontFamily: {
        sans: ['"Inclusive Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

