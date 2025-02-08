import { Login } from "@/js/api/login.js";

export function initializeLoginPage() {
  console.log("✅ Login page script executing...");

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    console.log("✅ Login form detected. Initializing event listener.");
    const loginInstance = new Login();
    loginForm.addEventListener("submit", (event) => loginInstance.handleLogin(event));
  } else {
    console.warn("⚠️ No login form found on this page!");
  }
}
