import { Navigation } from "@/components/navigation/index.js";
import { router } from "@/pages/router/router.js";
import { initializeRegisterPage } from "@/pages/auth/register/register.js";
import { initializeLoginPage } from "@/pages/auth/login/login.js";
import { Login } from "@/js/api/login.js";
import { initializeItemPage } from "@/pages/item/item.js";
import { initializeHomePage } from "@/pages/home/index.js"; 
//import { initializeManageListingsPage } from "@/pages/manageListings/manageListings.js";
import "../styles/main.scss";

console.log("🛠️ Initializing App...");

// ✅ Prevent multiple navigation instances
const isLoggedIn = Boolean(localStorage.getItem("authToken"));

const mainNav = document.getElementById("main-nav");
const sidebarNav = document.getElementById("sidebar-nav");

let mainNavigationInstance = null;
let sidebarNavigationInstance = null;

// ✅ Create an instance of `Login` to access handleLogout()
const loginInstance = new Login();

if (!window.navigationInitialized) {
  if (mainNav && !mainNav.dataset.navInitialized) {
    mainNavigationInstance = new Navigation(mainNav, isLoggedIn, loginInstance.handleLogout.bind(loginInstance));
    mainNav.dataset.navInitialized = "true";
  }
  if (sidebarNav && !sidebarNav.dataset.navInitialized) {
    sidebarNavigationInstance = new Navigation(sidebarNav, isLoggedIn, loginInstance.handleLogout.bind(loginInstance));
    sidebarNav.dataset.navInitialized = "true";
  }
  window.navigationInitialized = true;
}

// ✅ Make sure both instances are globally accessible
window.mainNavigation = mainNavigationInstance;
window.sidebarNavigation = sidebarNavigationInstance;

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

/*
if (currentPath.includes("/profile")) {
  console.log("👤 Profile Page Detected - Initializing...");
  initializeProfilePage();
}
*/

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















