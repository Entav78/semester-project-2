/* testing another debugging version
import { Register } from "@/js/api/register.js";

export function initializeRegisterPage() {
  console.log("✅ Register page script executing...");

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    console.log("✅ Register form detected. Initializing event listener.");
    const registerInstance = new Register();
    registerForm.addEventListener("submit", (event) => registerInstance.handleRegister(event));
  } else {
    console.warn("⚠️ No register form found on this page!");
  }
}


// Ensure it runs if the page is directly loaded
if (document.readyState === "complete") {
  initializeRegisterPage();
} else {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      initializeRegisterPage();
    }
  });
}
*/
console.log("✅ Register script is running!");

import { Register } from "@/js/api/register.js";

export function initializeRegisterPage() {
  console.log("✅ Register page script executing...");

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
      console.log("✅ Register form detected. Initializing event listener.");
      const registerInstance = new Register();
      registerForm.addEventListener("submit", (event) => registerInstance.handleRegister(event));
  } else {
      console.warn("⚠️ No register form found on this page!");
  }
}

