import { basePath } from "@/js/api/constants.js";
import { setupListingButtons } from "@/components/buttons/index.js";

console.log("Raw URL:", window.location.href);
console.log("Extracted Query Params:", window.location.search);

export async function router(pathname = window.location.pathname) {
    console.log("Router running");
    console.log("Detected Path:", pathname);

    function clearPage() {
        console.log("Clearing page content...");
        
        let mainContainer = document.getElementById("main-container");

        if (mainContainer) {
            const newMain = document.createElement("main");
            newMain.id = "main-container";
            newMain.classList.add("main-content"); // Maintain styles

            mainContainer.replaceWith(newMain);
            console.log("Replaced #main-container to prevent duplication.");
        } else {
            console.error("No <main> container found! Creating a new one...");
            
            mainContainer = document.createElement("main");
            mainContainer.id = "main-container";
            mainContainer.classList.add("main-content");
            document.body.appendChild(mainContainer);
        }

        // Ensure navigation updates
        if (window.mainNavigation) {
            console.log("Updating Navigation...");
            window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
        }

        if (window.sidebarNavigation) {
            console.log("Updating Sidebar...");
            window.sidebarNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
        }

        console.log("Page content cleared and main-container reset.");
    }

    const cleanPathname = pathname.replace(basePath, "").split("?")[0]
        .replace("/src/pages/auth/login/login", "/login")
        .replace("/src/pages/auth/register/register", "/register")
        .replace("/src/pages/profile/profile", "/profile")
        .replace("/src/pages/manageListings/manageListings", "/manageListings")
        .replace("/src/pages/item/item", "/item")
        .replace("/src/pages/home/index", "/");

    console.log("Clean Pathname:", cleanPathname);
    console.log("Final Resolved Path:", cleanPathname);

async function loadPage(path, htmlPath, jsModule, initFunction) {
  console.clear();
  console.log(`Loading Page: ${path}`);

  clearPage(); // Clears and replaces `main-container`

  try {
    const response = await fetch(htmlPath);
    if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.statusText}`);

    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const newMainContent = doc.querySelector("#main-container");
    if (!newMainContent) {
      console.error("No #main-container found in the response!");
      return;
    }

    const currentMain = document.getElementById("main-container");
    if (currentMain) {
      currentMain.replaceWith(newMainContent);
      console.log("Successfully replaced #main-container");
    }

    // Dynamically Import and Initialize Page Script
    const module = await import(/* @vite-ignore */ jsModule);
    console.log("Loaded Module:", module);

    if (initFunction in module && typeof module[initFunction] === "function") {
      console.log(`Calling ${initFunction}()`);
      module[initFunction]();
    } else {
      console.error(`Function ${initFunction} NOT found in module.`);
    }

    console.log(`Successfully loaded ${path}`);

    // ✅ Re-initialize View Item buttons after each page change
    setupListingButtons();
    console.log("✅ setupListingButtons() re-initialized!");

  } catch (error) {
    console.error(`Error loading page (${path}):`, error);
  }
}


    try {
        switch (cleanPathname) {
            case "/":
                console.log("Home Page Detected");
                loadPage("/", "/src/index.html", "/src/pages/home/index.js", "initializeHomePage");
                break;

            case "/login":
                console.log("Login Page Detected");
                loadPage("/login", "/src/pages/auth/login/login.html", "/src/pages/auth/login/login.js", "initializeLoginPage");
                break;

            case "/register": 
                console.log("Register Page Detected");
                loadPage("/register", "/src/pages/auth/register/register.html", "/src/pages/auth/register/register.js", "initializeRegisterPage");
                break;

            case "/profile":
                console.log("Profile Page Detected");
                console.log("Checking if profile page is already initialized...", window.profilePageLoaded);

                if (window.profilePageLoaded) {
                    console.log("Skipping duplicate execution.");
                    break;
                }

                loadPage("/profile", "/src/pages/profile/profile.html", "/src/pages/profile/profile.js", "initializeProfilePage")
                    .catch(error => console.error(`Error loading Profile Page:`, error));
                break;

            case "/manageListings":
                console.log("Manage Listings Page Detected");
                loadPage("/manageListings", "/src/pages/manageListings/manageListings.html", "/src/pages/manageListings/manageListings.js", "initializeManageListingsPage");
                break;

            case "/item":
              console.log("Item Page Detected");
              
              loadPage("/item", "/src/pages/item/item.html", "/src/pages/item/item.js", "initializeItemPage")
                  .then(() => {
                      console.log("Re-initializing navigation on Item Page...");
                      if (window.mainNavigation) {
                          window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
                      }
                  })
                  .catch(error => console.error("❌ Error loading Item Page:", error));
              break;
                  
            /*    
            case "/item":
                console.log("Item Page Detected");
                
                // ✅ Ensure itemId is present before loading the page
                const params = new URLSearchParams(window.location.search);
                const itemId = params.get("id");

                if (!itemId) {
                    console.error("❌ Item ID is missing! Cannot load item page.");
                    return;
                }

                console.log(`✅ Extracted Item ID: ${itemId}`);

                loadPage("/item", "/src/pages/item/item.html", "/src/pages/item/item.js", "initializeItemPage")
                    .then(() => {
                        console.log("Re-initializing navigation on Item Page...");
                
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
                */
            default:
                console.log("Page Not Found - Loading 404");
                loadPage("/404", "/src/pages/notFound.html", "/src/pages/notFound.js", "initializeNotFoundPage");
        }
    } catch (error) {
        console.error("Router Error:", error.message);
    }
}




