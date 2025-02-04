import Navigation from "@/components/navigation/index.js";
import router from "@/pages/router/router.js";
import "../styles/main.scss";

console.log("🛠️ Initializing Router...");
router();

// Ensure elements exist before instantiating
document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    console.log("✅ DOM Ready: Initializing Navigation...");
    
    // Only initialize navigation if elements exist
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar && overlay) {
      new Navigation();
    } else {
      console.warn("⚠️ Sidebar or overlay not found. Navigation not initialized.");
    }
  }
});




