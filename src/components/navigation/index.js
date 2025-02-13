import { router } from "@/pages/router/router.js";
import { basePath } from "@/js/api/constants.js";
import { Login } from "@/js/api/login.js";
const loginInstance = new Login(); // ✅ Create an instance of the Login class


export class Navigation {
  constructor(container, isLoggedIn, handleLogout) {
    if (!container) {
      console.error("❌ Navigation container not found.");
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
    this.container.innerHTML = ""; // Clear existing content
  
    const nav = document.createElement("ul");
    nav.className = "navbar-nav flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6";
  
    console.log("🛠️ basePath:", basePath);
  
    const navItems = [
      { text: "Home", path: `${basePath}/` },
      { text: "Profile", path: `${basePath}/profile`, show: isLoggedIn },
      { text: "Manage Listings", path: `${basePath}/manageListings`, show: isLoggedIn },
      { text: "Login", path: `${basePath}/src/pages/auth/login/login`, show: !isLoggedIn },
      { text: "Register", path: `${basePath}/src/pages/auth/register/register`, show: !isLoggedIn },
       { text: "Logout", path: "#", show: isLoggedIn, action: this.handleLogout }, // ✅ Use the provided handleLogout
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
          action(); // ✅ Call handleLogout
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
    console.log("✅ Navigation created:", nav);
  }

  setupSidebar() {
    if (this.container.id !== "sidebar-nav") {
      console.log("⚠️ Skipping sidebar setup for main navigation.");
      return;
    }

    console.log("🍔 Setting up sidebar functionality...");

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const openButton = document.getElementById("openSidebar");
    const closeButton = document.getElementById("closeSidebar");

    console.log("🔍 Sidebar:", sidebar);
    console.log("🔍 Overlay:", overlay);
    console.log("🔍 Open Button:", openButton);
    console.log("🔍 Close Button:", closeButton);

    if (!sidebar || !overlay || !openButton || !closeButton) {
      console.warn("⚠️ Sidebar elements missing. Skipping sidebar setup.");
      return;
    }

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
    console.log("✅ Navigation Setup:", window.navigationSetupDone);
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
      { text: "Register", path: `${basePath}/src/pages/auth/register/register`, show: !isLoggedIn },
      { text: "Logout", path: "#", show: isLoggedIn, action: () => loginInstance.handleLogout() },
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

    console.log("🔄 Navbar updated:", nav);
  }
}






















