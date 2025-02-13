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
      const responseData = await this.login(userData);

      localStorage.setItem("authToken", responseData.data.accessToken);
      localStorage.setItem("user", JSON.stringify(responseData.data));
      localStorage.setItem("userName", responseData.data.name); 

      this.updateNavigation(true); // ✅ Update navigation once

      // **🔧 Fix: Remove any old success messages before adding a new one**
      document.querySelectorAll(".login-success").forEach(msg => msg.remove());

      const successMessage = document.createElement("p");
      successMessage.textContent = "🎉 Login successful! Redirecting...";
      successMessage.className = "text-green-600 font-bold mt-2 login-success"; // ✅ Unique class
      document.body.appendChild(successMessage);

      setTimeout(() => {
        window.history.pushState({}, "", "/profile");
        document.querySelector("main").innerHTML = ""; // 🧹 Clear main content
        router("/profile"); // ✅ Ensure full page refresh
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

    // ✅ Always navigate to home after logout
    console.log("🔄 Redirecting to Home...");
    window.history.pushState({}, "", "/");

    setTimeout(() => {
        document.querySelector("main").innerHTML = "";
        router("/"); // ✅ Ensure home page loads correctly
    }, 200);
  }
}




