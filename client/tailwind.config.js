/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D4C41',
        secondary: '#A1887F',
        accent: '#8D6E63',
      },
    },
  },
  plugins: [],
}
