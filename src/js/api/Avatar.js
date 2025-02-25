import { API_PROFILES } from "@/js/api/constants.js";
import { API_KEY } from "./constants";

export let avatarInstance = null; // ✅ Ensure it's exported globally

export function setAvatarInstance(instance) {
  console.log("🔄 Setting avatarInstance:", instance);
  avatarInstance = instance;
  console.log("✅ avatarInstance is now set:", avatarInstance);
}

export class Avatar {
  constructor(imgElement, inputElement, buttonElement, bioContainer, bannerContainer, creditsContainer) {
    this.imgElement = imgElement;
    this.inputElement = inputElement;
    this.buttonElement = buttonElement;
    this.bioContainer = bioContainer;
    this.bannerContainer = bannerContainer;
    this.creditsContainer = creditsContainer;

    if (!this.imgElement || !this.inputElement || !this.buttonElement) {
      console.warn("⚠️ Avatar elements not found. Skipping initialization.");
      return;
    }

    this.buttonElement.addEventListener("click", () => {
      this.updateAvatar();
      toggleAvatarUpdateSection();
    });

    console.log("✅ Avatar instance is being set!");
    setAvatarInstance(this); // ✅ Assign instance only if valid elements exist

    this.fetchUserProfile();
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
  
      // ✅ Ensure the UI elements exist before updating
      const avatarImg = document.getElementById("profile-avatar");
      const bioContainer = document.getElementById("bio");
      const bannerContainer = document.getElementById("banner-img");
      const creditsContainer = document.getElementById("credits");
      const editProfileContainer = document.getElementById("edit-profile-container"); // ✅ Check if the edit section exists
      const saveChangesBtn = document.getElementById("save-profile-btn"); // ✅ Ensure the Save button exists
  
      console.log("🔍 Checking UI Elements:");
      console.log("🖼 Avatar Image:", avatarImg);
      console.log("📝 Bio:", bioContainer);
      console.log("🎨 Banner:", bannerContainer);
      console.log("💰 Credits:", creditsContainer);
      console.log("✏️ Edit Profile Section:", editProfileContainer);
      console.log("💾 Save Changes Button:", saveChangesBtn);
  
      // ✅ Update UI elements only if they exist
      if (avatarImg) avatarImg.src = this.profile.avatar?.url || "/img/default-avatar.jpg";
      if (bioContainer) bioContainer.textContent = this.profile.bio || "No bio available.";
      if (bannerContainer) bannerContainer.src = this.profile.banner?.url || "/img/default-banner.jpg";
      if (creditsContainer) creditsContainer.textContent = `Credits: ${this.profile.credits || 0}`;
  
      // ✅ Ensure Edit Profile section remains visible
      if (!editProfileContainer) {
        console.warn("⚠️ Edit Profile section missing! UI might break.");
      }
  
      if (!saveChangesBtn) {
        console.warn("⚠️ Save Changes button missing! It will not be clickable.");
      }
  
      console.log("✅ Profile Loaded Successfully!");
  
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

    const requestBody = {};
    if (newBio) requestBody.bio = newBio;
    if (newBanner) requestBody.banner = { url: newBanner, alt: "User Banner" };

    console.log("📡 Sending Profile Update Request:", requestBody);

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

      if (updatedData.data.bio) document.getElementById("bio").value = updatedData.data.bio;
      if (updatedData.data.banner?.url) document.getElementById("banner-img").src = updatedData.data.banner.url;

      alert("✅ Profile changes saved successfully!");

      // ✅ Close the edit profile section
      const editProfileContainer = document.getElementById("edit-profile-container");
      if (editProfileContainer) {
        editProfileContainer.classList.add("hidden");
        console.log("🛠 Edit Profile section closed.");
      } else {
        console.warn("⚠️ Edit Profile section not found!");
      }

    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert("❌ Failed to save profile changes.");
    }
  }

  updateAvatar(newUrl) {
    if (!newUrl) {
      console.warn("⚠️ No avatar URL provided.");
      return;
    }
  
    console.log(`🔄 Updating avatar to: ${newUrl}`);
  
    const authToken = localStorage.getItem("authToken");
    const userName = JSON.parse(localStorage.getItem("user"))?.userName;
  
    if (!authToken || !userName) {
      console.error("❌ User is not authenticated.");
      return;
    }
  
    // ✅ Send the new avatar URL to the API
    fetch(`${API_PROFILES}/${userName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.trim()}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ avatar: { url: newUrl } }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("❌ Failed to update avatar.");
        return response.json();
      })
      .then((data) => {
        console.log("✅ Avatar updated successfully!", data);
        this.imgElement.src = newUrl; // ✅ Update UI with new image
        document.getElementById("updateAvatarSection").classList.add("hidden"); // ✅ Hide section
        alert("✅ Avatar updated successfully!");
      })
      .catch((error) => console.error("❌ Error updating avatar:", error));
  }
  
}

  



  
  
 



