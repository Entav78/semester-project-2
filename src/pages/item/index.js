import { getListingById } from "@/js/api/constants.js";
import Listing from "@/models/listing.js"; // Import the Listing model

console.log("🛒 Item Page JavaScript is running!");

// ✅ Ensure this script only runs on the item page
if (!window.location.pathname.startsWith("/pages/item/")) {
  console.warn("⚠️ Item script loaded on the wrong page, exiting...");
} else {
  console.log("✅ Correctly running on item page");

  // ✅ Get the item ID from the URL
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("❌ No item ID found in URL");
    document.getElementById("item-container").innerHTML = "<p>Item not found.</p>";
  } else {
    console.log(`📌 Item ID Found: ${itemId}`);

    // ✅ Fetch and display item details
    import("@/js/api/listings.js").then(({ fetchListings }) => {
      fetchListings()
        .then((listings) => {
          const item = listings.find((listing) => listing.id === itemId);
          if (!item) {
            document.getElementById("item-container").innerHTML = "<p>Item not found.</p>";
          } else {
            document.getElementById("item-container").innerHTML = `
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
}



