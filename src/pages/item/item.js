import { getListingById } from "@/js/api/constants.js";
import Listing from "@/models/listing.js"; // Import the Listing model

console.log("🛒 Item Page JavaScript is running!");

// ✅ Ensure this script only runs when the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeItemPage);
} else {
  initializeItemPage();
}

function initializeItemPage() {
  console.log("✅ DOM Ready - Initializing Item Page");

  const itemContainer = document.getElementById("item-container");
  if (!itemContainer) {
    console.error("❌ item-container NOT found in DOM!");
    return; // ✅ Exit script early to prevent errors
  }

  // ✅ Get the item ID from the URL
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("❌ No item ID found in URL");
    itemContainer.innerHTML = "<p>Item not found.</p>";
    return;
  }

  console.log(`📌 Fetching item with ID: ${itemId}`);

  // ✅ Fetch and display item details
  import("@/js/api/listings.js").then(({ fetchListings }) => {
    fetchListings()
      .then((listings) => {
        console.log("✅ Listings from API:", listings);

        const item = listings.find((listing) => listing.id === itemId);
        if (!item) {
          itemContainer.innerHTML = "<p>Item not found.</p>";
        } else {
          itemContainer.innerHTML = `
            <h1 class="text-2xl font-bold">${item.title}</h1>
            <img src="${item.getImage()}" alt="${item.title}" class="w-full max-w-md rounded-lg shadow-md"/>
            <p class="text-gray-600 mt-2">${item.description}</p>
            <p class="font-bold mt-4">Price: ${item.formatPrice()}</p>
          `;
        }
      })
      .catch((error) => console.error("❌ Error fetching item:", error));
  });
}




