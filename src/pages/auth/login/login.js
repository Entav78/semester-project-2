import { router } from "@/pages/router/router.js"; // Import the router function
import { Login } from "@/js/api/login.js";

const loginInstance = new Login(); // Create an instance for use in this file

export function initializeLoginPage() {
  console.log("Login page script executing...");

  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) {
    console.error("Login form not found.");
    return;
  }

  // Clear any previous success or error messages on page load
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
      const user = await loginInstance.login(userData); // Ensure loginInstance is used

      // Remove old messages before showing success message
      document.querySelectorAll(".login-message").forEach(msg => msg.remove());

      const successMessage = document.createElement("p");
      successMessage.textContent = "🎉 Login successful! Redirecting...";
      successMessage.className = "login-message text-green-600 font-bold mt-2";
      document.body.appendChild(successMessage);

      setTimeout(() => {
        window.history.pushState({}, "", "/profile");
        document.querySelector("main").innerHTML = "";
        router("/profile"); // Ensure profile page loads properly
      }, 500);

    } catch (error) {
      errorDiv.textContent = `Login failed: ${error.message}`;
      errorDiv.className = "text-red-600 font-bold mt-2";
    }
  });
}


