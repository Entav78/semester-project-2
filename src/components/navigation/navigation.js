import { router } from "/semester-project-2/dist/pages/router/router.js";
import { basePath } from "/semester-project-2/dist/js/api/constants.js";
import { Login } from "/semester-project-2/dist/js/api/login.js";

const loginInstance = new Login(); // Create an instance of the Login class

export class Navigation {
  constructor(container, isLoggedIn) {
    if (!container) {
      console.error("Navigation container not found.");
      return;
    }

    this.container = container;
    this.isLoggedIn = isLoggedIn;

    console.log(`Creating Navigation for: ${this.container.id || "Unknown Element"}`);
    this.createNavbar(isLoggedIn);
  }

  handleLogout() {
    console.log("Logging out...");

    // Clear all user-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");

    console.log("Updating navigation after logout...");
    if (window.mainNavigation) window.mainNavigation.updateNavbar(false);
    if (window.sidebarNavigation) window.sidebarNavigation.updateNavbar(false);

    console.log("Redirecting to Home...");
    const homePath = "/".replace(/\/\//g, "/");
    window.history.pushState({}, "", homePath);
    router(homePath);

    setTimeout(() => {
      console.log("Reloading navigation...");
      loadNavigation();
    }, 200);
  }

  createNavbar(isLoggedIn) {
    this.container.innerHTML = "";

    const nav = document.createElement("ul");
    nav.className = "flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6";

    console.log(`🛠️ Creating Navigation for: ${this.container.id}`);

    const navItems = [
      { text: "Home", path: `${basePath}/` },
      { text: "Profile", path: `${basePath}/profile`, show: isLoggedIn },
      { text: "Manage Listings", path: `${basePath}/manageListings`, show: isLoggedIn },
      { text: "Login", path: `${basePath}/login`, show: !isLoggedIn },
      { text: "Register", path: `${basePath}/register`, show: !isLoggedIn },
      { text: "Logout", path: "#", show: isLoggedIn, action: this.handleLogout.bind(this) },
    ];

    navItems.forEach(({ text, path, show, action }) => {
      if (show !== undefined && !show) return;

      console.log(`🔄 Before Navigation: ${fullPath}`);
      const button = document.createElement("button");
      button.textContent = text;
      button.classList.add("nav-link", "text-white", "hover:text-gray-300", "transition");
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
      
          if (typeof fullPath === "undefined") {
              console.warn("⚠️ fullPath is not defined. Setting default.");
              fullPath = "/";
          }
      
          const cleanPath = fullPath.replace(/\/\//g, "/");
          console.log(`🔄 Before Navigation: ${fullPath}`);
          console.log(`🚀 Final Clean Path: ${cleanPath}`);
      
          window.history.pushState({}, "", cleanPath);  
      });
      }
      const listItem = document.createElement("li");
      listItem.className = "nav-item";
      listItem.appendChild(button);
      nav.appendChild(listItem);
    });

    this.container.appendChild(nav);
    console.log(`Navigation created for ${this.container.id}`);
    console.log("Checking sidebar elements...");
  }

  updateNavbar(isLoggedIn) {
    console.log(` Updating navbar... (isLoggedIn: ${isLoggedIn})`);
    isLoggedIn = Boolean(localStorage.getItem("authToken"));
    console.log(`isLoggedIn detected: ${isLoggedIn}`);
    this.createNavbar(isLoggedIn);
  }
}

/**
 * ✅ Function to set up sidebar functionality
 */
export function setupSidebar() {
  console.log("Setting up sidebar functionality...");

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const openButton = document.getElementById("openSidebar");
  const closeButton = document.getElementById("closeSidebar");
  const sidebarNav = document.getElementById("sidebar-nav");

  if (!sidebar || !overlay || !openButton || !closeButton || !sidebarNav) {
    console.warn("Sidebar elements missing. Skipping setup.");
    return;
  }

  // Open sidebar
  openButton.addEventListener("click", () => {
    console.log("Opening sidebar...");
    sidebar.classList.remove("translate-x-full", "hidden");
    overlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden"); // Prevent scrolling
  });

  // Close sidebar function
  function closeSidebar() {
    console.log("Closing sidebar...");
    sidebar.classList.add("translate-x-full");

    setTimeout(() => {
      sidebar.classList.add("hidden"); // Hide sidebar after animation
    }, 300);

    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden"); // Restore scrolling
  }

  // Close sidebar when clicking outside or close button
  closeButton.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // ✅ Ensure sidebar closes when clicking on a link
  sidebarNav.addEventListener("click", (event) => {
    if (event.target.tagName === "A" || event.target.tagName === "BUTTON") {
      console.log("Sidebar link clicked, closing sidebar...");
      closeSidebar();
    }
  });

  console.log("Sidebar setup completed.");
}



/**
 * ✅ Function to dynamically load navigation from `navigation/navigation.html`
 */
export async function loadNavigation() {
  const navContainer = document.getElementById("navigation-container");

  if (!navContainer) {
    console.error("Navigation container not found in the DOM!");
    return;
  }

  try {
    const response = await fetch("/semester-project-2/dist/components/navigation/navigation.html");

    if (!response.ok) throw new Error("Failed to load navigation");

    const navHTML = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = navHTML;

    // Extract the correct content inside `navigation-container`
    const importedNav = tempDiv.querySelector("#navigation-container");
    
    if (importedNav) {
      navContainer.innerHTML = importedNav.innerHTML; // Only inject the inner content
      console.log("Navigation loaded successfully!");
    } else {
      console.error("Navigation container not found in imported HTML!");
      return;
    }

    // Initialize navigation
    const mainNav = document.getElementById("main-nav");
    const sidebarNav = document.getElementById("sidebar-nav");

    if (mainNav) {
      window.mainNavigation = new Navigation(
        mainNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
    }

    if (sidebarNav) {
      window.sidebarNavigation = new Navigation(
        sidebarNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
    }

    setTimeout(() => {
      setupSidebar();
    }, 300);

  } catch (error) {
    console.error("❌ Error loading navigation:", error);
  }
}

// Load navigation after defining all functions
loadNavigation();


































