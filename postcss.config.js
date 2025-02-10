//works 
/*
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
*/

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ Correct way to use Tailwind in PostCSS
    autoprefixer: {},
  },
};








