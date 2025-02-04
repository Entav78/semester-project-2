import Navigation from "@/components/navigation/index.js";
import router from "@/pages/router/router.js";
import "../styles/main.scss";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 App initialized");

  // Initialize Navigation
  new Navigation();

  // Run the router to load page-specific scripts
  await router();
});



