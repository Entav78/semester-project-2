export default class Navigation {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.overlay = document.getElementById("overlay");

    if (!this.sidebar || !this.overlay) {
      console.warn("⚠️ Navigation elements missing. Navigation not initialized.");
      return;
    }

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

    console.log("🍔 Navigation initialized.");
  }

  toggleNav() {
    console.log("🍔 Toggling sidebar...");
    this.sidebar.classList.toggle("sidebar-open");
    this.overlay.classList.toggle("overlay-visible");
  }
}



