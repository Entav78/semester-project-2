import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
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
        profileScript: "src/pages/profile/profile.js",
        login: "src/pages/auth/login/login.html", // ✅ Add login.html
        loginScript: "src/pages/auth/login/login.js",
        register: "src/pages/auth/register/register.html", // ✅ Add register.html
        registerScript: "src/pages/auth/register/register.js",
      },
      output: {
        entryFileNames: "assets/[name].js", // ✅ Keep predictable JS filenames
        assetFileNames: "assets/[name][extname]",
      },
      //external: ["/assets/profileScript.js"], // ✅ Mark profileScript.js as external
    },
  },
});





