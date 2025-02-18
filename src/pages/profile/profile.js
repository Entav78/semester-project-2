import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Avatar } from "@/js/api/Avatar.js";
import { router } from "@/pages/router/router.js";
import { API_LISTINGS } from "@/js/api/constants.js";


let user = JSON.parse(localStorage.getItem("user")) || null; 

export function initializeProfilePage() {
  console.log("Profile Page Initializing...");

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

      setTimeout(() => {
          displayUserListings(userName);
          displayUserBids(userName);
          setupTabNavigation();
      }, 500);

      console.log("Profile Page Setup Complete!");
  }, 300);
}








// ✅ Ensure the function is executed when the profile page loads
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

  console.log("User listings displayed successfully!");
}


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
    // Fetch all active listings with _bids=true to find corresponding items
    const listingsResponse = await fetch(`${API_LISTINGS}?_bids=true`);
    if (!listingsResponse.ok) throw new Error("Failed to fetch listings");

    const listingsData = await listingsResponse.json();
    const listings = listingsData.data;
    console.log("All Listings Fetched:", listings);

    // 🔍 Process each bid
    bids.forEach((bid) => {
      console.log("🔍 Processing bid:", bid);

      const bidItem = document.createElement("div");
      bidItem.classList.add("border", "p-4", "rounded-lg", "shadow-md", "mb-4");

      const title = document.createElement("h3");
      title.classList.add("text-lg", "font-semibold");
      title.textContent = "Unknown Item"; // Default text if we can't fetch listing data

      const bidAmount = document.createElement("p");
      bidAmount.classList.add("text-gray-600");
      bidAmount.textContent = `Your bid: ${bid.amount} credits`;

      const listingEnds = document.createElement("p");
      listingEnds.classList.add("text-sm", "text-gray-500");
      listingEnds.textContent = "Listing ends: N/A"; // Default value

      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
      viewButton.style.display = "none"; // Hide button until we verify listing exists

      // 🔍 Find the correct listing for this bid
      const matchingListing = listings.find((listing) =>
        listing.bids.some((b) => b.id === bid.id)
      );

      if (matchingListing) {
        console.log("Matched Listing:", matchingListing);

        title.textContent = matchingListing.title || "Unknown Item";
        listingEnds.textContent = matchingListing.endsAt
          ? `Listing ends: ${new Date(matchingListing.endsAt).toLocaleString()}`
          : "No deadline set";

        viewButton.style.display = "block"; // Show button only if listing exists

        // ✅ Use the actual listing ID for navigation
        viewButton.addEventListener("click", () => {
          window.history.pushState({}, "", `/item?id=${matchingListing.id}`);
          router(`/item?id=${matchingListing.id}`);
        });
      } else {
        console.warn(`No listing found for bid: ${bid.id}`);
      }

      // ✅ Append elements
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


