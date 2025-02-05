import Navigation from "@/components/navigation/index.js";
import router from "@/pages/router/router.js";
import "../styles/main.scss";

console.log("🛠️ Initializing Router...");
router();

// Ensure elements exist before instantiating
document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    console.log("✅ DOM Ready: Initializing Navigation...");
    new Navigation(); 
    // ✅ Only initialize navigation if elements exist
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar && overlay) {
      new Navigation();
    } else {
      console.warn("⚠️ Sidebar or overlay not found. Navigation not initialized.");
    }

    const listingsContainer = document.getElementById("listings-container");
    if (listingsContainer) {
    console.log("✅ listings-container exists - Home Page detected!");
    // 🚀 If needed, initialize listing-related logic here
}


    // ✅ Check if we're on the item page ("/src/pages/item/") and if `#item-container` exists
    const pathname = window.location.pathname;
    console.log("📌 Current Page Path:", pathname);

    if (pathname.startsWith("/src/pages/item/")) {
      console.log("🛒 Loading Item Page Script...");
      import("@/pages/item/item.js").then((module) => {
        console.log("✅ item/item.js LOADED", module);
      }).catch((error) => console.error("❌ Error loading item page script:", error));

      const itemContainer = document.getElementById("item-container");
      if (itemContainer) {
        console.log("✅ item-container exists - Item Page detected!");
      } else {
        console.error("❌ item-container NOT found - Something is wrong with item page.");
      }
    }
  }
});






