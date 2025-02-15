import { Register } from "@/js/api/register.js";

export function initializeRegisterPage() {
  console.log("Register page script executing...");

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
      console.log("Register form detected. Initializing event listener.");
      const registerInstance = new Register();
      registerForm.addEventListener("submit", (event) => registerInstance.handleRegister(event));
  } else {
      console.warn("No register form found on this page!");
  }
}

