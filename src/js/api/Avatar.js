import { API_PROFILES } from "@/js/api/constants.js";
import { API_KEY } from "./constants";

// ✅ Ensure `avatarInstance` is globally accessible
export let avatarInstance = null;

export function setAvatarInstance(instance) {
  avatarInstance = instance;
}

// ✅ Avatar class for handling user profile
export class Avatar {
  constructor(imgElement, inputElement, buttonElement, bioContainer, bannerContainer, creditsContainer) {
    this.imgElement = imgElement;
    this.inputElement = inputElement;
    this.buttonElement = buttonElement;
    this.bioContainer = bioContainer;
    this.bannerContainer = bannerContainer;
    this.creditsContainer = creditsContainer;

    this.buttonElement.addEventListener("click", () => {
      this.updateAvatar();
      toggleAvatarUpdateSection();
    });

    this.fetchUserProfile(); // ✅ Fetch profile on initialization
  }

  async fetchUserProfile() {
    console.log("🔄 Fetching complete profile data...");

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("❌ No auth token found. Redirecting to login.");
      window.location.href = "/login";
      return;
    }

    const payloadBase64 = authToken.split(".")[1];
    const payloadJSON = JSON.parse(atob(payloadBase64));
    const userName = payloadJSON.name;

    if (!userName) {
      console.error("❌ No user name found in token.");
      return;
    }

    console.log(`📡 Fetching profile for user: ${userName}`);

    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`❌ Failed to fetch profile - Status: ${response.status}`);
        throw new Error(`Failed to fetch profile - ${response.statusText}`);
      }

      const userData = await response.json();
      console.log("📡 Full Profile Data Received:", userData);

      // ✅ Store full profile data in the instance
      this.profile = userData.data;

      // ✅ Update UI elements with fetched data
      this.imgElement.src = this.profile.avatar?.url || "/img/default-avatar.jpg";
      if (this.bioContainer) this.bioContainer.textContent = this.profile.bio || "No bio available.";
      if (this.bannerContainer) this.bannerContainer.src = this.profile.banner?.url || "/img/default-banner.jpg";
      if (this.creditsContainer) this.creditsContainer.textContent = `Credits: ${this.profile.credits || 0}`;

      // ✅ Log Data
      console.log("👤 User Name:", this.profile.name);
      console.log("📩 Email:", this.profile.email);
      console.log("📝 Bio:", this.profile.bio);
      console.log("🖼 Avatar:", this.profile.avatar?.url);
      console.log("🎨 Banner:", this.profile.banner?.url);
      console.log("💰 Credits:", this.profile.credits);
      console.log("📦 Listings:", this.profile._count?.listings);
      console.log("🏆 Wins:", this.profile._count?.wins);

    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  }

  async saveProfileChanges() {
    console.log("🔄 Saving profile changes...");

    const newBio = document.getElementById("bio")?.value.trim();
    const newBanner = document.getElementById("banner-url-input")?.value.trim();
    const authToken = localStorage.getItem("authToken");
    const userName = JSON.parse(localStorage.getItem("user"))?.userName;

    if (!authToken || !userName) {
      console.error("❌ User is not authenticated.");
      return;
    }

    // ✅ Prepare request body with only the updated values
    const requestBody = {};
    if (newBio) requestBody.bio = newBio;
    if (newBanner) requestBody.banner = { url: newBanner, alt: "User Banner" };

    console.log("📡 Sending Profile Update Request:");
    console.log("➡️ Endpoint:", `${API_PROFILES}/${userName}`);
    console.log("📝 Request Body:", requestBody);

    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("❌ Failed to update profile.");

      const updatedData = await response.json();
      console.log("✅ Profile Updated Successfully!", updatedData);

      // ✅ Update UI elements dynamically after saving
      if (updatedData.data.bio) document.getElementById("bio").value = updatedData.data.bio;
      if (updatedData.data.banner?.url) document.getElementById("banner-img").src = updatedData.data.banner.url;

      alert("✅ Profile changes saved successfully!");

    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert("❌ Failed to save profile changes.");
    }
  }
}

  
  
 



