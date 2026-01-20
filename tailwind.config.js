/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E63946', light: '#FF6B6B', dark: '#C1121F' },
        secondary: { DEFAULT: '#6C757D', light: '#ADB5BD', dark: '#343A40' },
        accent: { DEFAULT: '#F4A261', light: '#FFD166', dark: '#E76F51' },
        success: '#2A9D8F',
        warning: '#E9C46A',
        error: '#E63946',
        background: '#F8F9FA'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
