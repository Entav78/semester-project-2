import { Navigation } from "@/components/navigation/index.js";

export async function router(pathname = window.location.pathname) {
  console.log("🚀 Router running");
  console.log("📌 Detected Path:", pathname);

  const cleanPathname = pathname.replace(/\/$/, ""); // Normalize path
  console.log("📌 Clean Pathname:", cleanPathname);

  try {
    let pageHtml = "";
    switch (true) {
      case cleanPathname === "":
      case cleanPathname === "/":
        console.log("🏠 Loading Home Page...");
        pageHtml = await fetch("/index.html").then((res) => res.text());
        await import("@/pages/home/index.js");
        break;

      case cleanPathname.startsWith("/auth/register"):
        console.log("🆕 Loading Register Page...");
        pageHtml = await fetch("/src/pages/auth/register/register.html").then((res) => res.text());
        await import("@/pages/auth/register/register.js");
        break;

      case cleanPathname.startsWith("/auth/login"):
        console.log("🔑 Loading Login Page...");
        pageHtml = await fetch("/src/pages/auth/login/login.html").then((res) => res.text());
        await import("@/pages/auth/login/login.js");
        break;

      case cleanPathname.startsWith("/profile"):
        console.log("👤 Loading Profile Page...");
        pageHtml = await fetch("/src/pages/profile/profile.html").then((res) => res.text());
        await import("@/pages/profile/profile.js");
        break;

      default:
        console.log("❓ Page Not Found - Loading 404");
        pageHtml = await fetch("/src/pages/notFound.html").then((res) => res.text());
    }

    // ✅ Replace current body with new page content
    document.body.innerHTML = pageHtml;

    // ✅ Reinitialize Navigation After Page Change
    setTimeout(() => {
      const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
      const navContainers = document.querySelectorAll(".navbar-nav");
      navContainers.forEach((container) => new Navigation(container, isLoggedIn));
    }, 100);
  } catch (error) {
    console.error("❌ Router Error:", error.message);
  }
}








