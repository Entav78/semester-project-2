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
        main: "index.html", // Home page
        item: "src/pages/item/item.html", 
        profile: "src/pages/profile/profile.html",
        login: "src/pages/auth/login/login.html", // ✅ Add login.html
        register: "src/pages/auth/register/register.html", // ✅ Add register.html
      },
      output: {
        assetFileNames: "assets/[name][extname]", // ✅ Prevent hashed filenames
      },
    },
  },
});




