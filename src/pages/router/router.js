import { basePath } from "@/js/api/constants.js";

export default async function router(pathname = window.location.pathname) {
  console.log("Router running");

  const cleanPathname = pathname.replace(basePath, "") || "/";
  console.log("Clean Pathname:", cleanPathname);

  try {
    switch (cleanPathname) {
      case "/":
        await loadPage("home"); // Dynamically load the home page
        break;
      case "/auth/login/":
        await loadPage("auth/login"); // Dynamically load the login page
        break;
      case "/auth/register/":
        await loadPage("auth/register"); // Dynamically load the register page
        break;
      case "/listings/":
        await loadPage("listings"); // Dynamically load the listings page
        break;
      case "/profile/":
        if (authGuard("/auth/login/")) {
          await loadPage("profile"); // Load profile only if authenticated
        }
        break;
      default:
        await loadPage("notFound"); // 404 page
    }
  } catch (error) {
    console.error("Router Error:", error.message);
  }
}

// Helper function to load a page dynamically
async function loadPage(page) {
  try {
    // Dynamically import HTML, JS, and SCSS for the page
    const [htmlModule, jsModule] = await Promise.all([
      import(`../pages/${page}/index.html`, { assert: { type: "html" } }),
      import(`../pages/${page}/index.js`),
    ]);

    // Insert the page's HTML into the main container
    document.getElementById("app").innerHTML = htmlModule.default;

    // Initialize the page-specific JavaScript
    if (typeof jsModule.default === "function") {
      jsModule.default(); // Call the default export
    }
  } catch (error) {
    console.error(`Error loading page "${page}":`, error.message);
  }
}
