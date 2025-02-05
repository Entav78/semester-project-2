import { fetchListings } from "@/js/api/listings.js"; 
import { setupListingButtons } from "@/components/buttons/index.js";

async function fetchAndRenderListings() {
  console.log("🏠 Fetching and rendering listings...");

  const container = document.getElementById("listings-container");
  if (!container) {
    console.error("❌ listings-container not found in the DOM!");
    return;
  }

  try {
    console.log("🔍 Calling fetchListings()...");
    const listings = await fetchListings(); 
    console.log("✅ Listings Fetched in home/index.js:", listings);

    if (Array.isArray(listings) && listings.length > 0) {
      console.log("🖼️ Rendering Listings...");
      container.innerHTML = listings
        .map(
          (listing) => `
          <div class="border p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold">${listing.title}</h2>
            <img src="${listing.media?.[0] || 'default.jpg'}" alt="${listing.title}" class="w-full h-48 object-cover rounded-lg"/>
            <p class="text-gray-600 mt-2">${listing.description || "No description available."}</p>
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

// ✅ Run immediately if DOM is ready
if (document.readyState === "loading") {
  console.warn("⏳ Document still loading. Retrying in 100ms...");
  setTimeout(fetchAndRenderListings, 100);
} else {
  fetchAndRenderListings();
}





