console.log("✅ Navigation script is running!");

export default class Navigation {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.overlay = document.getElementById("overlay");
    this.openButton = document.getElementById("openSidebar");
    console.log("🔍 Checking openSidebar button:", document.getElementById("openSidebar"));
    this.closeButton = document.getElementById("closeSidebar");

    if (!this.sidebar || !this.overlay || !this.openButton || !this.closeButton) {
      console.warn("⚠️ Navigation elements missing. Navigation not initialized.");
      return;
    }

    this.openButton.addEventListener("click", () => this.toggleNav(true));
    this.closeButton.addEventListener("click", () => this.toggleNav(false));
    this.overlay.addEventListener("click", () => this.toggleNav(false));

    console.log("🍔 Navigation initialized.");
  }

  toggleNav(open) {
    console.log(open ? "📂 Opening sidebar..." : "📂 Closing sidebar...");
    if (open) {
      this.sidebar.classList.remove("translate-x-full");
      this.overlay.classList.remove("hidden");
    } else {
      this.sidebar.classList.add("translate-x-full");
      this.overlay.classList.add("hidden");
    }
  }
}








