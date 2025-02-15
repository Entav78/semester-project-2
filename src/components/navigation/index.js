import { router } from "@/pages/router/router.js";
import { basePath } from "@/js/api/constants.js";
import { Login } from "@/js/api/login.js";
const loginInstance = new Login(); // ✅ Create an instance of the Login class

export class Navigation {
  constructor(container, isLoggedIn, handleLogout) {
    if (!container) {
      console.error("Navigation container not found.");
      return;
    }

    this.container = container;
    this.isLoggedIn = isLoggedIn;
    this.handleLogout = handleLogout;

    console.log(`🛠️ Creating Navigation for: ${this.container.id || "Unknown Element"}`);

    this.createNavbar(isLoggedIn);

    // ✅ Only call `setupSidebar` if it's the sidebar
    if (this.container.id === "sidebar-nav") {
      this.setupSidebar();
    }
  }

  createNavbar(isLoggedIn) {
    this.container.innerHTML = ""; // Clear only the specific navigation

    const nav = document.createElement("ul");
    nav.className = "flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6";

    console.log(`🛠️ Creating Navigation for: ${this.container.id}`);

    const navItems = [
      { text: "Home", path: `${basePath}/` },
      { text: "Profile", path: `${basePath}/profile`, show: isLoggedIn },
      { text: "Manage Listings", path: `${basePath}/manageListings`, show: isLoggedIn },
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
        button.addEventListener("click", (event) => {
          event.preventDefault();
          console.log(`🚪 Logging out user...`);
          action();
        });
      } else {
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
    console.log(`Navigation created for ${this.container.id}`);
  }

  setupSidebar() {
    if (window.sidebarSetupDone) {
      console.log("Sidebar already set up. Skipping re-initialization.");
      return;
    }

    console.log("Setting up sidebar functionality...");

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const openButton = document.getElementById("openSidebar");
    const closeButton = document.getElementById("closeSidebar");

    if (!sidebar || !overlay || !openButton || !closeButton) {
      console.warn("⚠️ Sidebar elements missing. Skipping sidebar setup.");
      return;
    }

    openButton.addEventListener("click", () => {
      console.log("Opening sidebar...");
      sidebar.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
    });

    closeButton.addEventListener("click", () => {
      console.log("Closing sidebar...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    overlay.addEventListener("click", () => {
      console.log("Closing sidebar via overlay...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    window.sidebarSetupDone = true;
    console.log("Sidebar setup completed.");
  }

  updateNavbar(isLoggedIn) {
    const nav = this.container.querySelector("ul");
    if (!nav) return;

    nav.innerHTML = ""; // Clear only the buttons, not re-create nav

    const navItems = [
      { text: "Home", path: `${basePath}/` },
      { text: "Profile", path: `${basePath}/src/pages/profile/profile`, show: isLoggedIn },
      { text: "Manage Listings", path: `${basePath}/src/pages/manageListings/manageListings`, show: isLoggedIn },
      { text: "Login", path: `${basePath}/src/pages/auth/login/login`, show: !isLoggedIn },
      { text: "Register", path: `${basePath}/register`, show: !isLoggedIn },
      { text: "Logout", path: "#", show: isLoggedIn, action: this.handleLogout },
    ];

    navItems.forEach(({ text, path, show, action }) => {
      if (show !== undefined && !show) return;

      const button = document.createElement("button");
      button.textContent = text;
      button.className = "nav-link text-white hover:text-gray-300 transition";
      button.dataset.path = path;

      if (action) {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          console.log(`Logging out user...`);
          action();
        });
      } else {
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

    if (this.container.id === "sidebar-nav") {
      this.setupSidebar();
    }

    console.log("Navbar updated:", nav);
  }
}

/**
 * Function to dynamically load navigation from `navigation/index.html`
 */
export async function loadNavigation() {
  const navContainer = document.getElementById("navigation-container");

  if (!navContainer) {
    console.error("Navigation container not found in the DOM!");
    return;
  }

  try {
    const response = await fetch("/src/components/navigation/index.html");
    if (!response.ok) throw new Error("Failed to load navigation");

    const navHTML = await response.text();
    navContainer.innerHTML = navHTML;
    console.log("Navigation loaded successfully!");

    const mainNav = document.getElementById("main-nav");
    const sidebarNav = document.getElementById("sidebar-nav");

    if (!window.mainNavigation && mainNav) {
      window.mainNavigation = new Navigation(
        mainNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
    }

    if (!window.sidebarNavigation && sidebarNav) {
      window.sidebarNavigation = new Navigation(
        sidebarNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
    }
  } catch (error) {
    console.error("Error loading navigation:", error);
  }
}

// Run `loadNavigation()` Immediately
loadNavigation();


























