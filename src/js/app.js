import { Navigation } from "@/components/navigation/index.js";
import { router } from "@/pages/router/router.js";
import "../styles/main.scss";

console.log("🛠️ Initializing App...");

// ✅ Force router execution on first load
router();

// ✅ Check login state
const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

// ✅ Find navigation containers
const navContainers = document.querySelectorAll(".navbar-nav");

// ✅ Create and update navigation dynamically
navContainers.forEach(container => {
  const navigationInstance = new Navigation(container, isLoggedIn);
  navigationInstance.createNavbar(isLoggedIn);
});

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("button.nav-link");
  if (button) {
    event.preventDefault();
    const path = button.dataset.path;

    console.log(`🔍 Navigating to: ${path}`);
    window.history.pushState({}, "", path);
    router(path);
  }
});

// ✅ Ensure router updates on back/forward
window.addEventListener("popstate", () => {
  router();
});











