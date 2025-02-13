import { fetchListings } from "@/js/api/listings.js";
import { setupListingButtons } from "@/components/buttons/index.js";
import { Filtering } from "@/components/filtering/Filtering.js";

/*
export async function initializeHomePage() {
  console.log("🏠 Initializing Home Page...");

  await waitForListingsContainer();
  new Filtering();
  fetchAndRenderListings();
}*/

export async function initializeHomePage() {
  console.log("🏠 Initializing Home Page...");

  await waitForListingsContainer(); // ✅ Ensures the container exists before proceeding

  const listingsContainer = document.getElementById("listingsContainer");
  if (!listingsContainer) {
    console.error("❌ listingsContainer not found!");
    return;
  }

  // ✅ Clear old listings BEFORE fetching new ones
  listingsContainer.innerHTML = "";

  console.log("📦 Fetching and rendering listings...");
  fetchAndRenderListings(); // ✅ Keep using this since it handles the fetching and rendering
}



// ✅ Function to wait until listingsContainer is added to DOM
async function waitForListingsContainer() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      const container = document.getElementById("listingsContainer");
      if (container) {
        console.log("✅ listingsContainer found!");
        clearInterval(checkExist);
        resolve(container);
      }
    }, 50);
  });
}

// ✅ Fetch and render listings
async function fetchAndRenderListings() {
  console.log("🏠 Fetching and rendering listings...");
  const container = document.getElementById("listingsContainer");

  if (!container) {
    console.error("❌ listingsContainer not found in the DOM!");
    return;
  }

  try {
    console.log("🔍 Calling fetchListings()...");
    const listings = await fetchListings();
    console.log("✅ Listings Fetched:", listings);

    if (Array.isArray(listings) && listings.length > 0) {
      console.log("🖼️ Rendering Listings...");
      container.innerHTML = listings
        .map(
          (listing) => `
          <div class="listing-item border p-4 rounded-lg shadow-lg" data-category="${listing.category}">
            <h2 class="listing-title text-xl font-bold">${listing.title}</h2>
            <img src="${listing.media?.[0] || 'default.jpg'}" alt="${listing.title}" class="w-full h-48 object-cover rounded-lg"/>
            <p class="listing-description text-gray-600 mt-2">${listing.description || "No description available."}</p>
            <p class="font-bold mt-2">${listing.price} credits</p>
            <button class="view-item bg-blue-500 text-white px-4 py-2 rounded mt-4" data-id="${listing.id}">
              View Item
            </button>
          </div>
        `
        )
        .join("");

      console.log("✅ Listings rendered!");
      setupListingButtons();
    } else {
      console.warn("⚠️ No listings available. Something is wrong.");
      container.innerHTML = "<p>No listings available.</p>";
    }
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }
}















