import { API_REGISTER } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js"; // Import the router

export class Register {
  async register(data) {
    console.log("Sending data to API:", data);

    try {
        const response = await fetch(API_REGISTER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await response.json(); // Read JSON once

        if (!response.ok) {
          console.error("API Error Response:", responseData);
      
          const errorMessage = responseData.errors?.[0] || responseData.message || "Registration failed.";
          
          if (errorMessage.toLowerCase().includes("email")) {
              throw new Error("This email is already registered. Please try logging in.");
          } else if (errorMessage.toLowerCase().includes("password")) {
              throw new Error("Password must be at least 8 characters.");
          } else if (response.status === 400 && errorMessage === "Bad Request") {
              throw new Error("Registration failed. The provided details might already exist.");
          } else {
              throw new Error(`Registration failed: ${errorMessage}`);
          }
      }
      

        console.log("Successful registration response:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw error;
    }
}
  /**
   * Helper function to validate URLs
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  async handleRegister(event) {
    event.preventDefault();
    console.log("Register form submitted!");
  
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = "";
  
    const formData = new FormData(event.target);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password").trim();
    const confirmPassword = formData.get("confirmPassword").trim();
    const bio = formData.get("bio")?.trim() || "";
    const avatarUrl = formData.get("avatarUrl")?.trim();
    const avatarAlt = formData.get("avatarAlt")?.trim() || "";
    const bannerUrl = formData.get("bannerUrl")?.trim();
    const bannerAlt = formData.get("bannerAlt")?.trim() || "";
    const venueManager = formData.get("venueManager") === "on"; // Checkbox handling
  
    // userName validation: only letters, numbers, and underscores
    const userNameRegex = /^[a-zA-Z0-9_]+$/;
    if (!userNameRegex.test(name)) {
      errorDiv.textContent = "userName can only contain letters, numbers, and underscores (_).";
      return;
    }
  
    // Email validation: must end with @stud.noroff.no
    if (!email.endsWith("@stud.noroff.no")) {
      errorDiv.textContent = "Email must be a valid @stud.noroff.no address.";
      return;
    }
  
    // Password validation: at least 8 characters
    if (password.length < 8) {
      errorDiv.textContent = "Password must be at least 8 characters long.";
      return;
    }
  
    // Password confirmation check
    if (password !== confirmPassword) {
      errorDiv.textContent = "Passwords do not match!";
      return;
    }
  
    // Bio length validation
    if (bio.length > 160) {
      errorDiv.textContent = "Bio must be less than 160 characters.";
      return;
    }
  
    // Validate avatar URL if provided
    if (avatarUrl && !this.isValidURL(avatarUrl)) { // ✅ Add "this."
      errorDiv.textContent = "Invalid avatar URL.";
      return;
    }

    // Validate banner URL if provided
    if (bannerUrl && !this.isValidURL(bannerUrl)) { // ✅ Add "this."
      errorDiv.textContent = "Invalid banner URL.";
      return;
    }

  
    const userData = {
      name,
      email,
      password,
      bio,
      avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt || "" } : undefined,
      banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt || "" } : undefined,
      venueManager,
    };
  
    console.log("Sanitized registration data:", userData);
  
    try {
      const user = await this.register(userData);
      alert("Registration successful! Redirecting to login...");
  
      localStorage.setItem("user", JSON.stringify({
        userName: user.userName || user.name, // Normalize username inconsistency
        email: user.email,
        credits: user.credits || 1000, // Ensure credits are set properly
    }));
    
      // Redirect to login page
      window.history.pushState({}, "", "/login");
      router("/login");
    } catch (error) {
      console.error("Error during registration:", error.message);
      errorDiv.textContent = `Registration failed: ${error.message}`;
    }
  }
  
  
}