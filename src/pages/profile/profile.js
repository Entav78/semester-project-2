import { API_LISTINGS, API_KEY } from "@/js/api/constants.js";
import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";


let user = JSON.parse(localStorage.getItem("user")) || null; 

export function initializeProfilePage() {
  console.log("Profile Page Initializing...");
   
  showLoader();

  setTimeout(() => {
      const authToken = localStorage.getItem("authToken");
      let user = JSON.parse(localStorage.getItem("user")); 

      //  Handle missing user data in localStorage
      if (!user || !user.userName) {
          console.warn("User not found in localStorage. Checking token...");

          //  Extract `name` from JWT token as a fallback
          if (authToken) {
              try {
                  const payloadBase64 = authToken.split(".")[1];
                  const payloadJSON = JSON.parse(atob(payloadBase64));

                  if (payloadJSON.name) {
                      user = { userName: payloadJSON.name }; // Set user manually
                      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
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

      const mainContainer = document.getElementById("main-container");
    if (!mainContainer) {
      console.error("❌ Main container not found! Profile page may not render correctly.");
      hideLoader(); // Ensure loader is removed even in case of failure
      return;
    }

      //  UI Elements
      const avatarImg = document.getElementById("avatar-img");
      const avatarInput = document.getElementById("avatar-url");
      const updateAvatarBtn = document.getElementById("update-avatar-btn");
      const editProfileBtn = document.getElementById("edit-profile-btn");
      const editProfileContainer = document.getElementById("edit-profile-container");
      const bioContainer = document.getElementById("bio-container");
      const bannerContainer = document.getElementById("banner-img");

      //  Initially hide profile editing fields
      if (avatarInput) avatarInput.classList.add("hidden");
      if (updateAvatarBtn) updateAvatarBtn.classList.add("hidden");

      //  Initialize Avatar Class
      if (avatarImg && avatarInput && updateAvatarBtn) {
          console.log("Avatar elements found! Initializing Avatar class...");
          new Avatar(avatarImg, avatarInput, updateAvatarBtn, bioContainer, bannerContainer);
      } else {
          console.error("Avatar elements not found! Check profile.html IDs.");
      }

      if (editProfileBtn && editProfileContainer) {
          editProfileBtn.addEventListener("click", () => {
              editProfileContainer.classList.toggle("hidden");
              avatarInput.classList.toggle("hidden");
              updateAvatarBtn.classList.toggle("hidden");

              console.log("🛠 Edit Profile button clicked - Toggling edit fields");
          });
      } else {
          console.error("Edit Profile button or container not found!");
      }

      console.log(`Fetching listings and bids for user: ${userName}`);

      // ✅ Fetch Listings & Bids Simultaneously with `Promise.all`
    Promise.all([
      displayUserListings(userName),
      displayUserBids(userName)
    ])
    .then(() => {
      console.log("✅ Profile Data Loaded Successfully");
    })
    .catch(error => {
      console.error("❌ Error loading profile data:", error);
    })
    .finally(() => {
      hideLoader(); // ✅ Hide loader after all data has loaded
      console.log("🔽 Loader Hidden After Profile Data Loaded");
    });

    setupTabNavigation();

    console.log("✅ Profile Page Setup Complete!");
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
  const bidsContainer = document.getElementById("bidsContainer");
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
    console.log("All Listings Fetched:", listings);

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
        console.log("Matched Listing:", matchingListing);

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
        console.warn(`No listing found for bid: ${bid.id}`);
      }

      bidItem.append(title, bidAmount, listingEnds, viewButton);
      bidsContainer.appendChild(bidItem);
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
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


