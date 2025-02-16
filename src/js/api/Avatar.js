import { API_PROFILES } from "@/js/api/constants.js";
import { API_KEY } from "./constants";

export class Avatar {
  constructor(imgElement, inputElement, buttonElement, bioContainer, bannerContainer, creditsContainer) {
    this.imgElement = imgElement;
    this.inputElement = inputElement;
    this.buttonElement = buttonElement;
    this.bioContainer = bioContainer;
    this.bannerContainer = bannerContainer;
    this.creditsContainer = creditsContainer;

    this.buttonElement.addEventListener("click", () => this.updateAvatar());
    
    // ✅ Fetch all user profile data on instantiation
    this.fetchUserProfile();
  }

  async fetchUserProfile() {
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
    
    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      console.log("📡 API Response Status:", response.status);

      if (!response.ok) {
        console.error(`❌ Failed to fetch profile - Status: ${response.status}`);
        throw new Error(`Failed to fetch profile - ${response.statusText}`);
      }

      const userData = await response.json();
      console.log("✅ Profile Data:", userData);

      // ✅ Set Avatar (fallback if none exists)
      const avatarUrl = userData.data.avatar?.url || "https://via.placeholder.com/150";
      this.imgElement.src = avatarUrl;

      // ✅ Set Bio if available
      if (this.bioContainer) {
        this.bioContainer.textContent = userData.data.bio || "No bio available.";
      }

      // ✅ Set Banner if available
      if (this.bannerContainer) {
        this.bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";
      }

      // ✅ Display user credits
      if (this.creditsContainer) {
        this.creditsContainer.textContent = `Credits: ${userData.data.credits} 💰`;
      }

    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  }

  async updateAvatar() {
    const newAvatar = this.inputElement.value.trim();
    const authToken = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");

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
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          avatar: { url: newAvatar, alt: "" },
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

