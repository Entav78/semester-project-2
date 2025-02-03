import { getListingById } from "@/js/api/constants.js";
import Listing from "@/models/listing.js"; // Import the Listing model

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🛒 Item page loaded");

  // Get the item ID from the URL query string
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("❌ No item ID found in URL");
    document.getElementById("item-container").innerHTML = "<p>Item not found.</p>";
    return;
  }

  console.log(`📌 Fetching item with ID: ${itemId}`);

  try {
    // Fetch item details from API
    const response = await fetch(getListingById(itemId, true, true));
    if (!response.ok) throw new Error(`Failed to fetch item: ${response.statusText}`);

    const data = await response.json();
    console.log("✅ Item fetched:", data);

    // Convert API data into a Listing object
    const item = new Listing(data);

    // Display item details dynamically
    document.getElementById("item-container").innerHTML = `
      <h1 class="text-2xl font-bold">${item.title}</h1>
      <img src="${item.getImage()}" alt="${item.title}" class="w-full max-w-md rounded-lg shadow-md"/>
      <p class="text-gray-600 mt-2">${item.description}</p>
      <p class="font-bold mt-4">Price: ${item.formatPrice()}</p>
    `;

  } catch (error) {
    console.error("❌ Error loading item:", error);
    document.getElementById("item-container").innerHTML = `<p class="text-red-500">Error loading item details.</p>`;
  }
});

