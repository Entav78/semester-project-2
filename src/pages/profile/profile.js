import { API_LISTINGS, API_PROFILES, API_KEY } from "@/js/api/constants.js";
import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar, setAvatarInstance } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";
import { setupProfileButtons, handleViewItemClick, saveProfileChanges, setupButtons, setupListingButtons  } from "@/components/buttons/index.js";



let user = JSON.parse(localStorage.getItem("user")) || null;

//export let avatarInstance = null; // ✅ Declare globally

export function initializeProfilePage(forceRefresh = true) {
  if (window.profilePageInitialized && !forceRefresh) {
    console.warn("⚠️ Profile Page already initialized. Skipping re-initialization.");
    return;
  }

  console.log("✅ Initializing Profile Page...");
  window.profilePageInitialized = true;

  console.log("🔄 Re-initializing profile buttons after navigation...");
setupProfileButtons();


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

    // ✅ Get DOM elements
    const avatarImg = document.getElementById("profile-avatar");
    const avatarInput = document.getElementById("avatar-url-input");
    const avatarButton = document.getElementById("update-avatar-btn");
    const bioContainer = document.getElementById("bio");
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("credits");

    // ✅ If elements exist, create the Avatar instance
    if (avatarImg && avatarInput && avatarButton) {
      const avatar = new Avatar(avatarImg, avatarInput, avatarButton, bioContainer, bannerContainer, creditsContainer);
      setAvatarInstance(avatar); // ✅ Set instance globally
      console.log("✅ Avatar instance initialized!", avatar);
    } else {
      console.warn("⚠️ Avatar elements not found. Skipping initialization.");
    }

    // ✅ Initialize Avatar Instance
    const avatar = new Avatar(
      document.getElementById("avatar-img"),
      document.getElementById("avatar-url-input"),
      document.getElementById("update-avatar-btn"),
      document.getElementById("bio"),
      document.getElementById("banner-img"),
      document.getElementById("user-credits")
    );

    setAvatarInstance(avatar); // ✅ Set the global instance

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

    setupTabNavigation();
    setupProfileButtons();
    console.log("✅ setupListingButtons() manually called in Profile Page");
    setupListingButtons();
    
    console.log("🔄 Re-initializing profile buttons after navigation...");
    setupProfileButtons();

    console.log("✅ Profile Setup Complete!");
  }, 300);
}




//export { avatarInstance }; // ✅ Ensure this is exported


// ✅ Ensure the function is executed when the profile page loads
// ✅ 1. Function to display user listings
async function displayUserListings(userName) {
  console.log(`Fetching listings for user: ${userName}`);

  const listingsContainer = document.getElementById("user-listings-container");
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

    // ✅ Create the auction status element
    // ✅ Create the auction status element
const auctionStatus = document.createElement("p");
auctionStatus.classList.add(
  "mt-2", "font-bold", "inline-block", 
  "px-2", "text-sm", "rounded"
);

const auctionEndTime = listing.endsAt ? new Date(listing.endsAt) : null;
const now = new Date();

if (auctionEndTime && auctionEndTime < now) {
  auctionStatus.textContent = "SOLD / AUCTION ENDED";
  auctionStatus.classList.add("text-accent/80", "bg-accent/10");
} else {
  auctionStatus.textContent = `Auction Ends: ${auctionEndTime?.toLocaleString() || "No deadline set"}`;
  auctionStatus.classList.add("text-white", "bg-accent", "px-2", "py-1", "rounded");
}

// ✅ Wrap buttons inside a flex container
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("flex", "gap-2", "mt-2");

// ✅ View Item Button
const viewButton = document.createElement("button");
viewButton.textContent = "View Item";
viewButton.classList.add(
  "view-item",
  "bg-primary",
  "hover:bg-secondary",
  "transition",
  "text-white",
  "text-lg",
  "font-semibold",
  "px-4",
  "py-2",
  "rounded"
);

// 🛠️ Debugging: Check if `listing.id` exists before assigning
if (listing.id) {
  viewButton.dataset.id = listing.id;
} else {
  console.warn("⚠️ Missing listing ID:", listing);
}


// ✅ Edit Listing Button
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add(
  "bg-primary", "hover:bg-secondary", "transition",
  "text-white", "text-lg", "font-semibold",
  "px-4", "py-2", "rounded"
);
editButton.addEventListener("click", () => {
  console.log(`Editing listing: ${listing.id}`);
  window.history.pushState({}, "", `/manageListings?id=${listing.id}`);
  router(`/manageListings?id=${listing.id}`);
});

// ✅ Delete Listing Button (Using Coffee Brown)
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add(
  "bg-accent/90",       // Softer brown, slightly transparent
  "text-white",         // Keep text readable
  "px-4", "py-2",       // Consistent padding
  "rounded",            // Rounded corners like other buttons
  "border", "border-accent/50",  // Soft border to blend in
  "transition", "hover:bg-accent/70", // Smooth hover effect
  "font-semibold"
);

deleteButton.addEventListener("click", () => handleDeleteListing(listing.id));


// ✅ Append buttons inside the button container
buttonContainer.append(viewButton, editButton, deleteButton);

// ✅ Append all elements to the listing item
listingItem.append(title, image, description, auctionStatus, buttonContainer);
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
      viewButton.classList.add(
        "view-item",
        "bg-primary",
        "hover:bg-secondary",
        "transition",
        "text-white",
        "text-lg",
        "font-semibold",
        "px-4",
        "py-2",
        "rounded"
      );

      // 🛠️ Ensure the button is only displayed when the bid has a valid listing ID
      if (bid.listingId) {
        viewButton.dataset.id = bid.listingId;
        viewButton.style.display = "block"; // ✅ Show button when valid
      } else {
        console.warn("⚠️ Missing bid listing ID:", bid);
        viewButton.style.display = "none"; // ❌ Hide if no valid listing ID
      }


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

let tabsInitialized = false; // ✅ Prevent re-initialization

function setupTabNavigation() {
  if (tabsInitialized) {
    console.warn("⚠️ Tabs already initialized. Skipping...");
    return;
  }

  console.log("Setting up Profile Page Tabs...");
  
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !tabContents.length) {
    console.warn("No tabs found on profile page.");
    return;
  }

  tabs.forEach(tab => {
    tab.removeEventListener("click", handleTabClick);
    tab.addEventListener("click", handleTabClick);
  });

  function handleTabClick(event) {
    tabs.forEach(t => t.classList.remove("active-tab"));
    event.target.classList.add("active-tab");

    tabContents.forEach(content => content.classList.add("hidden"));
    document.getElementById(`${event.target.dataset.tab}Tab`).classList.remove("hidden");
  }

  tabsInitialized = true; // ✅ Prevents duplicate calls
  console.log("✅ Tabs Initialized!");
}

// ✅ Add event listener directly in profile.js
document.getElementById("save-profile-btn").addEventListener("click", saveProfileChanges);

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

    // ✅ SAFELY SELECT ELEMENTS BEFORE UPDATING
    const avatarImg = document.getElementById("avatar-img");
    const bioContainer = document.getElementById("bio");
    const bannerContainer = document.getElementById("banner-img");
    const creditsContainer = document.getElementById("user-credits");

    // ✅ Update avatar image (check if it exists)
    if (avatarImg) {
      avatarImg.src = userData.data.avatar?.url || "https://via.placeholder.com/150";
    } else {
      console.warn("⚠️ Avatar image element not found!");
    }

    // ✅ Update bio
    if (bioContainer) {
      bioContainer.textContent = userData.data.bio || "No bio available.";
    } else {
      console.warn("⚠️ Bio container not found!");
    }

    // ✅ Update banner
    if (bannerContainer) {
      bannerContainer.src = userData.data.banner?.url || "/img/default-banner.jpg";
    } else {
      console.warn("⚠️ Banner container not found!");
    }

    // ✅ Update credits
    if (creditsContainer) {
      creditsContainer.textContent = `Credits: ${userData.data.credits}`;
    } else {
      console.warn("⚠️ Credits container not found!");
    }

    console.log("✅ Avatar section refreshed!");
  } catch (error) {
    console.error("❌ Error refreshing avatar section:", error);
  }
}


/*
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
  let retryCount = 0;
const maxRetries = 5; // Set a limit to prevent infinite loops

function checkAndInitializeButtons() {
  console.log(`🔍 Checking buttons... Attempt: ${retryCount + 1}`);

  const updateAvatarBtn = document.getElementById("update-avatar-btn");
  const editProfileBtn = document.getElementById("edit-profile-btn");

  if (updateAvatarBtn && editProfileBtn) {
    console.log("✅ Buttons found! Initializing...");
    debugEventListeners();
  } else if (retryCount < maxRetries) {
    retryCount++;
    console.warn("⏳ Buttons not ready yet, retrying...");
    setTimeout(checkAndInitializeButtons, 200); // Retry after 200ms
  } else {
    console.error("❌ Buttons not found after multiple attempts. Skipping initialization.");
  }
}

// Run the function with a slight delay after page load
setTimeout(checkAndInitializeButtons, 300);
  
}
*/
function toggleAvatarUpdateSection() {
  const updateAvatarSection = document.getElementById("updateAvatarSection");
  if (!updateAvatarSection) {
      console.error("❌ Update Avatar section not found!");
      return;
  }

  // Toggle visibility
  if (updateAvatarSection.classList.contains("hidden")) {
      updateAvatarSection.classList.remove("hidden");
  } else {
      updateAvatarSection.classList.add("hidden");
  }
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("view-item")) {
    handleViewItemClick(event);
  }
});



// Call this inside initializeProfilePage
/*setTimeout(() => {
  debugEventListeners();
}, 500);
*/


console.log("✅ Profile Page Setup Complete!");

window.initializeProfilePage = initializeProfilePage;


