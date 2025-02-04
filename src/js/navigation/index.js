export default class Navigation {
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

    this.openSidebar.addEventListener("click", () => this.toggleNav());
    this.closeSidebar.addEventListener("click", () => this.toggleNav());
    this.overlay.addEventListener("click", () => this.toggleNav());

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

  toggleNav() {
    console.log("🍔 Toggling sidebar...");
    this.sidebar.classList.toggle("sidebar-open");
    this.overlay.classList.toggle("overlay-visible");
  }
}


