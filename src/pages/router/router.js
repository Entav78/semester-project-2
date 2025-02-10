import { initializeHomePage } from "@/pages/home/index.js";
import { basePath } from "@/js/api/constants.js";
import { initializeLoginPage } from "@/pages/auth/login/login.js";
import { initializeRegisterPage } from "@/pages/auth/register/register.js";



export async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

  const cleanPathname = pathname.replace(basePath, "").split("?")[0] || "/";

  console.log("📌 Clean Pathname:", cleanPathname);

  try {
    switch (true) {
      case cleanPathname === "/":
        console.log("🏠 Loading Home Page...");
        initializeHomePage();
        break;

      case cleanPathname.startsWith("/src/pages/item"):
        console.log("🛒 Loading Item Page...");
        await import("@/pages/item/item.js").then((module) => {
          if (module.initializeItemPage) {
            module.initializeItemPage();
          }
        });
        break;

      case cleanPathname === "/src/pages/manageListings/manageListings":
        console.log("🛒 Loading Manage Listings Page...");
        initializeManageListingsPage();
        break;
  

      case cleanPathname === `${basePath}/src/pages/auth/register/register`:
        console.log("🆕 Loading Register Page...");
        initializeRegisterPage(); 
        break;

      case cleanPathname === `${basePath}/src/pages/auth/login/login`:
        console.log("🔑 Loading Login Page...");
        initializeLoginPage();
        break;

      case cleanPathname === "/profile":
        console.log("👤 Loading Profile Page...");
        await import("@/pages/profile/profile.js").then((module) => {
          if (module.initializeProfilePage) {
            module.initializeProfilePage();
          }
        });
        break;

      default:
        console.log("❓ Page Not Found - Loading 404");
        await import("@/pages/notFound.js");
    }  

  } catch (error) {
    console.error("❌ Router Error:", error.message);
  }
}










