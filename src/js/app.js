import Navigation from "@/components/navigation/index.js";
import router from "@/pages/router/router.js";
import "../styles/main.scss";

console.log("🛠️ Initializing Router...");
router();

document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    console.log("✅ DOM Ready: Initializing Navigation...");
    
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar && overlay) {
      new Navigation();
    } else {
      console.warn("⚠️ Sidebar or overlay not found. Navigation not initialized.");
    }

    // ✅ Confirm if listings-container exists at this point
    const listingsContainer = document.getElementById("listings-container");
    if (listingsContainer) {
      console.log("✅ listings-container exists at app.js execution time");
    } else {
      console.error("❌ listings-container NOT found when app.js runs");
    }

    // ✅ Confirm if buttons exist at this point
    setTimeout(() => {
      document.querySelectorAll(".view-item").forEach((btn) => 
        console.log("🛠️ Button Exists in app.js:", btn.dataset.id)
      );
    }, 1000); // Delay to ensure listings load
  }
});





