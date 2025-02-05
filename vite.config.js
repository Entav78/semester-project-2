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
        item: "src/pages/item/item.html", 
        profile: "src/pages/profile/profile.html",
      },
      output: {
        assetFileNames: "assets/[name][extname]", // ✅ Prevent hashed filenames
      },
    },
  },
});



