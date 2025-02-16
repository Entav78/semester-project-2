import { router } from "@/pages/router/router.js";
import { basePath } from "@/js/api/constants.js";
import { Login } from "@/js/api/login.js";

const loginInstance = new Login(); // ✅ Create an instance of the Login class

export class Navigation {
  constructor(container, isLoggedIn) {
    if (!container) {
      console.error("❌ Navigation container not found.");
      return;
    }

    this.container = container;
    this.isLoggedIn = isLoggedIn;

    console.log(`✅ Creating Navigation for: ${this.container.id || "Unknown Element"}`);

    this.createNavbar(isLoggedIn);

    if (this.container.id === "sidebar-nav") {
      this.setupSidebar();
    }
  }

  handleLogout() {
    console.log("🚪 Logging out...");
  
    // ✅ Clear all user-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
  
    console.log("🔄 Updating navigation after logout...");
  
    // ✅ Ensure navigation updates before redirecting
    if (window.mainNavigation) {
        console.log("🔄 Updating main navigation after logout...");
        window.mainNavigation.updateNavbar(false);
    } else {
        console.warn("⚠️ mainNavigation not found! Creating a new instance...");
        const mainNav = document.getElementById("main-nav");
        if (mainNav) {
          window.mainNavigation = new Navigation(mainNav, false, this.handleLogout.bind(this));
          console.log("✅ mainNavigation initialized after logout!");
        }
    }
  
    if (window.sidebarNavigation) {
        console.log("🔄 Updating sidebar navigation after logout...");
        window.sidebarNavigation.updateNavbar(false);
    } else {
        console.warn("⚠️ sidebarNavigation not found! Creating a new instance...");
        const sidebarNav = document.getElementById("sidebar-nav");
        if (sidebarNav) {
          window.sidebarNavigation = new Navigation(sidebarNav, false, this.handleLogout.bind(this));
          console.log("✅ sidebarNavigation initialized after logout!");
        }
    }
  
    // ✅ Always navigate to home after logout
    console.log("Redirecting to Home...");
    window.history.pushState({}, "", "/");
    router("/");
  
    // ✅ Delay reload of navigation to ensure UI updates
    setTimeout(() => {
      console.log("🔄 Reloading navigation...");
      loadNavigation(); // ✅ Reload the nav bar to reflect changes
    }, 200);
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
      { text: "Login", path: `${basePath}/login`, show: !isLoggedIn },
      { text: "Register", path: `${basePath}/register`, show: !isLoggedIn },
      { text: "Logout", path: "#", show: isLoggedIn, action: this.handleLogout.bind(this) }, // ✅ Fix: Bind `handleLogout`
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
    console.log(`✅ Navigation created for ${this.container.id}`);
  }

  setupSidebar() {
    console.log("🛠️ Setting up sidebar functionality...");

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const openButton = document.getElementById("openSidebar");
    const closeButton = document.getElementById("closeSidebar");

    if (!sidebar || !overlay || !openButton || !closeButton) {
      console.warn("⚠️ Sidebar elements missing. Skipping sidebar setup.");
      return;
    }

    openButton.addEventListener("click", () => {
      console.log("🍔 Opening sidebar...");
      sidebar.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
    });

    closeButton.addEventListener("click", () => {
      console.log("❌ Closing sidebar...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    overlay.addEventListener("click", () => {
      console.log("🛑 Closing sidebar via overlay...");
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    });

    console.log("✅ Sidebar setup completed.");
  }

  updateNavbar(isLoggedIn) {
    console.log(`🔄 Updating navbar... (isLoggedIn: ${isLoggedIn})`);

    // Wait for DOM to be ready before updating navigation
    if (!document.getElementById("navigation-container")) {
        console.warn("⚠️ Navigation container not found. Retrying...");
        setTimeout(() => {
            this.updateNavbar(isLoggedIn);
        }, 100);
        return;
    }

    // ✅ Ensure `isLoggedIn` is up-to-date
    isLoggedIn = Boolean(localStorage.getItem("authToken"));
    console.log(`✅ isLoggedIn detected: ${isLoggedIn}`);

    this.createNavbar(isLoggedIn); // ✅ Refresh the navigation
  }
}

/**
 * Function to dynamically load navigation from `navigation/index.html`
 */
export async function loadNavigation() {
  const navContainer = document.getElementById("navigation-container");

  if (!navContainer) {
    console.error("❌ Navigation container not found in the DOM!");
    return;
  }

  try {
    const response = await fetch("/src/components/navigation/index.html");
    if (!response.ok) throw new Error("❌ Failed to load navigation");

    const navHTML = await response.text();
    navContainer.innerHTML = navHTML;
    console.log("✅ Navigation loaded successfully!");

    // Find navigation elements in the newly injected HTML
    const mainNav = document.getElementById("main-nav");
    const sidebarNav = document.getElementById("sidebar-nav");

    if (mainNav) {
      window.mainNavigation = new Navigation(
        mainNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
      console.log("✅ window.mainNavigation initialized.");
    } else {
      console.warn("⚠️ mainNav not found.");
    }

    if (sidebarNav) {
      window.sidebarNavigation = new Navigation(
        sidebarNav,
        Boolean(localStorage.getItem("authToken")),
        loginInstance.handleLogout.bind(loginInstance)
      );
      console.log("✅ window.sidebarNavigation initialized.");
    } else {
      console.warn("⚠️ sidebarNav not found.");
    }

    // ✅ Ensure sidebar gets populated correctly
    populateSidebar(loginInstance.handleLogout.bind(loginInstance));

    // ✅ Delay sidebar event attachment to ensure elements exist
    setTimeout(() => {
      attachSidebarEvents();
    }, 100);

  } catch (error) {
    console.error("❌ Error loading navigation:", error);
  }
}


/**
 * Function to populate sidebar navigation dynamically
 */
function populateSidebar(handleLogout) {
  const sidebarNav = document.getElementById("sidebar-nav");

  if (!sidebarNav) {
    console.error("⚠️ Sidebar navigation container NOT found!");
    return;
  }

  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  console.log("🔑 User is logged in:", isLoggedIn);

  sidebarNav.innerHTML = "";

  const sidebarItems = [
    { text: "Home", path: `${basePath}/` },
    { text: "Profile", path: `${basePath}/profile`, show: isLoggedIn },
    { text: "Manage Listings", path: `${basePath}/manageListings`, show: isLoggedIn },
    { text: "Login", path: `${basePath}/login`, show: !isLoggedIn },
    { text: "Register", path: `${basePath}/register`, show: !isLoggedIn },
    { text: "Logout", path: "#", show: isLoggedIn, action: handleLogout },
  ];

  sidebarItems.forEach(({ text, path, show, action }) => {
    if (show !== undefined && !show) return;

    const button = document.createElement("button");
    button.textContent = text;
    button.className = "block p-2 text-white hover:bg-gray-700 w-full text-left";
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

    sidebarNav.appendChild(button);
  });
}

/**
 * Function to attach event listeners for opening/closing the sidebar
 */
function attachSidebarEvents() {
  console.log("✅ Attaching sidebar event listeners...");
  const openSidebarBtn = document.getElementById("openSidebar");
  if (!openSidebarBtn) console.error("❌ openSidebar button missing!");
}

loadNavigation();





























