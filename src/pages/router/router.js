import { basePath } from "@/js/api/constants.js";

export async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

  const cleanPathname = pathname.replace(basePath, "").split("?")[0] || "/";

  console.log("📌 Clean Pathname:", cleanPathname);

  try {
    switch (cleanPathname) {
      case "/":
        console.log("🏠 Home Page Detected");
        break;

      case "/item":
        console.log("🛒 Item Page Detected");
        break;

      case "/manageListings":
        console.log("📦 Manage Listings Page Detected");
        break;

      case "/register":
        console.log("🆕 Register Page Detected");
        break;

      case "/login":
        console.log("🔑 Login Page Detected");
        break;

      case "/profile":
        console.log("👤 Profile Page Detected");
        break;

      default:
        console.log("❓ Page Not Found - Loading 404");
        await import("@/pages/notFound.js");
    }  
  } catch (error) {
    console.error("❌ Router Error:", error.message);
  }
}











