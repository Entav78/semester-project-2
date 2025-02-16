import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar } from "@/js/api/Avatar.js";

export function initializeProfilePage() {
  console.log("Profile Page Initializing...");

  setTimeout(() => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
          console.warn("❌ No auth token found. User may not be logged in.");
          return;
      }

      // ✅ Extract `name` from JWT token
      const payloadBase64 = authToken.split(".")[1];
      const payloadJSON = JSON.parse(atob(payloadBase64));
      const userName = payloadJSON.name; // ✅ Extracted userName from token

      if (!userName) {
          console.error("❌ No user name found in token.");
          return;
      }

      console.log(`🔍 Correct user name extracted: ${userName}`);

      const avatarImg = document.getElementById("avatar-img");
      const avatarInput = document.getElementById("avatar-url");
      const updateAvatarBtn = document.getElementById("update-avatar-btn");
      const editProfileBtn = document.getElementById("edit-profile-btn");
      const editProfileContainer = document.getElementById("edit-profile-container");

      // ❌ Initially hide avatar update fields
      if (avatarInput) avatarInput.classList.add("hidden");
      if (updateAvatarBtn) updateAvatarBtn.classList.add("hidden");

      if (avatarImg && avatarInput && updateAvatarBtn) {
          console.log("✅ Avatar elements found! Initializing Avatar class...");
          new Avatar(avatarImg, avatarInput, updateAvatarBtn);
      } else {
          console.error("❌ Avatar elements not found! Check profile.html IDs.");
      }

      if (editProfileBtn && editProfileContainer) {
          editProfileBtn.addEventListener("click", () => {
              editProfileContainer.classList.toggle("hidden"); // ✅ Toggle edit section visibility
              
              // ✅ Show avatar update fields when editing profile
              avatarInput.classList.toggle("hidden");
              updateAvatarBtn.classList.toggle("hidden");

              console.log("🛠 Edit Profile button clicked - Toggling edit fields");
          });
      } else {
          console.error("❌ Edit Profile button or container not found!");
      }

      console.log(`Fetching data for user: ${userName}`);
      
      // ✅ Now `userName` is properly defined before these calls!
      displayUserListings(userName);
      displayUserBids(userName);

      console.log("✅ Profile Page Setup Complete!");
  }, 300); // Small delay to ensure elements are available
}

// ✅ Ensure the function is executed when the profile page loads
initializeProfilePage();





async function displayUserListings(userName) {
  const listingsContainer = document.getElementById("listingsContainer");
  listingsContainer.innerHTML = "<p>Loading your listings...</p>";

  const response = await fetchUserListings(userName);

  console.log("🛠️ Listings API Response:", response); // Debugging

  const listings = response.data; 
  if (!Array.isArray(listings)) {
    console.error("Expected an array but got:", listings);
    listingsContainer.innerHTML = "<p>Error: Unable to load listings.</p>";
    return;
  }

  if (listings.length === 0) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listingsContainer.innerHTML = listings.map(listing => `
    <div class="border p-4 rounded-lg shadow-md mb-4">
      <h3 class="text-lg font-semibold">${listing.title}</h3>
      <p class="text-gray-600">${listing.description || "No description available"}</p>
      <p class="text-sm text-gray-500">Bids: ${listing._count?.bids || 0}</p>
    </div>
  `).join("");
}

async function displayUserBids(userName) {
  const bidsContainer = document.getElementById("bidsContainer");
  bidsContainer.innerHTML = "<p>Loading your bids...</p>";

  const response = await fetchUserBids(userName);

  console.log("Bids API Response:", response); // Debugging
  
  const bids = response.data; // Extract bids from response.data

  if (!Array.isArray(bids)) {
    console.error("Expected an array but got:", bids);
    bidsContainer.innerHTML = "<p>Error: Unable to load bids.</p>";
    return;
  }

  if (bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids placed.</p>";
    return;
  }

  bidsContainer.innerHTML = bids.map(bid => `
    <div class="border p-4 rounded-lg shadow-md mb-4">
      <h3 class="text-lg font-semibold">${bid.listing?.title || "Unknown Item"}</h3>
      <p class="text-gray-600">Your bid: ${bid.amount} credits</p>
      <p class="text-sm text-gray-500">Listing ends: ${bid.listing?.endsAt ? new Date(bid.listing.endsAt).toLocaleString() : "N/A"}</p>
    </div>
  `).join("");
}


function setupTabNavigation() {
  console.log("Setting up Profile Page Tabs...");
  
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !tabContents.length) {
    console.warn("No tabs found on profile page.");
    return;
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");

      // Hide all tab contents
      tabContents.forEach(content => content.classList.add("hidden"));

      // Show the selected tab content
      document.getElementById(`${tab.dataset.tab}Tab`).classList.remove("hidden");
    });
  });

  console.log("Tabs Initialized!");
  console.log("Profile Page Loaded:", window.profilePageLoaded);

}

const avatarImg = document.getElementById("avatar-img");
const avatarInput = document.getElementById("avatar-url");
const updateAvatarBtn = document.getElementById("update-avatar-btn");

if (avatarImg && avatarInput && updateAvatarBtn) {
  new Avatar(avatarImg, avatarInput, updateAvatarBtn);
} else {
  console.error("❌ Avatar elements not found!");
}

window.initializeProfilePage = initializeProfilePage;


