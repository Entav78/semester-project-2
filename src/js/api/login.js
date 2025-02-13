import { API_LOGIN } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js";


export class Login {
  async login(data) {
    console.log("🔑 Sending login request with:", data);

    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("❌ Login failed:", errorResponse);
        throw new Error(errorResponse.message || "Invalid credentials.");
      }

      const responseData = await response.json();
      console.log("✅ Login successful:", responseData);

      localStorage.setItem("authToken", responseData.data.accessToken);
      localStorage.setItem("user", JSON.stringify(responseData.data));
      localStorage.setItem("userName", responseData.data.name);

      return responseData;
    } catch (error) {
      console.error("❌ Error during login:", error.message);
      throw error;
    }
  }

  updateNavigation(isLoggedIn) {
    if (window.mainNavigation) {
      window.mainNavigation.updateNavbar(isLoggedIn);
    }
    if (window.sidebarNavigation) {
      window.sidebarNavigation.updateNavbar(isLoggedIn);
    }
  }

  async handleLogin(event) { 
    event.preventDefault();
    console.log("🔄 Login form submitted!");

    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = "";

    const formData = new FormData(event.target);

    const userData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    console.log("📩 Submitting login data:", userData);

    try {
        await this.login(userData);

        // ✅ Remove any existing login message BEFORE adding a new one
        document.querySelectorAll(".login-message").forEach(msg => msg.remove());
        console.log("🗑️ Old login messages removed before adding a new one.");

        // ✅ Add a fresh success message
        const successMessage = document.createElement("p");
        successMessage.textContent = "🎉 Login successful! Redirecting...";
        successMessage.className = "text-green-600 font-bold mt-2 login-message";
        document.body.appendChild(successMessage);

        this.updateNavigation(true);

        setTimeout(() => {
          console.log("🔄 Redirecting to profile...");
          window.history.pushState({}, "", "/profile");
      
          // ✅ Ensure page content resets before loading new page
          const mainContent = document.querySelector("main");
          if (mainContent) {
              mainContent.innerHTML = "";
          }
      
          router("/profile");
      
          // ✅ Extra cleanup: Force remove **any lingering login messages**
          setTimeout(() => {
              document.querySelectorAll(".login-message").forEach(msg => {
                  console.log("🗑️ Removing lingering login message...");
                  msg.remove();
              });
              console.log("✅ Login message removed after redirect.");
          }, 200); // Small delay to ensure it's executed **after** the page renders
      
      }, 500);
      
    } catch (error) {
        errorDiv.textContent = `Login failed: ${error.message}`;
        errorDiv.className = "text-red-600 font-bold mt-2";
    }
}






  handleLogout() {
    console.log("🚪 Logging out user...");
    localStorage.removeItem("authToken");  
    localStorage.removeItem("user");
    localStorage.removeItem("userName");

    document.body.classList.remove("user-logged-in");

    console.log("🗑️ LocalStorage cleared!");

    this.updateNavigation(false); // ✅ Update navigation once

    // ✅ Reset profile page initialization flag  
    window.profilePageLoaded = false; 

    // ✅ Always navigate to home after logout
    console.log("🔄 Redirecting to Home...");
    window.history.pushState({}, "", "/");

    setTimeout(() => {
        document.querySelector("main").innerHTML = "";
        router("/"); // ✅ Ensure home page loads correctly
    }, 200);
  }
}




