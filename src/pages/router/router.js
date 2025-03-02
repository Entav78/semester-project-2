import { basePath } from "../../js/api/constants.js";
import { setupListingButtons } from "../../pages/components/buttons/buttons.js";

console.log("Raw URL:", window.location.href);
console.log("Extracted Query Params:", window.location.search);
console.log("🔍 Current basePath:", basePath);


export async function router(pathname = window.location.pathname) {
    console.log("Router running");
    console.log("Detected Path:", pathname);

    function clearPage() {
        console.log("Clearing page content...");
        
        let mainContainer = document.getElementById("main-container");

        if (mainContainer) {
            const newMain = document.createElement("main");
            newMain.id = "main-container";
            newMain.classList.add("flex-grow", "main-content");

            mainContainer.replaceWith(newMain);
            console.log("Replaced #main-container to prevent duplication.");
        } else {
            console.error("No <main> container found! Creating a new one...");
            
            mainContainer = document.createElement("main");
            mainContainer.id = "main-container";
            mainContainer.classList.add("flex-grow", "main-content");
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

    // ✅ Clean the path and normalize for local & GitHub Pages
    const cleanPathname = pathname
        .replace(basePath, "")  // Remove basePath if exists
        .replace(/^\/+/, "")    // Remove leading slashes
        .split("?")[0];         // Remove query parameters

    console.log("Clean Pathname:", cleanPathname);
    console.log("Final Resolved Path:", cleanPathname);

    async function loadPage(path, htmlPath, jsModule, initFunction) {
        console.clear();
        console.log(`🔄 Loading Page: ${path}`);

        clearPage(); // Clears and replaces `main-container`

        console.log(`📂 Fetching HTML from: ${htmlPath}`);
        console.log(`📦 Fetching JS module: ${jsModule}`);

        try {
            const response = await fetch(htmlPath);
            if (!response.ok) throw new Error(`❌ Failed to load ${htmlPath}: ${response.statusText}`);

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            const newMainContent = doc.querySelector("#main-container");
            if (!newMainContent) {
                console.error("❌ No #main-container found in the response!");
                return;
            }

            const currentMain = document.getElementById("main-container");
            if (currentMain) {
                currentMain.replaceWith(newMainContent);
                console.log("✅ Successfully replaced #main-container");
            }

            /// ✅ Dynamically Import and Initialize Page Script
            try {
                const module = await import(jsModule);
                console.log("📦 Loaded Module:", module);

                if (module[initFunction] && typeof module[initFunction] === "function") {
                    console.log(`🚀 Calling ${initFunction}()`);
                    module[initFunction]();
                } else {
                    console.error(`❌ Function ${initFunction} NOT found in module.`);
                }
            } catch (moduleError) {
                console.error(`❌ Error importing ${jsModule}:`, moduleError);
            }

            console.log(`✅ Successfully loaded ${path}`);

            // ✅ Re-initialize View Item buttons after each page change
            setupListingButtons();
            console.log("✅ setupListingButtons() re-initialized!");

        } catch (error) {
            console.error(`❌ Error loading page (${path}):`, error);
        }
    }

    try {
        switch (cleanPathname) {
            case "":
            case "home":
                loadPage("/", `${basePath}/index.html`, `${basePath}/pages/home/home.js`, "initializeHomePage");
                break;

            case "login":
                loadPage("/login", `${basePath}/pages/auth/login/login.html`, `${basePath}/pages/auth/login/login.js`, "initializeLoginPage");
                break;

            case "register":
                loadPage("/register", `${basePath}/pages/auth/register/register.html`, `${basePath}/pages/auth/register/register.js`, "initializeRegisterPage");
                break;

            case "profile":
                loadPage("/profile", `${basePath}/pages/profile/profile.html`, `${basePath}/pages/profile/profile.js`, "initializeProfilePage")
                    .catch(error => console.error(`❌ Error loading Profile Page:`, error));
                break;

            case "manageListings":
                loadPage("/manageListings", `${basePath}/pages/manageListings/manageListings.html`, `${basePath}/pages/manageListings/manageListings.js`, "initializeManageListingsPage");
                break;

                case "item":
                    loadPage("/item", `${basePath}/pages/item/item.html`, `${basePath}/pages/item/item.js`, "initializeItemPage")
                        .then(() => {
                            console.log("🔄 Re-initializing navigation on Item Page...");
                            if (window.mainNavigation) {
                                window.mainNavigation.updateNavbar(Boolean(localStorage.getItem("authToken")));
                            }
                        })
                        .catch(error => console.error("❌ Error loading Item Page:", error));
                    break;
                

            default:
                console.log("❌ Page Not Found - Loading 404");
                loadPage("/404", `${basePath}/pages/notFound.html`, `${basePath}/pages/notFound.js`, "initializeNotFoundPage")
                    .catch(error => console.error("❌ Error loading 404 Page:", error));
                break;
        }
    } catch (error) {
        console.error("❌ Router Error:", error.message);
    }
}

// ✅ Run the router immediately
router(window.location.pathname);
                    

