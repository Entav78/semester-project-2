import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as vars;`, // ✅ Inject SCSS globally
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html", 
      },
      output: {
        assetFileNames: "assets/[name][extname]", // ✅ Prevent hashed filenames
      },
    },
  },
});



