import { API_LOGIN } from "@/js/api/constants.js";

export class Login {
  /**
   * Logs in a user with the provided credentials.
   * 
   * @param {Object} data - The login data.
   * @param {string} data.email - The user's email.
   * @param {string} data.password - The user's password.
   * @returns {Promise<Object>} - The logged-in user's data.
   */
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          userName: responseData.data.userName,
          email: responseData.data.email,
          accessToken: responseData.data.accessToken, // ✅ Ensure token is inside "user"
          avatar: responseData.data.avatar || {},
          banner: responseData.data.banner || {},
        })
      );
      localStorage.setItem("authToken", responseData.data.accessToken); // ✅ Separate storage for token
      

      return responseData;
    } catch (error) {
      console.error("❌ Error during login:", error.message);
      throw error;
    }
  }

  /**
   * Handles login form submission.
   * @param {Event} event - The form submission event.
   */
  async handleLogin(event) {
    event.preventDefault();
    console.log("🔄 Login form submitted!");

    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = ""; // Clear previous errors

    const formData = new FormData(event.target);

    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("📩 Submitting login data:", userData);

    try {
      const user = await this.login(userData);
    
      // Store authentication token & user info in localStorage
      localStorage.setItem("authToken", responseData.data.accessToken);
      localStorage.setItem("user", JSON.stringify(responseData.data));
    
      // Create a success message element dynamically
      const successMessage = document.createElement("p");
      successMessage.textContent = "🎉 Login successful! Redirecting...";
      successMessage.className = "text-green-600 font-bold mt-2"; 
      document.body.appendChild(successMessage); 
    
      // Redirect after a short delay (for better UX)
      setTimeout(() => {
        window.location.href = "/src/pages/profile/profile.html";
      }, 1500); // 1.5s delay
    
    } catch (error) {
      // Display error message dynamically
      errorDiv.textContent = `Login failed: ${error.message}`;
      errorDiv.className = "text-red-600 font-bold mt-2";
    }
  }  
}
