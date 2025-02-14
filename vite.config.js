import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  server: {
    hmr: true, // ✅ Enables Hot Module Replacement (HMR) (optional)
    fs: {
      strict: false, // ✅ Ensures Vite serves all necessary files
    },
    historyApiFallback: true, // ✅ Properly handles deep links & SPA behavior
    watch: {
      usePolling: true, // ✅ Helps detect file changes on Windows/Mac/Linux
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
        main: "index.html",
        item: "src/pages/item/item.html",
        profile: "src/pages/profile/profile.html",
        profileScript: "src/pages/profile/profile.js",  // ✅ Fixed duplicate folder issue
        login: "src/pages/auth/login/login.html",
        loginScript: "src/pages/auth/login/login.js",
        register: "src/pages/auth/register/register.html",
        registerScript: "src/pages/auth/register/register.js",
      },
      output: {
        entryFileNames: "assets/[name].js", // ✅ Generates clean filenames
        assetFileNames: "assets/[name][extname]", // ✅ Removes extra "assets/assets/"
      },
    },
  },
});






