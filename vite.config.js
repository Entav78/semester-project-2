/*import { defineConfig } from "vite";
//import postcss from './postcss.config.js';
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
*/

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

