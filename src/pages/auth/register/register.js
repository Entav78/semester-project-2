import { Register } from "@/js/api/register.js";

export function initializeRegisterPage() {
  console.log("Register page script executing...");

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
      console.log("✅ Register form detected. Initializing event listener.");
      const registerInstance = new Register();
      
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Stop default submission
        console.log("🔄 Processing registration...");

        // Get the error message div
        const errorDiv = document.getElementById("errorMessage");
        if (errorDiv) {
            errorDiv.textContent = ""; // Clear previous errors
            errorDiv.classList.add("hidden"); // Hide initially
        }

        try {
            await registerInstance.handleRegister(event);
        } catch (error) {
            console.error("❌ Registration failed:", error.message);

            if (errorDiv) {
                errorDiv.textContent = `❌ ${error.message}`;
                errorDiv.classList.remove("hidden"); // Show the error
            } else {
                console.warn("⚠️ Error message container not found in HTML.");
            }
        }
      });

  } else {
      console.warn("⚠️ No register form found on this page!");
  }
}

