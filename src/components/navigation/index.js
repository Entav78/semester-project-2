import { router } from "@/pages/router/router.js";
import { basePath } from "@/js/api/constants.js";

export class Navigation {
  constructor(container, isLoggedIn) {
    if (!container) {
      console.error("❌ Navigation container not found.");
      return;
    }

    this.container = container;
    this.isLoggedIn = isLoggedIn;

    console.log("🛠️ Creating Navigation...");

    this.createNavbar(isLoggedIn);
    this.setupSidebar(); // ✅ Ensure sidebar works after page changes
  }

  createNavbar(isLoggedIn) {
    this.container.innerHTML = ""; // Clear existing content

    const nav = document.createElement("ul");
    nav.className = "navbar-nav flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6"

const navItems = [
  { text: "Home", path: `${basePath}/` },
  { text: "Profile", path: `${basePath}/src/pages/profile/profile`, show: isLoggedIn },
  { text: "Login", path: `${basePath}/src/pages/auth/login/login`, show: !isLoggedIn },
  { text: "Register", path: `${basePath}/src/pages/auth/register/register`, show: !isLoggedIn },
  { text: "Logout", path: "#", show: isLoggedIn, action: this.handleLogout },
];


    navItems.forEach(({ text, path, show, action }) => {
      if (show !== undefined && !show) return;

      const button = document.createElement("button");
      button.textContent = text;
      button.className = "nav-link text-white hover:text-gray-300 transition";
      button.dataset.path = path;

      if (action) {
        button.addEventListener("click", action);
      } else {
        // ✅ Ensure navigation buttons trigger the router
        button.addEventListener("click", (event) => {
          event.preventDefault();
          console.log(`🔍 Navigating to: ${path}`);
          window.history.pushState({}, "", path);
          router(path);
        });
      }

      const listItem = document.createElement("li");
      listItem.className = "nav-item";
      listItem.appendChild(button);
      nav.appendChild(listItem);
    });

    this.container.appendChild(nav);
    console.log("✅ Navigation created:", nav);
  }

  handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userDetails");
    console.log("✅ User logged out.");
    window.location.reload();
  }

  setupSidebar() {
    // ✅ Attach sidebar event listeners again after navigation changes
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const openButton = document.getElementById("openSidebar");
    const closeButton = document.getElementById("closeSidebar");

    if (!sidebar || !overlay || !openButton || !closeButton) {
      console.warn("⚠️ Sidebar elements missing. Skipping sidebar setup.");
      return;
    }

    console.log("🍔 Setting up sidebar functionality...");

    openButton.addEventListener("click", () => {
      console.log("📂 Opening sidebar...");
      sidebar.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
    });

    closeButton.addEventListener("click", () => {
      console.log("📂 Closing sidebar...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    overlay.addEventListener("click", () => {
      console.log("📂 Closing sidebar via overlay...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    console.log("✅ Sidebar setup completed.");
  }
}
















