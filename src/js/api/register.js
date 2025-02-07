import { API_REGISTER } from "@/js/api/constants.js";

export class Register {
  /**
   * Registers a new user with the provided details.
   *
   * @param {Object} data - The registration data.
   * @param {string} data.name - The user's name (required).
   * @param {string} data.email - The user's email address (required).
   * @param {string} data.password - The user's password (required).
   * @returns {Promise<Object>} A promise that resolves to the user's registration response.
   */
  async register(data) {
    console.log("Sending data to API:", data);

    try {
      const response = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API error response:", errorResponse);
        throw new Error(errorResponse.message || "Registration failed.");
      }

      const responseData = await response.json();
      console.log("Successful registration response:", responseData);

      return responseData;
    } catch (error) {
      console.error("Error during registration:", error.message);
      throw error;
    }
  }

  /**
   * Handles form submission for user registration.
   * @param {Event} event - The form submission event.
   */
  async handleRegister(event) {
    event.preventDefault();

    const errorDiv = document.getElementById("registration-error");
    errorDiv.textContent = "";

    const formData = new FormData(event.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      credits: 1000, // Ensure the API allows this
    };

    console.log("Sanitized registration data:", userData);

    try {
      const user = await this.register(userData);
      alert("Registration successful! Please log in to continue.");

      // Store user data locally
      localStorage.setItem("user", JSON.stringify({
        name: user.name,
        email: user.email,
        credits: 1000, // Ensure credits are assigned
        token: user.token, // If the API returns a token
      }));

      // Redirect to login page
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Error during registration:", error.message);
      errorDiv.textContent = `Registration failed: ${error.message}`;
    }
  }
}

