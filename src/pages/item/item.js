import { API_LISTINGS } from "@/js/api/constants.js";
import { Listing } from "@/models/listing.js"; 

console.log("🛒 Item Page JavaScript is running!");

export function initializeItemPage() {
  console.log("🛒 Initializing Item Page...");

  // ✅ Ensure script only runs on the correct page
  if (!window.location.pathname.includes("/item")) {
    console.warn("⚠️ Item script loaded on the wrong page, exiting...");
    return; // ⛔ Stop execution
  }

  console.log("✅ Correctly running on item page");

  // ✅ Get the item ID from the URL
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("❌ No item ID found in URL");
    const container = document.getElementById("item-container");
    if (container) {
      container.innerHTML = "<p class='text-red-500'>Item not found.</p>";
    }
    return; // ⛔ Stop execution
  }

  console.log(`📌 Fetching item with ID: ${itemId}`);

  // ✅ Fetch and display item details
  fetch(`${API_LISTINGS}/${itemId}`)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch item: ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      console.log("✅ Item fetched:", data);

      // Convert API data into a Listing object
      const item = new Listing(data);

      // ✅ Ensure `item-container` exists before updating
      const itemContainer = document.getElementById("item-container");
      if (!itemContainer) {
        console.error("❌ item-container NOT found in the DOM!");
        return;
      }

      // Display item details dynamically
      itemContainer.innerHTML = `
        <h1 class="text-2xl font-bold">${item.title}</h1>
        <img src="${item.getImage()}" alt="${item.title}" class="w-full max-w-md rounded-lg shadow-md"/>
        <p class="text-gray-600 mt-2">${item.description || "No description available."}</p>
        <p class="font-bold mt-4">Price: ${item.formatPrice()}</p>
      `;
    })
    .catch(error => {
      console.error("❌ Error loading item:", error);
      document.getElementById("item-container").innerHTML = `<p class="text-red-500">Error loading item details.</p>`;
    });
}

// ✅ Run initialization
initializeItemPage();






