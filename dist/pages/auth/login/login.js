import { router } from "../../router/router.js";  
import { Login } from "../../../js/api/login.js";  

const loginInstance = new Login(); // Create an instance for use in this file

export function initializeLoginPage() {
  console.log("Login page script executing...");

  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) {
    console.error("Login form not found.");
    return;
  }

  // Remove old login messages (but DO NOT clear main-container yet)
  document.querySelectorAll(".login-message").forEach(msg => msg.remove());

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Login form submitted!");

    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = ""; // Clear previous errors

    const formData = new FormData(event.target);

    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Submitting login data:", userData);

    try {
      const user = await loginInstance.login(userData);

      // Remove old messages before adding a new one
      document.querySelectorAll(".login-message").forEach(msg => msg.remove());

      // Create success message **inside** main-container
      const successMessage = document.createElement("p");
      successMessage.textContent = "Login successful! Redirecting...";
      successMessage.className = "login-message text-green-600 font-bold mt-2 text-center";

      const mainContainer = document.getElementById("main-container");
      if (mainContainer) {
        mainContainer.appendChild(successMessage); // Now inside main-container
      }

      setTimeout(() => {
        window.history.pushState({}, "", "/profile");

        // NOW clear the main-container before routing
        if (mainContainer) {
          mainContainer.innerHTML = "";
        }

        router("/profile");
      }, 500);

    } catch (error) {
      errorDiv.textContent = `Login failed: ${error.message}`;
      errorDiv.className = "text-red-600 font-bold mt-2";
    }
  });
}




