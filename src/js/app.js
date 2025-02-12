import { basePath } from "@/js/api/constants.js";
import { Navigation } from "@/components/navigation/index.js";
import { router } from "@/pages/router/router.js";
import { initializeRegisterPage } from "@/pages/auth/register/register.js";
import { initializeLoginPage } from "@/pages/auth/login/login.js";
import { initializeProfilePage } from "@/pages/profile/profile.js";

import "../styles/main.scss";

console.log("🛠️ Initializing App...");

const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
const navContainers = document.querySelectorAll(".navbar-nav");
navContainers.forEach(container => new Navigation(container, isLoggedIn));

if (window.location.pathname.includes("/auth/register")) {
  console.log("🆕 Register Page Detected - Initializing...");
  initializeRegisterPage();
}

if (window.location.pathname.includes("/auth/login")) {
  console.log("🔑 Login Page Detected - Initializing...");
  initializeLoginPage();
}

if (window.location.pathname.includes("/profile")) {
  console.log("👤 Profile Page Detected - Initializing...");
  initializeProfilePage();
}

document.body.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-link");
  if (button) {
    event.preventDefault();
    let path = button.dataset.path;

    if (!path) {
      console.warn("⚠️ No path found on clicked button.");
      return;
    }

    // ✅ Ensure path includes basePath
    path = basePath + path.replace(basePath, "");

    console.log(`🔍 Navigating to: ${path}`);
    window.history.pushState({}, "", path);
    router(path);
  }
});

window.addEventListener("popstate", () => {
  router();
});














