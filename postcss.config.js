/* =error
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
*/
/*
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  }
}
*/
/*
export default {
  plugins: {
    autoprefixer: {},
  }
};
*/
/*
export default {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
};
*/
/* works
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss, autoprefixer],
};
*/
/*
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss, autoprefixer],
};
*/
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};


