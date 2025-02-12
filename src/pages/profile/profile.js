import { fetchUserListings, fetchUserBids } from "@/js/api/profile.js";

console.log("👤 Profile Page is running...");

export function initializeProfilePage() {
  console.log("👤 Profile Page Initializing...");

  // Remove existing event listeners (if needed)
  document.querySelectorAll(".tab-button").forEach(tab => {
    tab.replaceWith(tab.cloneNode(true)); // ✅ Cloning removes old event listeners
  });

  const userName = localStorage.getItem("userName");
  if (!userName) {
    console.warn("⚠️ No user logged in.");
    return;
  }

  console.log(`🔍 Fetching data for user: ${userName}`);
  displayUserListings(userName);
  displayUserBids(userName);
  setupTabNavigation();

  console.log("✅ Profile Page Setup Complete!");
}


async function displayUserListings(userName) {
  const listingsContainer = document.getElementById("listingsContainer");
  listingsContainer.innerHTML = "<p>Loading your listings...</p>";

  const response = await fetchUserListings(userName);

  console.log("🛠️ Listings API Response:", response); // Debugging

  const listings = response.data; // ✅ Extract listings from response.data

  if (!Array.isArray(listings)) {
    console.error("❌ Expected an array but got:", listings);
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

  console.log("🛠️ Bids API Response:", response); // Debugging
  
  const bids = response.data; // ✅ Extract bids from response.data

  if (!Array.isArray(bids)) {
    console.error("❌ Expected an array but got:", bids);
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



// ✅ Tab Navigation Function (Replaces old `DOMContentLoaded` logic)
function setupTabNavigation() {
  console.log("🛠️ Setting up Profile Page Tabs...");
  
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !tabContents.length) {
    console.warn("⚠️ No tabs found on profile page.");
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

  console.log("✅ Tabs Initialized!");
  

}

//window.initializeProfilePage = initializeProfilePage;

