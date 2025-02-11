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
let navigationInstance;

if (!document.querySelector(".navbar-nav ul")) {
  navContainers.forEach(container => {
    navigationInstance = new Navigation(container, isLoggedIn);
  });
}

// ✅ Make sure we can access navigationInstance globally
window.navigationInstance = navigationInstance;


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

document.body.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-link");
  if (!button) return; // ✅ Ensure we clicked a navigation button

  event.preventDefault();
  const path = button.dataset.path;

  if (!path) {
    console.warn("⚠️ No path found on clicked button.");
    return;
  }

  console.log(`🔍 Navigating to: ${path}`);
  window.history.pushState({}, "", path);
  
  router(path); // ✅ Run the router immediately without delay
});


// ✅ Ensure correct page loads on back/forward navigation
window.addEventListener("popstate", () => {
  router();
});















