/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A8D5BA", // Original Sage Green
        secondary: "#5DA9E9", // Original Soft Blue
        background: "#F8F4F1", // Original Background
        accent1: "#C7C9E2", // Original Lavender Grey
        accent2: "#F28C8C", // Original Warm Coral
        vibrantPrimary: "#1B4965", // Vibrant Teal
        vibrantSecondary: "#52B788", // Vibrant Mint
        vibrantBlue: "#5DA9E9", // Vibrant Blue
        vibrantPurple: "#C7C9E2", // Vibrant Purple
        textPrimary: "#1A1A1A",
        textSecondary: "#4A4A4A",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
