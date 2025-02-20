import { API_LISTINGS, API_PROFILES, API_KEY } from "@/js/api/constants.js";
import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";
import { setupProfileButtons } from "@/components/buttons/index.js";

/* testing out a modification
let user = JSON.parse(localStorage.getItem("user")) || null; 

export function initializeProfilePage() {
  console.log("📦 localStorage BEFORE entering Manage Listings:", JSON.parse(JSON.stringify(localStorage)));

  console.log("📦 localStorage AFTER returning to Profile:", JSON.parse(JSON.stringify(localStorage)));

  if (window.profilePageInitialized) {
    console.warn("Profile Page is already initialized. Re-fetching user data...");

    const user = JSON.parse(localStorage.getItem("user")) || {};
    fetchUserListings(user.userName || user.name); 
    return; 
  }

  window.profilePageInitialized = true;
  console.log("Profile Page Initializing...");

  showLoader();

  setTimeout(() => {
    const authToken = localStorage.getItem("authToken");
    let user = JSON.parse(localStorage.getItem("user")); 

    if (!user || !user.userName) {
      console.warn("User not found in localStorage. Checking token...");
      if (authToken) {
        try {
          const payloadBase64 = authToken.split(".")[1];
          const payloadJSON = JSON.parse(atob(payloadBase64));

          if (payloadJSON.name) {
            user = { userName: payloadJSON.name }; 
            localStorage.setItem("user", JSON.stringify(user)); 
            console.log(" Extracted username from token:", user.userName);
          }
        } catch (error) {
          console.error("Failed to decode JWT token. Redirecting to login...");
          window.location.href = "/login";
          return;
        }
      } else {
        console.error("No auth token found. Redirecting to login...");
        window.location.href = "/login";
        return;
      }
    }
    
    console.log("🔍 Final username extracted:", user.userName);
    const userName = user.userName;

    console.log(`Fetching listings and bids for user: ${userName}`);

    // Always Fetch Listings & Bids on Navigation
    Promise.all([
      displayUserListings(userName),
      displayUserBids(userName),
    ])
    .then(() => console.log("✅ Profile Data Loaded Successfully"))
    .catch(error => console.error("❌ Error loading profile data:", error))
    .finally(() => {
      hideLoader();
      console.log("🔽 Loader Hidden After Profile Data Loaded");
    });

    // ✅ Initialize Avatar (Profile Image, Bio, Banner, Credits)
    const avatarImg = document.getElementById("avatar-img");
    const avatarInput = document.getElementById("avatar-url-input");
    const updateAvatarBtn = document.getElementById("update-avatar-btn");
    const bioContainer = document.getElementById("bio-container");
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("user-credits");

    if (avatarImg && avatarInput && updateAvatarBtn) {
      new Avatar(avatarImg, avatarInput, updateAvatarBtn, bioContainer, bannerContainer, creditsContainer);
    } else {
      console.error("❌ Avatar elements not found!");
    }

    setupTabNavigation();
    setupProfileButtons();

    console.log("✅ Profile Page Setup Complete!");
  }, 300);  
}
*/

let user = JSON.parse(localStorage.getItem("user")) || null;

export function initializeProfilePage(forceRefresh = false) {
  if (window.profilePageInitialized && !forceRefresh) {
    console.warn("⚠️ Profile Page already initialized. Re-fetching user data...");

    refreshAvatarSection(user.userName || user.name);
    displayUserListings(user.userName || user.name);
    displayUserBids(user.userName || user.name);
    setupTabNavigation();
    
    // ✅ Ensure buttons are reinitialized
    setupProfileButtons();

    return;
  }

  console.log("✅ Initializing Profile Page...");
  window.profilePageInitialized = true;

  showLoader();

  setTimeout(() => {
    const authToken = localStorage.getItem("authToken");
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.userName) {
      console.warn("User not found. Checking token...");
      if (authToken) {
        try {
          const payloadJSON = JSON.parse(atob(authToken.split(".")[1]));
          if (payloadJSON.name) {
            user = { userName: payloadJSON.name };
            localStorage.setItem("user", JSON.stringify(user));
            console.log("🔍 Extracted user:", user.userName);
          }
        } catch (error) {
          console.error("❌ JWT Decode Failed. Redirecting to login...");
          window.location.href = "/login";
          return;
        }
      } else {
        console.error("❌ No auth token. Redirecting to login...");
        window.location.href = "/login";
        return;
      }
    }

    console.log("📡 Fetching profile for:", user.userName);

    Promise.all([
      displayUserListings(user.userName),
      displayUserBids(user.userName),
      refreshAvatarSection(user.userName)
    ])
    .then(() => console.log("✅ Profile Data Loaded Successfully"))
    .catch(error => console.error("❌ Error loading profile:", error))
    .finally(() => {
      hideLoader();
      console.log("🔽 Loader Hidden");
    });

    // ✅ Ensure Buttons Work After Navigation
    setupTabNavigation();
    setupProfileButtons(); // 🔥 Call button setup here

    console.log("✅ Profile Setup Complete!");
  }, 300);
}




// ✅ Ensure the function is executed when the profile page loads
// ✅ 1. Function to display user listings
async function displayUserListings(userName) {
  console.log(`Fetching listings for user: ${userName}`);

  const listingsContainer = document.getElementById("user-listings");
  if (!listingsContainer) {
    console.error("Listings container not found!");
    return;
  }

  listingsContainer.innerHTML = "<p>Loading listings...</p>";

  const data = await fetchUserListings(userName);

  if (!data || !data.data || data.data.length === 0) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listingsContainer.innerHTML = ""; // Clear old content

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
      auctionStatus.textContent = "SOLD / AUCTION ENDED";
      auctionStatus.classList.add("text-gray-700", "bg-yellow-300", "p-2", "rounded-lg");
    } else {
      auctionStatus.textContent = `Auction Ends: ${auctionEndTime?.toLocaleString() || "No deadline set"}`;
      auctionStatus.classList.add("text-red-500");
    }

    // ✅ View Item Button
    const viewButton = document.createElement("button");
    viewButton.textContent = "View Item";
    viewButton.classList.add("view-item", "bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
    viewButton.dataset.id = listing.id;
    

    // ✅ Edit Listing Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("bg-yellow-500", "text-white", "px-4", "py-2", "rounded", "mt-4", "ml-2");
    editButton.addEventListener("click", () => {
      console.log(`Editing listing: ${listing.id}`);
      window.history.pushState({}, "", `/manageListings?id=${listing.id}`);
      router(`/manageListings?id=${listing.id}`);
    });

    // ✅ Delete Listing Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("bg-red-500", "text-white", "px-4", "py-2", "rounded", "mt-4", "ml-2");
    deleteButton.addEventListener("click", () => handleDeleteListing(listing.id));

    listingItem.append(title, image, description, auctionStatus, viewButton, editButton, deleteButton);
    listingsContainer.appendChild(listingItem);
  });

  console.log("User listings displayed successfully!");
}

// ✅ 2. Function to DELETE a listing
async function handleDeleteListing(listingId) {
  if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

  console.log("Deleting listing:", listingId);
  showLoader();

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No Auth Token Found.");
    alert("You must be logged in to delete a listing!");
    hideLoader();
    return;
  }

  try {
    const response = await fetch(`${API_LISTINGS}/${listingId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${authToken.trim()}`,
        "X-Noroff-API-Key": API_KEY
      }
    });

    if (!response.ok) throw new Error("Failed to delete listing");

    console.log("Listing successfully deleted!");
    alert("Listing deleted successfully!");
    
    await displayUserListings(user.userName); // Refresh listings after delete
  } catch (error) {
    console.error("Error deleting listing:", error);
    alert("Failed to delete listing!");
  }

  hideLoader();
}

// ✅ 3. Function to display user bids (no changes here)
async function displayUserBids(userName) {
  console.log("📡 Fetching bids for user:", userName);
  
  const bidsContainer = document.getElementById("bidsContainer");
  if (!bidsContainer) {
    console.error("❌ Bids container is missing! Trying to re-add...");
    return;
  }
  
  bidsContainer.innerHTML = "<p>Loading your bids...</p>";

  const response = await fetchUserBids(userName);
  console.log("Bids API Response:", response);

  const bids = response.data;

  if (!Array.isArray(bids) || bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids placed.</p>";
    return;
  }

  bidsContainer.innerHTML = ""; // Clear old content

  try {
    const listingsResponse = await fetch(`${API_LISTINGS}?_bids=true`);
    if (!listingsResponse.ok) throw new Error("Failed to fetch listings");

    const listingsData = await listingsResponse.json();
    const listings = listingsData.data;
    console.log("📡 All Listings Fetched:", listings);

    bids.forEach((bid) => {
      console.log("🔍 Processing bid:", bid);

      const bidItem = document.createElement("div");
      bidItem.classList.add("border", "p-4", "rounded-lg", "shadow-md", "mb-4");

      const title = document.createElement("h3");
      title.classList.add("text-lg", "font-semibold");
      title.textContent = "Unknown Item"; 

      const bidAmount = document.createElement("p");
      bidAmount.classList.add("text-gray-600");
      bidAmount.textContent = `Your bid: ${bid.amount} credits`;

      const listingEnds = document.createElement("p");
      listingEnds.classList.add("text-sm", "text-gray-500");
      listingEnds.textContent = "Listing ends: N/A";

      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
      viewButton.style.display = "none";

      const matchingListing = listings.find((listing) =>
        listing.bids.some((b) => b.id === bid.id)
      );

      if (matchingListing) {
        console.log("✅ Matched Listing:", matchingListing);

        title.textContent = matchingListing.title || "Unknown Item";
        listingEnds.textContent = matchingListing.endsAt
          ? `Listing ends: ${new Date(matchingListing.endsAt).toLocaleString()}`
          : "No deadline set";

        viewButton.style.display = "block"; 

        viewButton.addEventListener("click", () => {
          window.history.pushState({}, "", `/item?id=${matchingListing.id}`);
          router(`/item?id=${matchingListing.id}`);
        });
      } else {
        console.warn(`⚠️ No listing found for bid: ${bid.id}`);
      }

      bidItem.append(title, bidAmount, listingEnds, viewButton);
      bidsContainer.appendChild(bidItem);
    });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }
}

/* testing new function
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
const avatarInput = document.getElementById("avatar-url-input");  // For editing the avatar
//const profileAvatarInput = document.getElementById("avatar-url-profile");  // For profile display
const updateAvatarBtn = document.getElementById("update-avatar-btn");

if (avatarImg && avatarInput && updateAvatarBtn) {
  new Avatar(avatarImg, avatarInput, updateAvatarBtn);
} else {
  console.error("❌ Avatar elements not found!");
}
*/

export function setupTabNavigation() {
  console.log("🔄 Setting up tab navigation...");

  const listingsTabButton = document.querySelector("[data-tab='listings']");
  const bidsTabButton = document.querySelector("[data-tab='bids']");
  const listingsTab = document.getElementById("listingsTab");
  const bidsTab = document.getElementById("bidsTab");

  if (!listingsTabButton || !bidsTabButton || !listingsTab || !bidsTab) {
    console.error("❌ One or more tab elements not found! Cannot set up tab navigation.");
    return;
  }

  function switchTab(targetTab) {
    console.log(`🔀 Switching to tab: ${targetTab}`);

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.add("hidden"));

    // Remove active class from all buttons
    document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active-tab"));

    // Show the selected tab and highlight the button
    if (targetTab === "listings") {
      listingsTab.classList.remove("hidden");
      listingsTabButton.classList.add("active-tab");
    } else if (targetTab === "bids") {
      bidsTab.classList.remove("hidden");
      bidsTabButton.classList.add("active-tab");

      // ✅ Ensure bids are displayed when clicking "My Bids"
      const user = JSON.parse(localStorage.getItem("user")) || {};
      if (user.userName) {
        displayUserBids(user.userName);
      } else {
        console.error("❌ No user found in localStorage. Cannot fetch bids.");
      }
    }
  }

  // ✅ Remove old event listeners before adding new ones (prevents duplicates)
  listingsTabButton.removeEventListener("click", () => switchTab("listings"));
  bidsTabButton.removeEventListener("click", () => switchTab("bids"));

  // ✅ Add event listeners to tab buttons
  listingsTabButton.addEventListener("click", () => switchTab("listings"));
  bidsTabButton.addEventListener("click", () => switchTab("bids"));

  console.log("✅ Tab navigation initialized!");
}

async function refreshAvatarSection(userName) {
  console.log(`🔄 Refreshing avatar section for: ${userName}`);

  const authToken = localStorage.getItem("authToken");
  if (!authToken || !userName) {
    console.error("❌ Missing authentication or userName.");
    return;
  }

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
      console.error("❌ Failed to fetch profile data.");
      return;
    }

    const userData = await response.json();
    console.log("📡 Refreshed Profile Data:", userData);

    // ✅ Update avatar image
    const avatarImg = document.getElementById("avatar-img");
    const avatarUrl = userData.data.avatar?.url || "https://via.placeholder.com/150";
    if (avatarImg) avatarImg.src = avatarUrl;

    // ✅ Update bio
    const bioContainer = document.getElementById("bio-container");
    if (bioContainer) bioContainer.textContent = userData.data.bio || "No bio available.";

    // ✅ Update banner
    const bannerContainer = document.getElementById("banner-img");
    if (bannerContainer) bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";

    // ✅ Update credits
    const creditsContainer = document.getElementById("user-credits");
    if (creditsContainer) {
      creditsContainer.textContent = `Credits: ${userData.data.credits}`;
    }

    console.log("✅ Avatar section refreshed!");
  } catch (error) {
    console.error("❌ Error refreshing avatar section:", error);
  }
}

/* deactivate while debugging with debugEventListeners
function reattachProfileEventListeners() {
  console.log("🔄 Reattaching Profile Event Listeners...");

  // 🔥 Function to safely reattach event listeners
  function resetButton(selector, callback) {
    const oldButton = document.querySelector(selector);
    if (!oldButton) {
      console.warn(`⚠️ Button ${selector} not found!`);
      return;
    }

    const newButton = oldButton.cloneNode(true);
    oldButton.replaceWith(newButton);
    newButton.addEventListener("click", callback);
  }

  // ✅ Update Avatar Button
  resetButton("#update-avatar-btn", () => {
    console.log("🔄 Update Avatar Clicked");
    const avatarInput = document.getElementById("avatar-url-input").value.trim();
    if (!avatarInput) {
      alert("Please enter a valid avatar URL!");
      return;
    }
    new Avatar(
      document.getElementById("avatar-img"),
      document.getElementById("avatar-url-input"),
      document.getElementById("update-avatar-btn")
    ).updateAvatar();
  });

  // ✅ Edit Profile Button
  resetButton("#edit-profile-btn", () => {
    console.log("🔄 Edit Profile Clicked");
    document.getElementById("profile-edit-section").classList.toggle("hidden");
  });

  // ✅ My Listings Button
  resetButton("#my-listings-btn", () => {
    console.log("🔄 My Listings Clicked");
    document.getElementById("listingsTab").classList.remove("hidden");
    document.getElementById("bidsTab").classList.add("hidden");
  });

  // ✅ My Bids Button
  resetButton("#my-bids-btn", () => {
    console.log("🔄 My Bids Clicked");
    document.getElementById("bidsTab").classList.remove("hidden");
    document.getElementById("listingsTab").classList.add("hidden");

    // Fetch bids when clicking "My Bids"
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user.userName) {
      displayUserBids(user.userName);
    } else {
      console.error("❌ No user found in localStorage. Cannot fetch bids.");
    }
  });

  console.log("✅ All profile event listeners reattached!");
}
*/

function debugEventListeners() {
  console.log("🔍 Checking event listeners...");

  const buttons = [
    { selector: "#update-avatar-btn", name: "Update Avatar" },
    { selector: "#edit-profile-btn", name: "Edit Profile" },
    { selector: "#my-listings-btn", name: "My Listings" },
    { selector: "#my-bids-btn", name: "My Bids" },
  ];

  buttons.forEach(({ selector, name }) => {
    const button = document.querySelector(selector);
    if (button) {
      const clone = button.cloneNode();
      const hasListeners = clone.outerHTML !== button.outerHTML;
      console.log(`🔹 ${name} (${selector}) - Event Listener Present:`, hasListeners);
    } else {
      console.warn(`⚠️ ${name} (${selector}) - Button not found!`);
    }
  });
}

// Call this inside initializeProfilePage
setTimeout(() => {
  debugEventListeners();
}, 500);


console.log("✅ Profile Page Setup Complete!");

window.initializeProfilePage = initializeProfilePage;


