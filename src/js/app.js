import { Navigation } from "@/components/navigation/index.js";
import { router } from "@/pages/router/router.js";
import { initializeRegisterPage } from "@/pages/auth/register/register.js";
import { initializeLoginPage } from "@/pages/auth/login/login.js";
import { initializeProfilePage } from "@/pages/profile/profile.js";
import { initializeItemPage } from "@/pages/item/item.js";
import { initializeHomePage } from "@/pages/home/index.js"; // ✅ FIXED PATH
//import { initializeManageListingsPage } from "@/pages/manageListings/manageListings.js";
import "../styles/main.scss";

console.log("🛠️ Initializing App...");

// ✅ Prevent multiple navigation instances
const isLoggedIn = Boolean(localStorage.getItem("authToken"));
const navContainers = document.querySelectorAll(".navbar-nav");

// 🛑 Check if navigation already exists
if (!document.querySelector(".navbar-nav ul")) { 
  navContainers.forEach(container => new Navigation(container, isLoggedIn));
}


// ✅ Page Initialization (APP.JS HANDLES THIS)
const currentPath = window.location.pathname;

if (currentPath === "/" || currentPath === "/index.html") {
  console.log("🏠 Initializing Home Page...");
  initializeHomePage();
}

if (currentPath.includes("/auth/register")) {
  console.log("🆕 Register Page Detected - Initializing...");
  initializeRegisterPage();
}

if (currentPath.includes("/auth/login")) {
  console.log("🔑 Login Page Detected - Initializing...");
  initializeLoginPage();
}

if (currentPath.includes("/profile")) {
  console.log("👤 Profile Page Detected - Initializing...");
  initializeProfilePage();
}

if (currentPath.includes("/item")) {
  console.log("🛒 Item Page Detected - Initializing...");
  initializeItemPage();
}
/*
if (currentPath.includes("/manageListings")) {
  console.log("🛒 Manage Listings Page Detected - Initializing...");
  initializeManageListingsPage();
}
*/
// ✅ Handle Click Events for Navigation
document.body.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-link");
  if (button) {
    event.preventDefault();
    const path = button.dataset.path;

    if (!path) {
      console.warn("⚠️ No path found on clicked button.");
      return;
    }

    console.log(`🔍 Navigating to: ${path}`);
    window.history.pushState({}, "", path);
    
    // ✅ Trigger router() **after DOM is updated**
    setTimeout(() => router(path), 50);
  }
});

// ✅ Ensure correct page loads on back/forward navigation
window.addEventListener("popstate", () => {
  router();
});















