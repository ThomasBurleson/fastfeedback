const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      minWidth: {
        0: '0',
        25: '25%',
        33: '33%',
        50: '50%',
        66: '66%',
        75: '75%',
        100: '100%'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
