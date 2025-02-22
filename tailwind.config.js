/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js}"],
  safelist: [
    "hidden",
    "translate-x-full",
    "opacity-0",
    "opacity-100"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B09187", // Header, Sidebar
        secondary: "#82685E", // Sidebar alternative
        accent: "#53423C", // Buttons, highlights
        background: "#EEE9E7", // Main background
        soft: "#D7CCC8", // Lighter elements
        text: "#53423C", // Text color
      },
    },
  },
  plugins: [],
};











