import { API_LOGIN } from "/semester-project-2/dist/js/api/constants.js";  // ✅ Works on GitHub Pages


export class Login {
  async login(data) {
    console.log("Sending login request with:", data);
  
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json(); // Read JSON response
  
      if (!response.ok) {
        console.error("📡 Full API Error Response:", responseData);
  
        // ✅ Extract error message correctly
        const errorMessage = responseData.errors?.[0]?.message || "Invalid credentials.";
        
        throw new Error(errorMessage); // Pass the correct error
      }
  
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

  handleLogout() {
    console.log("Logging out user...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");

    document.body.classList.remove("user-logged-in");

    console.log("LocalStorage cleared!");

    this.updateNavigation(false);

    // Reset profile page initialization flag
    window.profilePageLoaded = false;

    console.log("Redirecting to Home...");
    window.history.pushState({}, "", "/");

    setTimeout(() => {
      const mainContainer = document.getElementById("main-container");
      if (mainContainer) {
        mainContainer.innerHTML = "";
      }
      router("/");
    }, 200);
  }
}






