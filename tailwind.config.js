/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        fadeInOut: {
          '0%, 100%': {  opacity: '0' },
          '50%': { opacity: '1' },
        }
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'cachet': ['Cachet-W05', 'sans-serif'],
      }
    },

  },
  plugins: [],
})

