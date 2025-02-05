export default async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

  const cleanPathname = pathname.split("?")[0] || "/";

  console.log("📌 Clean Pathname:", cleanPathname);

  try {
    switch (true) {
      case cleanPathname === "/":
        console.log("🏠 Loading Home Page...");
        await import("@/pages/home/index.js").then((module) => {
          console.log("✅ home/index.js LOADED", module);
        });
        break;
      case cleanPathname.startsWith("/src/pages/item"):
        console.log("🛒 Loading Item Page...");
        await import("@/pages/item/item.js").then((module) => {
          console.log("✅ item/item.js LOADED", module);
        });
        break;
      case cleanPathname === "/src/auth/login":
        console.log("🔑 Loading Login Page...");
        await import("@/pages/auth/login/login.js");
        break;
      case cleanPathname === "/src/auth/register":
        console.log("🆕 Loading Register Page...");
        await import("@/pages/auth/register/register.js");
        break;
      case cleanPathname === "/src/profile":
        console.log("👤 Loading Profile Page...");
        await import("@/pages/profile/profile.js");
        break;
      default:
        console.log("❓ Page Not Found - Loading 404");
        await import("@/pages/notFound.js");
    }
  } catch (error) {
    console.error("❌ Router Error:", error.message);
  }
}


