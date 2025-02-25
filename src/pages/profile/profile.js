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
    listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg", "mb-4");

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

    // ✅ Create the View Item button
  const viewButton = document.createElement("button");
  viewButton.textContent = "View Item";
  viewButton.classList.add(
    "view-item", "bg-primary", "hover:bg-secondary", "text-white",
    "text-lg", "font-semibold", "px-4", "py-2", "rounded"
  );

  // ✅ Ensure listing has an ID before setting dataset
  if (listing.id) {
    viewButton.dataset.id = listing.id;
  } else {
    console.warn("⚠️ Listing is missing an ID:", listing);
  }

  // ✅ Append button to listingItem
  listingItem.append(title, image, description, viewButton);
  listingsContainer.appendChild(listingItem);
});

console.log("✅ User listings displayed successfully!");
}

// ✅ Function to fetch and display user bids (with listing details)
async function displayUserBids(userName) {
  console.log("📡 Fetching bids for user:", userName);

  const bidsContainer = document.getElementById("bids-container");
  if (!bidsContainer) {
    console.error("❌ Bids container is missing!");
    return;
  }

  bidsContainer.innerHTML = "<p>Loading your bids...</p>";

  // 🔄 Fetch bids with listing details included
  const response = await fetch(`${API_PROFILES}/${userName}/bids?_listings=true`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    console.error("❌ Failed to fetch user bids.");
    bidsContainer.innerHTML = "<p>Error loading bids.</p>";
    return;
  }

  const bidData = await response.json();
  console.log("📡 Bids API Response with Listings:", bidData);

  const bids = bidData.data;
  if (!Array.isArray(bids) || bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids placed.</p>";
    return;
  }

  bidsContainer.innerHTML = ""; // Clear old content

  // 🛠 Loop through bids and use correct listing data
  for (const bid of bids) {
    if (!bid.listing) {
      console.warn(`⚠️ No listing found for bid on ID: ${bid.id}`);
      continue;
    }

    const listing = bid.listing; // ✅ Correctly linked listing

    // ✅ Create bid display
    const bidItem = document.createElement("div");
    bidItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg", "mb-4");

    const title = document.createElement("h2");
    title.classList.add("listing-title", "text-xl", "font-bold");
    title.textContent = listing.title || "Unknown Item";

    const image = document.createElement("img");
    image.src = listing.media?.[0]?.url || "/img/default.jpg";
    image.alt = listing.title || "No Image Available";
    image.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

    const bidAmount = document.createElement("p");
    bidAmount.classList.add("text-gray-600", "mt-2");
    bidAmount.textContent = `Your bid: ${bid.amount} credits`;

    const viewButton = document.createElement("button");
    viewButton.classList.add("view-item", "bg-primary", "hover:bg-secondary", "text-white", "px-4", "py-2", "rounded", "mt-2");
    viewButton.textContent = "View Item";
    viewButton.dataset.id = listing.id; // ✅ Correctly assign listing ID

    bidItem.append(title, image, bidAmount, viewButton);
    bidsContainer.appendChild(bidItem);
  }

  console.log("✅ Bids displayed successfully!");
}






// ✅ Function to refresh avatar section & profile info
async function refreshAvatarSection(userName) {
  console.log(`🔄 Refreshing avatar section for: ${userName}`);

  const authToken = localStorage.getItem("authToken");
  if (!authToken || !userName) {
    console.error("❌ Missing authentication or userName.");
    return;
  }

  try {
    // 🔄 Fetch User Profile
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

    // ✅ Get UI Elements
    const avatarImg = document.getElementById("avatar-img");
    const bioContainer = document.getElementById("bio");;
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("user-credits");
    const listingsContainer = document.getElementById("total-listings");
    const winsContainer = document.getElementById("total-wins");

    // ✅ Update UI Elements
    if (avatarImg) avatarImg.src = userData.data.avatar?.url || "https://via.placeholder.com/150";
    if (bioContainer) bioContainer.textContent = userData.data.bio?.trim() || "No bio available.";
    if (bannerContainer) bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";
    if (creditsContainer) creditsContainer.textContent = `Credits: ${userData.data.credits}`;

    // 🔄 Fetch Total Listings
    const listingsResponse = await fetch(`${API_PROFILES}/${userName}/listings`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
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
        "Authorization": `Bearer ${authToken}`,
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

    // ✅ Update Bio
    if (userData.data.bio && userData.data.bio.trim() !== "") {
      bioContainer.textContent = userData.data.bio;
    } else {
      bioContainer.textContent = "No bio available.";
    }

    console.log(`✅ Bio Updated: "${bioContainer.textContent}"`);
    
    console.log("✅ Avatar section and profile stats refreshed!");

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



