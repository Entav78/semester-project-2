import { basePath } from "@/js/api/constants.js";
//import  initializeProfilePage  from "@/pages/profile/profile.js";

export async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

  const cleanPathname = pathname.replace(basePath, "").split("?")[0]
    .replace("/src/pages/auth/login/login", "/login")
    .replace("/src/pages/auth/register/register", "/register")
    .replace("/src/pages/profile/profile", "/profile")
    .replace("/src/pages/manageListings/manageListings", "/manageListings")
    .replace("/src/pages/item/item", "/item")
    .replace("/src/pages/home/index", "/");

  console.log("📌 Clean Pathname:", cleanPathname);

  async function loadPage(path, htmlPath, jsModule, initFunction) {
    console.clear();
    console.log(`🔍 Loading Page: ${path}`);

    const mainContainer = document.querySelector("main");
    if (!mainContainer) {
      console.error("❌ <main> container not found. Ensure your HTML has a <main> element.");
      return;
    }

    try {
      // ✅ Fetch and update page content
      const response = await fetch(htmlPath);
      if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.statusText}`);

      mainContainer.innerHTML = await response.text();

      // ✅ Dynamically import and initialize the JavaScript module
      const module = await import(/* @vite-ignore */ jsModule);

      console.log("✅ Loaded Module:", module);
      console.log("🛠️ Checking module:", module);
      console.log("🛠️ Available keys:", Object.keys(module));

      if (module.initializeProfilePage) {
        module.initializeProfilePage(); // ✅ Correct way for named export
      } else {
        console.error("❌ Function initializeProfilePage NOT found in module.");
      }
      
      
  
      console.log(`✅ Successfully loaded ${path}`);
  
    } catch (error) {
      console.error(`❌ Error loading page (${path}):`, error);
    }
  }

  try {
    switch (cleanPathname) {
      case "/":
        console.log("🏠 Home Page Detected");
        loadPage("/", "/src/index.html", "@/pages/home/index.js", "initializeHomePage");
        break;

      case "/login":
        console.log("🔑 Login Page Detected");
        loadPage("/login", "/src/pages/auth/login/login.html", "@/pages/auth/login/login.js", "initializeLoginPage");
        break;

      case "/register":
        console.log("🆕 Register Page Detected");
        loadPage("/register", "/src/pages/auth/register/register.html", "@/pages/auth/register/register.js", "initializeRegisterPage");
        break;

        case "/profile":
          console.log("👤 Profile Page Detected");
          console.log("🔍 Importing profile script...");

        loadPage("/profile", "/src/pages/profile/profile.html", "/src/pages/profile/profile.js", "initializeProfilePage")
        .catch(error => console.error(`❌ Error loading Profile Page:`, error));

        break;
        


      case "/manageListings":
        console.log("📦 Manage Listings Page Detected");
        loadPage("/manageListings", "/src/pages/manageListings/manageListings.html", "@/pages/manageListings/manageListings.js", "initializeManageListingsPage");
        break;

      case "/item":
        console.log("🛒 Item Page Detected");
        loadPage("/item", "/src/pages/item/item.html", "@/pages/item/item.js", "initializeItemPage");
        break;

      default:
        console.log("❓ Page Not Found - Loading 404");
        loadPage("/404", "/src/pages/notFound.html", "@/pages/notFound.js", "initializeNotFoundPage");
    }
  } catch (error) {
    console.error("❌ Router Error:", error.message);
  } // ✅ Properly closing try-catch block
  console.log("🔍 Window location pathname:", window.location.pathname);
console.log("🔍 Clean Pathname:", cleanPathname);

}



