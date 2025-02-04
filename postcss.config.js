//works 
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

/* = error plugin do not test at all!!!!
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
*/
/*don't work
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
*/
/*
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ Correct Tailwind PostCSS plugin
    autoprefixer: {}, // ✅ Auto-prefixing for cross-browser support
  },
};*/
/*this works
module.exports = {
  plugins: {
    //tailwindcss: {},
    autoprefixer: {},
  },
};
*/
/*
//giving me postcss plugin error "tailwindcss directly as a postcss plugin"
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
*/





