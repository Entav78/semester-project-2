/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,scss}",
  ],
  safelist: [
    "text-red-500",
    "bg-blue-500",
    "p-4"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
