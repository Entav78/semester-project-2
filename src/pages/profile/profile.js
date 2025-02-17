import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";


let user = JSON.parse(localStorage.getItem("user")) || null; 

export function initializeProfilePage() {
  console.log("Profile Page Initializing...");

  setTimeout(() => {
      const authToken = localStorage.getItem("authToken");
      let user = JSON.parse(localStorage.getItem("user")); 

      // ✅ Handle missing user data in localStorage
      if (!user || !user.userName) {
          console.warn("⚠️ User not found in localStorage. Checking token...");

          // ✅ Extract `name` from JWT token as a fallback
          if (authToken) {
              try {
                  const payloadBase64 = authToken.split(".")[1];
                  const payloadJSON = JSON.parse(atob(payloadBase64));
                  if (payloadJSON.name) {
                      user = { userName: payloadJSON.name }; // Set user manually
                      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
                      console.log("✅ Extracted username from token:", user.userName);
                  }
              } catch (error) {
                  console.error("❌ Failed to decode JWT token. Redirecting to login...");
                  window.location.href = "/login";
                  return;
              }
          } else {
              console.error("❌ No auth token found. Redirecting to login...");
              window.location.href = "/login";
              return;
          }
      }

      console.log("🔍 Final username extracted:", user.userName);
      const userName = user.userName;

      // 🎨 UI Elements
      const avatarImg = document.getElementById("avatar-img");
      const avatarInput = document.getElementById("avatar-url");
      const updateAvatarBtn = document.getElementById("update-avatar-btn");
      const editProfileBtn = document.getElementById("edit-profile-btn");
      const editProfileContainer = document.getElementById("edit-profile-container");

      const bioContainer = document.getElementById("bio-container");
      const bannerContainer = document.getElementById("banner-img");

      // ❌ Initially hide profile editing fields
      if (avatarInput) avatarInput.classList.add("hidden");
      if (updateAvatarBtn) updateAvatarBtn.classList.add("hidden");

      // ✅ Initialize Avatar Class
      if (avatarImg && avatarInput && updateAvatarBtn) {
          console.log("✅ Avatar elements found! Initializing Avatar class...");
          new Avatar(avatarImg, avatarInput, updateAvatarBtn, bioContainer, bannerContainer);
      } else {
          console.error("❌ Avatar elements not found! Check profile.html IDs.");
      }

      if (editProfileBtn && editProfileContainer) {
          editProfileBtn.addEventListener("click", () => {
              editProfileContainer.classList.toggle("hidden");
              avatarInput.classList.toggle("hidden");
              updateAvatarBtn.classList.toggle("hidden");

              console.log("🛠 Edit Profile button clicked - Toggling edit fields");
          });
      } else {
          console.error("❌ Edit Profile button or container not found!");
      }

      console.log(`📄 Fetching listings and bids for user: ${userName}`);

      setTimeout(() => {
          displayUserListings(userName);
          displayUserBids(userName);
          setupTabNavigation();
      }, 500);

      console.log("✅ Profile Page Setup Complete!");
  }, 300);
}








// ✅ Ensure the function is executed when the profile page loads
async function displayUserListings(userName) {
  console.log(`📄 Fetching listings for user: ${userName}`);

  const listingsContainer = document.getElementById("user-listings");
  if (!listingsContainer) {
    console.error("❌ Listings container not found!");
    return;
  }

  listingsContainer.innerHTML = "<p>Loading listings...</p>";

  const data = await fetchUserListings(userName);

  if (!data || !data.data || data.data.length === 0) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listingsContainer.innerHTML = ""; // ✅ Clear old content

  data.data.forEach(listing => {
    const listingItem = document.createElement("div");
    listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg");

    const title = document.createElement("h2");
    title.classList.add("listing-title", "text-xl", "font-bold");
    title.textContent = listing.title;

    const image = document.createElement("img");
    image.src = listing.media?.[0]?.url || "/img/default.jpg";
    image.alt = listing.title;
    image.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

    const description = document.createElement("p");
    description.classList.add("text-gray-600", "mt-2");
    description.textContent = listing.description || "No description available.";

    const auctionStatus = document.createElement("p");
    auctionStatus.classList.add("font-bold", "mt-2");

    const auctionEndTime = listing.endsAt ? new Date(listing.endsAt) : null;
    const now = new Date();

    if (auctionEndTime && auctionEndTime < now) {
      auctionStatus.textContent = "🛑 SOLD / AUCTION ENDED";
      auctionStatus.classList.add("text-gray-700", "bg-yellow-300", "p-2", "rounded-lg");
    } else {
      auctionStatus.textContent = `Auction Ends: ${auctionEndTime?.toLocaleString() || "No deadline set"}`;
      auctionStatus.classList.add("text-red-500");
    }

    const viewButton = document.createElement("button");
    viewButton.textContent = "View Item";
    viewButton.classList.add("view-item", "bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
    viewButton.dataset.id = listing.id;
    viewButton.addEventListener("click", () => {
      console.log(`🛒 Navigating to item: ${listing.id}`);
      window.history.pushState({}, "", `/item?id=${listing.id}`);
      router(`/item?id=${listing.id}`); 
    });

    listingItem.append(title, image, description, auctionStatus, viewButton);
    listingsContainer.appendChild(listingItem);
  });

  console.log("✅ User listings displayed successfully!");
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


