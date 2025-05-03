/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nature': {
          'green': '#4CAF50',
          'green-light': '#81C784',
          'brown': '#8D6E63',
          'brown-light': '#A1887F',
          'cream': '#F5F5DC',
          'sage': '#9CAF88',
        }
      }
    },
  },
  plugins: [],
} 