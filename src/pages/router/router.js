import { basePath } from "@/js/api/constants.js";
//import { initializeProfilePage } from "@/pages/profile/profile.js";
 
  
export async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

function clearPage() {
  const mainContent = document.querySelector("main");
  if (mainContent) {
      mainContent.innerHTML = ""; // ✅ Clear only page content, NOT navigation
  }

  // ✅ Keep navigation intact, only update if necessary
  if (window.mainNavigation) {
      console.log("🔄 Re-initializing Navigation...");
      window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
  }
  if (window.sidebarNavigation) {
      console.log("🔄 Re-initializing Sidebar...");
      window.sidebarNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
  }
}


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
  
    // 🧹 Clear old content **before loading the new page**
    clearPage(); // ✅ This ensures every page starts fresh
  
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
  
      // ✅ Check if the imported module contains the expected initialization function
      if (initFunction in module && typeof module[initFunction] === "function") {
        console.log(`🚀 Calling ${initFunction}()`);
        module[initFunction](); // ✅ Call the correct initialization function
      } else {
        console.error(`❌ Function ${initFunction} NOT found in module.`);
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
        clearPage();
        loadPage("/", "/src/index.html", "/src/pages/home/index.js", "initializeHomePage");
        break;

      case "/login":
        console.log("🔑 Login Page Detected");
        clearPage();
        loadPage("/login", "/src/pages/auth/login/login.html", "/src/pages/auth/login/login.js", "initializeLoginPage");
        break;

        case "/profile":
          console.log("👤 Profile Page Detected");
          console.log("🔄 Checking if profile page is already initialized...", window.profilePageLoaded);
          
          if (window.profilePageLoaded) {
            console.log("⚠️ Skipping duplicate execution.");
            break;
          }
  
          // ✅ Reset content before loading profile page
          clearPage(); // ✅ Ensure previous content is removed
          window.profilePageLoaded = true;
          
          loadPage("/profile", "/src/pages/profile/profile.html", "/src/pages/profile/profile.js", "initializeProfilePage")
            .catch(error => console.error(`❌ Error loading Profile Page:`, error));
          
          break;
        


      case "/manageListings":
        console.log("📦 Manage Listings Page Detected");
        clearPage();
        loadPage("/manageListings", "/src/pages/manageListings/manageListings.html", "/src/pages/manageListings/manageListings.js", "initializeManageListingsPage");
        break;

      case "/item":
        console.log("🛒 Item Page Detected");
        clearPage();
        loadPage("/item", "/src/pages/item/item.html", "/src/pages/item/item.js", "initializeItemPage");
        break;

      default:
        console.log("❓ Page Not Found - Loading 404");
        clearPage();
        loadPage("/404", "/src/pages/notFound.html", "/src/pages/notFound.js", "initializeNotFoundPage");
    }
  } catch (error) {
    console.error("❌ Router Error:", error.message);
  } // ✅ Properly closing try-catch block
  console.log("🔍 Window location pathname:", window.location.pathname);
console.log("🔍 Clean Pathname:", cleanPathname);

}



