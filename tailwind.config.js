/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,scss}"],
  safelist: [
    "hidden",
    "translate-x-full",
    "opacity-0",
    "opacity-100"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B09187", // Buttons
        secondary: "#82685E", // Sidebar alternative
        accent: "#53423C", // Header, Sidebar, highlights, hoover
        background: "#EEE9E7", // Main background
        soft: "#D7CCC8", // Lighter elements
        text: "#53423C", // Text color
        coffee: '#241C19', // Dark brown
        mocha: "#7A5C4F", // Softer brown for delete button
      },
      safelist: ["text-white"],
    },
  },
  plugins: [],
};











