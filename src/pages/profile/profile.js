import { API_LISTINGS, API_PROFILES, API_KEY } from "@/js/api/constants.js";
import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Avatar, setAvatarInstance, avatarInstance } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";
import { setupProfileButtons, handleViewItemClick, setupButtons, setupListingButtons } from "@/components/buttons/index.js";

let user = JSON.parse(localStorage.getItem("user")) || null;

// ✅ Function to fetch and display user listings
async function displayUserListings(userName) {
  console.log(`📡 Fetching listings for user: ${userName}`);

  const listingsContainer = document.getElementById("user-listings-container");
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

    listingItem.append(title, image, description);
    listingsContainer.appendChild(listingItem);
  });

  console.log("✅ User listings displayed successfully!");
}

// ✅ Function to fetch and display user bids
async function displayUserBids(userName) {
  console.log("📡 Fetching bids for user:", userName);
  
  const bidsContainer = document.getElementById("bidsContainer");
  if (!bidsContainer) {
    console.error("❌ Bids container is missing!");
    return;
  }

  bidsContainer.innerHTML = "<p>Loading your bids...</p>";

  const response = await fetchUserBids(userName);
  console.log("📡 Bids API Response:", response);

  const bids = response.data;
  if (!Array.isArray(bids) || bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids placed.</p>";
    return;
  }

  bidsContainer.innerHTML = ""; // Clear old content
  bids.forEach((bid) => {
    const bidItem = document.createElement("div");
    bidItem.classList.add("border", "p-4", "rounded-lg", "shadow-md", "mb-4");

    const title = document.createElement("h3");
    title.classList.add("text-lg", "font-semibold");
    title.textContent = "Unknown Item"; 

    bidItem.append(title);
    bidsContainer.appendChild(bidItem);
  });

  console.log("✅ Bids displayed successfully!");
}

// ✅ Function to refresh avatar section
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

    const avatarImg = document.getElementById("avatar-img");
    const bioContainer = document.getElementById("bio");
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("user-credits");

    if (avatarImg) avatarImg.src = userData.data.avatar?.url || "https://via.placeholder.com/150";
    if (bioContainer) bioContainer.textContent = userData.data.bio || "No bio available.";
    if (bannerContainer) bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";
    if (creditsContainer) creditsContainer.textContent = `Credits: ${userData.data.credits}`;

    console.log("✅ Avatar section refreshed!");
  } catch (error) {
    console.error("❌ Error refreshing avatar section:", error);
  }
}

// ✅ Function to initialize the profile page
export function initializeProfilePage(forceRefresh = true) {
  if (window.profilePageInitialized && !forceRefresh) {
    console.warn("⚠️ Profile Page already initialized. Skipping re-initialization.");
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

    console.log("🛠 Checking if Avatar elements exist...");
    const avatarImg = document.getElementById("avatar-img"); // ✅ Matches profile.html
    const avatarInput = document.getElementById("avatar-url-input"); // ✅ Matches profile.html
    const avatarButton = document.getElementById("update-avatar-btn"); // ✅ Matches profile.html
    const bioContainer = document.getElementById("bio"); // ✅ Matches profile.html
    const bannerContainer = document.getElementById("banner-img"); // ✅ Matches profile.html
    const creditsContainer = document.getElementById("user-credits"); // ✅ Matches profile.html

    if (avatarImg && avatarInput && avatarButton) {
        console.log("✅ Avatar elements found, creating Avatar instance...");
        const avatar = new Avatar(avatarImg, avatarInput, avatarButton, bioContainer, bannerContainer, creditsContainer);
        setAvatarInstance(avatar);
        console.log("✅ Avatar instance set:", avatar);
    } else {
        console.warn("⚠️ Avatar elements not found! Skipping initialization.");
    }


    Promise.all([
      displayUserListings(user.userName),
      displayUserBids(user.userName),
      refreshAvatarSection(user.userName),
    ])
    .then(() => console.log("✅ Profile Data Loaded Successfully"))
    .catch(error => console.error("❌ Error loading profile:", error))
    .finally(() => {
      hideLoader();
      console.log("🔽 Loader Hidden");
    });

    setupProfileButtons();
    setupListingButtons();

    console.log("✅ Profile Setup Complete!");
  }, 300);
}

console.log("✅ Profile Page Setup Complete!");
window.initializeProfilePage = initializeProfilePage;



