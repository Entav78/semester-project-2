import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), 
      "@scss": path.resolve(__dirname, "src/styles"),
    },
  },
});
