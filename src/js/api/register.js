import { API_REGISTER } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js"; // ✅ Import the router

export class Register {
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
        if (errorResponse.message.includes("email already exists")) {
          throw new Error("This email is already registered. Please log in.");
        }
        console.error("API error response:", errorResponse);
        throw new Error(errorResponse.message || "Registration failed.");
      }

      const responseData = await response.json();
      console.log("✅ Successful registration response:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Error during registration:", error.message);
      throw error;
    }
  }

  async handleRegister(event) {
    event.preventDefault();
    console.log("🔄 Register form submitted!");

    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = "";

    const formData = new FormData(event.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // ✅ Validate password match
    if (password !== confirmPassword) {
      errorDiv.textContent = "Passwords do not match!";
      return;
    }

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      credits: 1000, // ✅ Ensure credits are assigned
    };

    console.log("📦 Sanitized registration data:", userData);

    try {
      const user = await this.register(userData);
      alert("🎉 Registration successful! Redirecting to login...");

      // ✅ Store user data locally
      localStorage.setItem("user", JSON.stringify({
        name: user.name,
        email: user.email,
        credits: 1000, // ✅ Ensure credits are assigned
        token: user.token, // ✅ If the API returns a token
      }));

     // ✅ Redirect using basePath
    window.history.pushState({}, "", `${basePath}/auth/login/`);
    router(`${basePath}/auth/login/`);
  } catch (error) {
    console.error("❌ Error during registration:", error.message);
    errorDiv.textContent = `Registration failed: ${error.message}`;
  }
}
}
  

