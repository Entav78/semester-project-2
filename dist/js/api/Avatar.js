import { API_KEY, API_PROFILES } from "/semester-project-2/dist/js/api/constants.js";
import { toggleEditProfile } from "../../pages/profile/profile.js";



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
      toggleEditProfile();
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
        // 🔄 Fetch User Profile
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

        this.profile = userData.data;

        // ✅ Get UI Elements
        const avatarImg = document.getElementById("profile-avatar");
        const bioContainer = document.getElementById("bio");
        const bannerContainer = document.getElementById("banner-img");
        const creditsContainer = document.getElementById("credits");
        const listingsContainer = document.getElementById("total-listings");
        const winsContainer = document.getElementById("total-wins");

        // ✅ Update UI
        if (avatarImg) avatarImg.src = this.profile.avatar?.url || "/img/default-avatar.jpg";
        if (bioContainer) bioContainer.textContent = this.profile.bio?.trim() || "No bio available.";
        if (bannerContainer) bannerContainer.src = this.profile.banner?.url || "/img/default-banner.jpg";
        if (creditsContainer) creditsContainer.textContent = `Credits: ${this.profile.credits || 0}`;

        // 🔄 Fetch Total Listings
        const listingsResponse = await fetch(`${API_PROFILES}/${userName}/listings`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (listingsResponse.ok) {
            const listingsData = await listingsResponse.json();
            console.log("📡 Listings Data:", listingsData);
            if (listingsContainer) {
                listingsContainer.textContent = `Total Listings: ${listingsData.data.length}`;
            }
        } else {
            console.warn("⚠️ Could not fetch listings.");
            if (listingsContainer) listingsContainer.textContent = "Total Listings: Error";
        }

        // 🔄 Fetch Total Wins
        const bidsResponse = await fetch(`${API_PROFILES}/${userName}/bids?_listings=true`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            console.log("📡 Bids Data:", bidsData);

            const wonBids = bidsData.data.filter(bid => {
                if (bid.listing && bid.listing.bids) {
                    const highestBid = Math.max(...bid.listing.bids.map(b => b.amount));
                    return bid.amount === highestBid;
                }
                return false;
            });

            if (winsContainer) {
                winsContainer.textContent = `Total Wins: ${wonBids.length}`;
            }
        } else {
            console.warn("⚠️ Could not fetch wins.");
            if (winsContainer) winsContainer.textContent = "Total Wins: Error";
        }

        console.log("✅ Profile Loaded Successfully!");

    } catch (error) {
        console.error("❌ Error fetching profile:", error);
    }
}

  

async saveProfileChanges() {
  console.log("🔄 Saving profile changes...");

  // ✅ Fetch input elements
  const bioInput = document.getElementById("bio-input");
  const avatarInput = document.getElementById("avatar-url-input");
  const bannerInput = document.getElementById("banner-url-input");

  // ✅ Extract values
  const newBio = bioInput?.value.trim() || "";
  const newAvatar = avatarInput?.value.trim() || "";
  const newBanner = bannerInput?.value.trim() || "";

  console.log("📡 Attempting to update profile with:", { newBio, newAvatar, newBanner });

  // ✅ Check for valid input
  if (!newAvatar && !newBio && !newBanner) {
    console.error("❌ No profile changes detected.");
    alert("❌ Please enter a new avatar URL, bio, or banner.");
    return;
  }

  // ✅ Get user & authentication data
  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = localStorage.getItem("authToken")?.trim();

  if (!authToken || !user?.userName) {
    console.error("❌ Missing authentication token or username.");
    alert("❌ You must be logged in to update your profile.");
    return;
  }

  // ✅ Construct request body
  const requestBody = {};
  if (newBio) requestBody.bio = newBio;
  if (newAvatar) requestBody.avatar = { url: newAvatar };  // ✅ Correct format
  if (newBanner) requestBody.banner = { url: newBanner };  // ✅ Correct format

  console.log("📡 Sending Profile Update Request:", requestBody);

  try {
    const response = await fetch(`${API_PROFILES}/${user.userName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`❌ Failed to update profile. Status: ${response.status}`);

    const updatedData = await response.json();
    console.log("✅ Profile Updated Successfully!", updatedData);

    // ✅ Update profile elements immediately
    if (updatedData.data) {
      const avatarImg = document.getElementById("avatar-img");
      const bioContainer = document.getElementById("bio-container");
      const bannerImg = document.getElementById("banner-img");

      if (updatedData.data.avatar?.url && avatarImg) {
        avatarImg.src = updatedData.data.avatar.url;
        console.log("✅ Avatar updated in UI:", updatedData.data.avatar.url);
      }
      if (updatedData.data.bio && bioContainer) {
        bioContainer.textContent = updatedData.data.bio;
        console.log("✅ Bio updated in UI:", updatedData.data.bio);
      }
      if (updatedData.data.banner?.url && bannerImg) {
        bannerImg.src = updatedData.data.banner.url;
        console.log("✅ Banner updated in UI:", updatedData.data.banner.url);
      }
    }

    alert("✅ Profile changes saved successfully!");

    // ✅ Close the edit profile section
    document.getElementById("edit-profile-container")?.classList.add("hidden");

    console.log("🛠 Edit Profile section closed.");

  } catch (error) {
    console.error("❌ Error saving profile:", error);
    alert(`❌ Failed to save profile changes. ${error.message}`);
  }
}


  updateAvatar(newUrl) {
    console.log("🔍 Avatar Input Element:", this.inputElement);
console.log("🔍 Avatar Input Value:", this.inputElement?.value);

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
        console.log("🔍 API Response Data:", updatedData);

        this.imgElement.src = newUrl; // ✅ Update UI with new image
        document.getElementById("edit-profile-container").classList.add("hidden"); // ✅ Hide section
        alert("✅ Avatar updated successfully!");
      })
      .catch((error) => console.error("❌ Error updating avatar:", error));
  }
  
}

  



  
  
 



