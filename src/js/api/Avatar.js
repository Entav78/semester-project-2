import { API_PROFILES } from "@/js/api/constants.js";
import { API_KEY } from "./constants";

export class Avatar {
  constructor(imgElement, inputElement, buttonElement) {
    this.imgElement = imgElement;
    this.inputElement = inputElement;
    this.buttonElement = buttonElement;

    this.buttonElement.addEventListener("click", () => this.updateAvatar());
    this.fetchUserAvatar(); // Load avatar on instantiation
  }

  async fetchUserAvatar() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.error("❌ No auth token found. User may not be logged in.");
        return;
    }

    const payloadBase64 = authToken.split(".")[1];
    const payloadJSON = JSON.parse(atob(payloadBase64));
    const userName = payloadJSON.name;

    if (!userName) {
        console.error("❌ No user name found in token.");
        return;
    }

    console.log(`🔍 Fetching profile for user: ${userName}`);
    console.log(`🔑 Using token: ${authToken.substring(0, 10)}...`);

    try {
        const response = await fetch(`${API_PROFILES}/${userName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken.trim()}`, // ✅ Ensure token is sent
                "X-Noroff-API-Key": API_KEY // ✅ Add API Key (same as listings)
            },
        });

        console.log("📡 API Response Status:", response.status);

        if (!response.ok) {
            console.error(`❌ Failed to fetch profile - Status: ${response.status}`);
            throw new Error(`Failed to fetch profile - ${response.statusText}`);
        }

        const userData = await response.json();
        console.log("✅ Profile Data:", userData);

        // ✅ Use a default avatar if none exists
        const avatarUrl = userData.data.avatar?.url || "https://via.placeholder.com/150"; 

        this.imgElement.src = avatarUrl;

    } catch (error) {
        console.error("❌ Error fetching avatar:", error);
    }
}







  async updateAvatar() {
    const newAvatar = this.inputElement.value.trim();
    const authToken = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName"); // Fetch username

    if (!newAvatar) {
      alert("Please enter a valid avatar URL!");
      return;
    }

    if (!authToken || !userName) {
      console.error("User is not authenticated or username is missing");
      return;
    }

    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          avatar: {
            url: newAvatar,
            alt: "", // Optional alt description
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update avatar");

      const updatedData = await response.json();
      this.imgElement.src = updatedData.data.avatar.url;
      alert("✅ Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("❌ Failed to update avatar");
    }
  }
}
