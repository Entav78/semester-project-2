import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  server: {
    hmr: true, // ✅ Enables Hot Module Replacement (if needed)
    watch: {
      usePolling: true, // ✅ Helps detect file changes on some systems
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@scss": path.resolve(__dirname, "src/styles"), 
    },
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@scss/variables" as vars;`, 
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Home page
        item: "src/pages/item/item.html", 
        profile: "src/pages/profile/profile.html",
        login: "src/pages/auth/login/login.html", // ✅ Add login.html
        register: "src/pages/auth/register/register.html", // ✅ Add register.html
      },
      output: {
        entryFileNames: "assets/[name].js", // ✅ Keep predictable JS filenames
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});





