import { API_LISTINGS, API_PROFILES, API_KEY } from "@/js/api/constants.js";
import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Avatar, setAvatarInstance, avatarInstance } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";
import { setupProfileButtons, handleViewItemClick, setupButtons, setupListingButtons } from "@/components/buttons/buttons.js";
import { createListingButton, createManageListingButtons } from "@/components/buttons/buttons.js";

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
    image.classList.add("w-full", "rounded-lg", "shadow-md", "max-h-[500px]", "object-cover");


    const description = document.createElement("p");
    description.classList.add("text-gray-600", "mt-2");
    description.textContent = listing.description || "No description available.";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex", "gap-2", "mt-2");

    // ✅ View Item Button
    const viewButton = document.createElement("button");
    viewButton.textContent = "View Item";
    viewButton.classList.add(
      "view-item", "bg-primary", "hover:bg-secondary", "text-white",
      "text-lg", "font-semibold", "px-4", "py-2", "rounded"
    );
    if (listing.id) {
      viewButton.dataset.id = listing.id;
    } else {
      console.warn("⚠️ Listing is missing an ID:", listing);
    }

    // ✅ Add Edit & Delete Buttons from `createManageListingButtons`
    const manageButtons = createManageListingButtons(listing, (id) => handleDeleteListing(id));

    buttonContainer.append(viewButton, manageButtons);
    listingItem.append(title, image, description, buttonContainer);
    listingsContainer.appendChild(listingItem);


    });



function handleEditListing(listingId) {
  console.log(`✏️ Editing listing ID: ${listingId}`);
  window.history.pushState({}, "", `/manageListings?id=${listingId}`);
  router(`/manageListings?id=${listingId}`);
}


console.log("✅ User listings displayed successfully!");
}

function loadUserBids() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.userName) {
    console.warn("⚠️ No user found in localStorage.");
    return;
  }

  fetchUserBids(user.userName).then(bids => {
    if (!bids || bids.length === 0) {
      console.warn("⚠️ No bids found.");
      return;
    }

    console.log("🔍 All Bids:", bids); // ✅ Check if you get all 4 bids
    displayUserBids(bids);
  });
}

loadUserBids();



// ✅ Function to fetch and display user bids (with listing details)
async function displayUserBids(bids) {
  console.log("📡 Fetching bids for user:", bids); // ✅ Now uses `bids` from function parameter

  const bidsContainer = document.getElementById("bids-container");
  if (!bidsContainer) {
    console.error("❌ Bids container is missing!");
    return;
  }

  bidsContainer.innerHTML = "<p>Loading your bids...</p>";

  if (!bids || !Array.isArray(bids) || bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids placed.</p>";
    return;
  }

  bidsContainer.innerHTML = ""; // Clear old content

  for (const bid of bids) {
    console.log("🔍 Checking bid:", bid);

    if (!bid.listing || !bid.listing.id) {
      console.warn(`⚠️ No valid listing found for bid ID: ${bid.id}`, bid);
      continue; // Skip bids without a listing
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("❌ Failed to fetch profile data.");

    const userData = await response.json();
    console.log("📡📡📡 Full Profile Data Received:", userData);
    console.log("📡 📡📡📡Checking user bio:", userData?.data?.bio);

    const bioContainer = document.getElementById("bio-container");

    if (bioContainer) {
      bioContainer.textContent = userData?.data?.bio?.trim() || "No bio available.";
      console.log("✅ Bio updated:", bioContainer.textContent);
    } else {
      console.warn("⚠️ Bio container NOT FOUND in the DOM!");
    }


    // ✅ Ensure creditsContainer exists in DOM
    const creditsContainer = document.getElementById("user-credits");

    if (!creditsContainer) {
      console.error("❌ Credits container NOT FOUND in the DOM! Maybe it's loading too late?");
      return;
    }

    // ✅ Update Credits in UI
    const credits = userData?.data?.credits ?? "N/A";
    console.log("💰💰💰💰 Updating user credits in the UI:", credits);
    creditsContainer.textContent = `Credits: ${credits}`;

    // ✅ Debug: Force another update after DOM loads
    setTimeout(() => {
      console.log("🔄 Forcing credits refresh...");
      creditsContainer.textContent = `Credits: ${userData?.data?.credits ?? "N/A"}`;
      console.log("✅ Credits after forced refresh:", creditsContainer.textContent);
    }, 500);

  } catch (error) {
    console.error("❌ Error refreshing avatar section:", error);
  }
}



// ✅ Function to Show "My Listings" Tab
function toggleTab(tabToShow, tabToHide, logMessage) {
  console.log(logMessage);

  const showTab = document.getElementById(tabToShow);
  const hideTab = document.getElementById(tabToHide);

  if (!showTab || !hideTab) {
    console.warn(`⚠️ ${tabToShow} or ${tabToHide} tab not found in the DOM!`);
    return;
  }

  showTab.classList.remove("hidden");
  hideTab.classList.add("hidden");
}

function showListingsTab() {
  toggleTab("listingsTab", "bidsTab", "📜 My Listings Clicked");
}

function showBidsTab() {
  toggleTab("bidsTab", "listingsTab", "🎯 My Bids Clicked");
}


// ✅ Ensure these functions are available for imports (if needed)
export { showListingsTab, showBidsTab };

// ✅ Function to fetch and update the profile
async function fetchAndUpdateProfile(userName) {
  console.log(`📡 Fetching profile for: ${userName}`);

  const authToken = localStorage.getItem("authToken")?.trim();
  if (!authToken || !userName) {
    console.error("❌ Missing authentication token or username.");
    return;
  }

  try {
    const response = await fetch(`${API_PROFILES}/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Failed to fetch profile. Status: ${response.status}`);
    }

    const userData = await response.json();
    console.log("✅ Profile fetched successfully!", userData);

    // ✅ Update UI elements
    const avatarImg = document.getElementById("avatar-img");
    const bioContainer = document.getElementById("bio-container");
    const bannerImg = document.getElementById("banner-img");

    if (userData.data.avatar?.url && avatarImg) {
      avatarImg.src = userData.data.avatar.url;  // ✅ Update avatar
    }
    if (userData.data.bio && bioContainer) {
      bioContainer.textContent = userData.data.bio;  // ✅ Update bio
    }
    if (userData.data.banner?.url && bannerImg) {
      bannerImg.src = userData.data.banner.url;  // ✅ Update banner
    }

    console.log("✅ Profile UI updated successfully!");

  } catch (error) {
    console.error("❌ Error fetching profile:", error);
  }
}



// ✅ Function to initialize the profile page
export function initializeProfilePage(forceRefresh = true) {
  console.log("✅ Initializing Profile Page...");
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
   // fetchAndUpdateProfile(user.userName);


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

    // ✅ Insert the new fetch function here 👇
    fetchAndUpdateProfile(user.userName);

    // ✅ Fetch & Display User Listings
    displayUserListings(user.userName);

    // ✅ Fetch & Display User Bids
    fetchUserBids(user.userName).then(displayUserBids);

    

    
    const avatarImg = document.getElementById("avatar-img");
    const avatarInput = document.getElementById("avatar-url-input");
    const saveProfileBtn = document.getElementById("save-profile-btn");
    const bioContainer = document.getElementById("bio");
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("user-credits");
    const totalListingsContainer = document.getElementById("total-listings");
    const editProfileBtn = document.getElementById("edit-profile-btn");
    
    console.log("🔍 avatar-img:🔍", document.getElementById("avatar-img"));
    console.log("🔍 avatar-url-input🔍:", document.getElementById("avatar-url-input"));
    console.log("🔍 save-profile-btn🔍:", document.getElementById("save-profile-btn"));


    if (avatarImg && avatarInput && saveProfileBtn) {
      console.log("✅ Avatar elements found, creating Avatar instance...");
      const avatar = new Avatar(avatarImg, avatarInput, saveProfileBtn, bioContainer, bannerContainer, creditsContainer);
      setAvatarInstance(avatar);
      console.log("✅ Avatar instance set:", avatar);
    } else {
      console.warn("⚠️ Avatar elements not found! Skipping initialization.");
    }

    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", toggleEditProfile);
    } else {
      console.warn("⚠️ Edit Avatar button not found!");
    }

    // ✅ Fetch & Display Total Listings
fetch(`${API_PROFILES}/${user.userName}/listings`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
    "X-Noroff-API-Key": API_KEY,
  },
})
.then(response => {
  if (!response.ok) throw new Error("❌ Failed to fetch listings.");
  return response.json();
})
.then(listingsData => {
  console.log("📡 Listings Data:", listingsData); // ✅ Ensure this logs correctly

  const totalListingsContainer = document.getElementById("total-listings");

  if (totalListingsContainer) {
    totalListingsContainer.textContent = `Total Listings: ${listingsData.data.length || 0}`;
  } else {
    console.warn("⚠️ totalListingsContainer not found in DOM!");
  }
})
.catch(error => {
  console.error("❌ Error fetching total listings:", error);
  const totalListingsContainer = document.getElementById("total-listings");
  if (totalListingsContainer) totalListingsContainer.textContent = "Total Listings: Error";
});



    // ✅ Fetch & Display Total Listings
    fetch(`${API_PROFILES}/${user.userName}/listings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
    .then(response => {
      if (!response.ok) throw new Error("❌ Failed to fetch listings.");
      return response.json();
    })
    .then(listingsData => {
      console.log("📡 Listings Data:", listingsData);
      if (totalListingsContainer) {
        totalListingsContainer.textContent = `Total Listings: ${listingsData.data.length}`;
      }
    })
    .catch(error => {
      console.error("❌ Error fetching total listings:", error);
      if (totalListingsContainer) totalListingsContainer.textContent = "Total Listings: Error";
    });

    // ✅ Fetch User Bids & Display Them
    fetchUserBids(user.userName)
      .then(bids => {
        if (!bids || bids.length === 0) {
          console.warn("⚠️ No bids found.");
        } else {
          console.log("🔍 All Bids:", bids);
          displayUserBids(bids);
        }
      })
      .catch(error => console.error("❌ Error fetching user bids:", error));

    // ✅ Run other profile setup functions in parallel
    Promise.all([
      displayUserListings(user.userName),
    ])
      .then(() => console.log("✅ Profile Data Loaded Successfully"))
      .catch(error => console.error("❌ Error loading profile:", error))
      .finally(hideLoader);

    setupProfileButtons();
    setupListingButtons();
    refreshAvatarSection(user.userName);


    console.log("✅ Profile Setup Complete!");
    hideLoader();
  }, 300);
}

export function toggleEditProfile() {
  console.log("🚀 toggleEditProfile() is EXECUTING! Check DOM...");
  const editProfileContainer = document.getElementById("edit-profile-container");

  if (!editProfileContainer) {
    console.warn("⚠️ Edit Profile section not found! Check your HTML.");
    return; // Prevent further execution
  }

  console.log("🔄 Toggling Edit Profile section...");
  editProfileContainer.classList.toggle("hidden");
}





console.log("✅ Profile Page Setup Complete!");
window.initializeProfilePage = initializeProfilePage;


export { fetchAndUpdateProfile };

