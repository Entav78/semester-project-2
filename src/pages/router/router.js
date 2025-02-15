import { basePath } from "@/js/api/constants.js";
//import { initializeProfilePage } from "@/pages/profile/profile.js";
 
  
export async function router(pathname = window.location.pathname) {
  console.log("Router running");
  console.log("Detected Path:", pathname);

  function clearPage() {
    console.log("Clearing page content...");
  
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
      mainContainer.innerHTML = ""; // Clears all content inside <main>
    } else {
      console.error("No <main> container found to clear!");
    }
  
    // Ensure navigation doesn't get duplicated
    if (window.mainNavigation) {
      console.log("Updating Navigation...");
      window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
    }
  
    if (window.sidebarNavigation) {
      console.log("Updating Sidebar...");
      window.sidebarNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
    }
  
    //  Prevent duplicate `<main>` elements (optional)
    document.querySelectorAll("#main-container + #main-container").forEach(duplicate => {
      console.warn("Duplicate #main-container detected, removing...");
      duplicate.remove();
    });
  
    console.log("Page content cleared, navigation intact.");
  }
  
  const cleanPathname = pathname.replace(basePath, "").split("?")[0]
    .replace("/src/pages/auth/login/login", "/login")
    .replace("/src/pages/auth/register/register", "/register")
    .replace("/src/pages/profile/profile", "/profile")
    .replace("/src/pages/manageListings/manageListings", "/manageListings")
    .replace("/src/pages/item/item", "/item")
    .replace("/src/pages/home/index", "/");

  console.log("Clean Pathname:", cleanPathname);

  async function loadPage(path, htmlPath, jsModule, initFunction) {
    console.clear();
    console.log(`Loading Page: ${path}`);
  
    const mainContainer = document.getElementById("main-container");
if (mainContainer) {
    mainContainer.innerHTML = "";
} else {
    console.error("❌ #main-container not found!");
}

  
    // Clear old content **before loading the new page**
    clearPage(); // This ensures every page starts fresh
  
    try {
      // Fetch and update page content
      const response = await fetch(htmlPath);
      if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.statusText}`);
  
      mainContainer.innerHTML = await response.text();
  
      // Dynamically import and initialize the JavaScript module
      const module = await import(/* @vite-ignore */ jsModule);
  
      console.log("Loaded Module:", module);
      console.log("Checking module:", module);
      console.log("Available keys:", Object.keys(module));
  
      // Check if the imported module contains the expected initialization function
      if (initFunction in module && typeof module[initFunction] === "function") {
        console.log(`Calling ${initFunction}()`);
        module[initFunction](); // Call the correct initialization function
      } else {
        console.error(`Function ${initFunction} NOT found in module.`);
      }
  
      console.log(`Successfully loaded ${path}`);
  
    } catch (error) {
      console.error(`Error loading page (${path}):`, error);
    }
  }
  

  try {
    switch (cleanPathname) {
        case "/":
            console.log("Home Page Detected");
            clearPage();
            loadPage("/", "/src/index.html", "/src/pages/home/index.js", "initializeHomePage");
            break;

        case "/login":
            console.log("Login Page Detected");
            clearPage();
            loadPage("/login", "/src/pages/auth/login/login.html", "/src/pages/auth/login/login.js", "initializeLoginPage");
            break;

        case "/register": 
            console.log("Register Page Detected");
            clearPage();
            loadPage("/register", "/src/pages/auth/register/register.html", "/src/pages/auth/register/register.js", "initializeRegisterPage");
            break;

        case "/profile":
            console.log("Profile Page Detected");
            console.log("Checking if profile page is already initialized...", window.profilePageLoaded);

            if (window.profilePageLoaded) {
                console.log("Skipping duplicate execution.");
                break;
            }

            clearPage();
            //window.profilePageLoaded = true;

            loadPage("/profile", "/src/pages/profile/profile.html", "/src/pages/profile/profile.js", "initializeProfilePage")
                .catch(error => console.error(`Error loading Profile Page:`, error));
            break;

        case "/manageListings":
          console.log("Manage Listings Page Detected");
          clearPage();
          loadPage("/manageListings", "/src/pages/manageListings/manageListings.html", "/src/pages/manageListings/manageListings.js", "initializeManageListingsPage");
          break;
            

        case "/item":
          console.log("Item Page Detected");
          clearPage();
            
          loadPage("/item", "/src/pages/item/item.html", "/src/pages/item/item.js", "initializeItemPage")
              .then(() => {
                  console.log("Re-initializing navigation on Item Page...");
            
                   // If navigation is missing, re-create it
                  if (!window.mainNavigation) {
                      console.log("Navigation missing! Re-creating it...");
                      const mainNav = document.getElementById("main-nav");
                      const sidebarNav = document.getElementById("sidebar-nav");
                      const loginInstance = new Login();
                            
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
                  }
            
                  if (window.mainNavigation) {
                      window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
                  }
              }); 
          break;
                
        default:
            console.log("Page Not Found - Loading 404");
            clearPage();
            loadPage("/404", "/src/pages/notFound.html", "/src/pages/notFound.js", "initializeNotFoundPage");
      }
  } catch (error) {
      console.error("Router Error:", error.message);
  }
}



