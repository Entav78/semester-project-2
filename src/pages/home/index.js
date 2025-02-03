import { fetchListings } from "@/js/api/listings.js";

function fetchListingsAndRender() {
  console.log("🏠 Fetching and rendering listings...");

  const container = document.getElementById("listings-container");
  if (!container) {
    console.error("❌ listings-container not found in the DOM!");
    return;
  }

  fetchListings()
    .then((listings) => {
      if (listings.length > 0) {
        container.innerHTML = listings
          .map(
            (listing) => `
          <div class="border p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold">${listing.title}</h2>
            <img src="${listing.media?.[0] || 'default.jpg'}" alt="${listing.title}" class="w-full h-48 object-cover rounded-lg"/>
            <p class="text-gray-600 mt-2">${listing.description || "No description available."}</p>
            <p class="font-bold mt-2">${listing.price} credits</p>
            <a href="/pages/item/item.html?id=${listing.id}" class="block mt-4 text-blue-500 underline">View Item</a>
          </div>
        `
          )
          .join("");
        console.log("✅ Listings rendered!");
      } else {
        container.innerHTML = "<p>No listings available.</p>";
      }
    })
    .catch((error) => console.error("❌ Error fetching listings:", error));
}

// Ensure function runs **immediately**, even if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchListingsAndRender);
} else {
  fetchListingsAndRender(); // Run immediately if DOM is already loaded
}

