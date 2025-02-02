import router from "@/pages/router/router.js";

export class Navigation {
  constructor() {
    console.log("🔍 Checking if navigation elements exist...");

    this.sidebar = document.getElementById("sidebar");
    this.overlay = document.getElementById("overlay");
    this.openSidebar = document.getElementById("openSidebar");
    this.closeSidebar = document.getElementById("closeSidebar");

    if (!this.sidebar || !this.overlay || !this.openSidebar || !this.closeSidebar) {
      console.error("❌ Navigation elements not found in DOM.");
      return;
    }

    console.log("✅ Navigation elements found, adding event listeners...");

    this.openSidebar.addEventListener("click", () => this.openNav());
    this.closeSidebar.addEventListener("click", () => this.closeNav());
    this.overlay.addEventListener("click", () => this.closeNav());

    // Attach router functionality to navigation links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents default page reload
        const page = event.target.getAttribute("data-page");
        if (page) {
          console.log(`📌 Navigating to /${page}/ via Router`);
          router(`/${page}/`); // Call the router instead of changing window.location
        }
      });
    });
  }

  openNav() {
    this.sidebar.classList.remove("translate-x-full");
    this.sidebar.classList.add("scale-100");
    this.overlay.classList.remove("hidden");
    this.overlay.classList.add("opacity-100");
    this.openSidebar.classList.add("hidden");
  }

  closeNav() {
    this.sidebar.classList.add("translate-x-full");
    this.sidebar.classList.remove("scale-100");
    this.overlay.classList.add("hidden");
    this.overlay.classList.remove("opacity-100");
    this.openSidebar.classList.remove("hidden");
  }
}

