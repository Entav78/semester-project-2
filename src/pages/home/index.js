import { fetchListings } from "@/js/api/listings.js";
import { setupListingButtons } from "@/components/buttons/index.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { renderPaginationControls } from "@/js/api/listings.js"; 

const ITEMS_PER_PAGE = 8; // ✅ Show 8 listings per page
let currentPage = 1; // ✅ Define current page globally

async function loadListings(page) {
  console.log(`📦 Fetching Listings - Page ${page}`);

  await fetchAndRenderListings(page); // ✅ Fetch and render everything here
}


export async function initializeHomePage() {
  console.log("🏠 Initializing Home Page...");

  const listingsContainer = document.getElementById("listingsContainer");
  const paginationContainer = document.getElementById("paginationContainer");

  if (!listingsContainer || !paginationContainer) {
    console.error("❌ listingsContainer or paginationContainer not found!");
    return;
  }

  // ✅ Clear previous content
  listingsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  console.log("📦 Fetching and rendering listings...");
  await loadListings(currentPage);
}

async function fetchAndRenderListings(page = 1) {
  console.log(`📦 Fetching and rendering listings - Page ${page}`);

  const container = document.getElementById("listingsContainer");
  if (!container) {
    console.error("❌ listingsContainer not found in the DOM!");
    return;
  }

  try {
    console.log("🔍 Calling fetchListings()...");
    const { listings, totalCount } = await fetchListings(page);
    console.log("✅ Listings Fetched:", listings);

    // ✅ Slice the listings array to only show the correct items per page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedListings = listings.slice(startIndex, endIndex);

    if (Array.isArray(paginatedListings) && paginatedListings.length > 0) {
      console.log("🖼️ Rendering Listings...");
      container.innerHTML = paginatedListings
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

      new Filtering();
      setupListingButtons();
      renderPaginationControls(totalCount); // ✅ Ensure pagination is updated
    } else {
      console.warn("⚠️ No listings available. Something is wrong.");
      container.innerHTML = "<p>No listings available.</p>";
    }
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }
}





























