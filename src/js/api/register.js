import { API_REGISTER } from "./../js/api/constants.js";
import { router } from "./../pages/router/router.js"; // Import the router

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
        console.error("📡 Full API Error Response:", responseData);

        // ✅ Extract error messages properly
        const errorMessage =
          responseData.errors?.map(e => e.message).join(", ") || 
          responseData.message || 
          "Registration failed.";

        throw new Error(errorMessage); // Ensure proper error handling
      }

      console.log("✅ Successful registration response:", responseData);
      return responseData;

    } catch (error) {
      console.error("❌ Error during registration:", error.message);
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

    // ✅ Get the error message container
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
      errorDiv.textContent = ""; // Clear old errors
      errorDiv.classList.add("hidden"); // Hide initially
    }

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

    // ✅ User input validation (before sending to API)
    const userNameRegex = /^[a-zA-Z0-9_]+$/;
    if (!userNameRegex.test(name)) {
      this.showError("Username can only contain letters, numbers, and underscores (_).");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      this.showError("Email must be a valid @stud.noroff.no address.");
      return;
    }

    if (password.length < 8) {
      this.showError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      this.showError("Passwords do not match!");
      return;
    }

    if (bio.length > 160) {
      this.showError("Bio must be less than 160 characters.");
      return;
    }

    if (avatarUrl && !this.isValidURL(avatarUrl)) {
      this.showError("Invalid avatar URL.");
      return;
    }

    if (bannerUrl && !this.isValidURL(bannerUrl)) {
      this.showError("Invalid banner URL.");
      return;
    }

    // ✅ Prepare user data
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
      console.log("✅ Registration complete! Redirecting...");

      // ✅ Show success message
      const successDiv = document.getElementById("successMessage");
      if (successDiv) {
        successDiv.textContent = "✅ Registration successful! Redirecting...";
        successDiv.classList.remove("hidden"); // Make it visible
      }

      // ✅ Store user info in local storage
      localStorage.setItem("user", JSON.stringify({
        userName: user.userName || user.name, // Normalize username inconsistency
        email: user.email,
        credits: user.credits || 1000, // Ensure credits are set properly
      }));

      // ✅ Redirect to login page
      setTimeout(() => {
        window.history.pushState({}, "", "/login");
        router("/login");
      }, 1500);

    } catch (error) {
      console.error("❌ Error during registration:", error.message);
      this.showError(error.message);
    }
  }

  /**
   * ✅ Helper function to show error messages in UI
   */
  showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
      errorDiv.textContent = `❌ ${message}`;
      errorDiv.classList.remove("hidden"); // Show the error
    } else {
      console.warn("⚠️ Error message container not found in HTML.");
    }
  }
}
