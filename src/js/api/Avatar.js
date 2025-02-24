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

    this.fetchUserProfile();
  }

  async fetchUserProfile() {
    console.log("🔄 Fetching profile data...");
    if (this.profileFetched) {
      console.warn("⚠️ Avatar data already fetched. Skipping...");
      return;
    }

    this.profileFetched = true; // ✅ Prevents multiple fetches

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("❌ No auth token found. User may not be logged in.");
      return;
    }

    const userName = JSON.parse(localStorage.getItem("user"))?.userName;
    if (!userName) {
      console.error("❌ No username found in local storage.");
      return;
    }

    console.log(`Fetching profile for user: ${userName}`);

    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`❌ Failed to fetch profile - Status: ${response.status}`);
        throw new Error(`Failed to fetch profile - ${response.statusText}`);
      }

      const userData = await response.json();
      console.log("✅ Profile Data:", userData);

      // ✅ Set avatar (fallback to default)
      this.imgElement.src = userData.data.avatar?.url || "https://via.placeholder.com/150";

      // ✅ Set Bio
      if (this.bioContainer) {
        this.bioContainer.textContent = userData.data.bio || "No bio available.";
      }

      // ✅ Set Banner
      if (this.bannerContainer) {
        this.bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";
      }

      // ✅ Update Credits
      if (this.creditsContainer) {
        this.creditsContainer.textContent = `Credits: ${userData.data.credits}`;
      }

    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  }

  async saveProfileChanges() {
    console.log("🔄 Saving profile changes...");
  
    // ✅ Find the correct token
    let authToken =
      localStorage.getItem("accessToken")?.trim() ||
      localStorage.getItem("authToken")?.trim() ||
      localStorage.getItem("token")?.trim(); // ✅ Last fallback
  
    const userName = JSON.parse(localStorage.getItem("user"))?.userName || null; // ✅ Get username safely
  
    if (!authToken) {
      console.error("❌ No valid auth token found. Redirecting to login...");
      alert("You need to log in again to update your profile.");
      window.location.href = "/login"; // ✅ Redirect if no token is found
      return;
    }
  
    if (!userName) {
      console.error("❌ Username missing in localStorage!");
      alert("Unexpected error: Username is missing.");
      return;
    }
  
    // ✅ Log which token is being used
    console.log("🔑 Using Token:", authToken.startsWith("ey") ? "✅ Token Exists" : "❌ Invalid Token");
    console.log("👤 Using Username:", userName);
  
    // ✅ Prepare headers with Bearer format
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // ✅ Use Bearer <token>
      "X-Noroff-API-Key": API_KEY,
    };
  
    // ✅ Construct API request body dynamically
    const requestBody = {};
    const newBio = document.getElementById("bio")?.value.trim();
    const newBanner = document.getElementById("banner-url-input")?.value.trim();
  
    if (newBio) requestBody.bio = newBio;
    if (newBanner) requestBody.banner = { url: newBanner, alt: "User Banner" };
  
    // ✅ Debugging before sending request
    console.log("📡 Sending Profile Update Request:");
    console.log("➡️ Endpoint:", `${API_PROFILES}/${userName}`);
    console.log("📝 Request Body:", requestBody);
  
    try {
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error("❌ Profile update failed. Response:", response);
        throw new Error(`API Error: ${response.statusText}`);
      }
  
      const updatedData = await response.json();
      console.log("✅ Profile Updated Successfully!", updatedData);
  
      // ✅ Reflect changes in UI
      document.getElementById("bio").textContent = updatedData.data.bio || "No bio available.";
      document.getElementById("banner-img").src = updatedData.data.banner?.url || "/img/default-banner.jpg";
  
      alert("✅ Profile changes saved successfully!");
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert("❌ Failed to save profile changes.");
    }
  }
}  



