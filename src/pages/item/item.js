import { API_LISTINGS } from "@/js/api/constants.js";
import { Listing } from "@/models/listing.js";
import { Bidding } from "@/js/api/Bidding.js"; // ✅ Import Bidding class

export function initializeItemPage() {
  if (window.itemPageInitialized) return;
  window.itemPageInitialized = true;

  if (!window.location.pathname.includes("/item")) {
    console.warn("Item script loaded on the wrong page, exiting...");
    return;
  }
  console.log("Initializing Item Page...");

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("No item ID found in URL");
    document.getElementById("item-container").innerHTML = "<p class='text-red-500'>Item not found.</p>";
    return;
  }

  console.log(`Fetching item with ID: ${itemId}`);

  fetch(`${API_LISTINGS}/${itemId}?_seller=true&_bids=true`) // ✅ Fetch seller and bids
  .then(response => {
    if (!response.ok) throw new Error(`Failed to fetch item: ${response.statusText}`);
    return response.json();
  })
  .then(data => {
    console.log("Item fetched:", data);

    // ✅ Extract correct item data
    const itemData = data.data || data; 
    console.log("🔍 Corrected Item Data:", itemData);
    console.log("🔍 Media Data:", itemData.media);
    console.log("🔍 First Image URL:", itemData.media?.[0]?.url);


    const item = new Listing(data);
    const itemContainer = document.getElementById("item-container");
    console.log("🔍 Checking item-container:", document.getElementById("item-container"));

    if (!itemContainer) {
      console.error("item-container NOT found in the DOM!");
      return;
    }

    // ✅ Create elements instead of using innerHTML (for security)
    const title = document.createElement("h1");
    title.classList.add("text-2xl", "font-bold");
    title.textContent = item.title || "Untitled";

    // ✅ Image Handling Fix
    const image = document.createElement("img");
    console.log("🔍 Full Item Data:", data);
    console.log("🔍 Media Data:", data.media);
    console.log("🔍 First Image URL:", data.media?.[0]?.url);

    image.src = itemData.media?.[0]?.url || "/src/img/Sasha.jpg";  
 // ✅ Correct line

    image.alt = item.title || "No image available";
    image.classList.add("w-full", "max-w-md", "rounded-lg", "shadow-md");

    const description = document.createElement("p");
    description.classList.add("text-gray-600", "mt-2");
    description.textContent = item.description || "No description available.";

    // ✅ Seller Credits (Fetch from `_seller`)
    const sellerCredits = data.seller?.credits ?? "Unknown";
    const credits = document.createElement("p");
    credits.classList.add("font-bold", "mt-4");
    credits.textContent = `Seller Credits: ${sellerCredits}`;

    // ✅ Price Display Fix
    const price = document.createElement("p");
    price.classList.add("font-bold", "mt-4");
    price.textContent = `Price: ${item.formatPrice()}`;

    // ✅ Append Elements to Page
    itemContainer.innerHTML = ""; // ✅ Clear old content
    itemContainer.append(title, image, description, credits, price);

    // ✅ Ensure only one bid input field exists
let bidInput = document.getElementById("bid-input");

if (!bidInput) {
  bidInput = document.createElement("input");
  bidInput.type = "number";
  bidInput.placeholder = "Enter your bid";
  bidInput.id = "bid-input"; // ✅ Unique ID
  bidInput.classList.add("form-input", "mt-4", "border", "p-2", "rounded");
  itemContainer.append(bidInput); // ✅ Append only if it's missing
}


    // ✅ Check if a bid button already exists in the item container
    let bidButton = document.getElementById("place-bid-btn");

    if (!bidButton) {
      bidButton = document.createElement("button");
      bidButton.textContent = "Place Bid";
      bidButton.classList.add("btn", "btn-primary", "mt-2");
      bidButton.id = "place-bid-btn"; // Add ID to prevent duplicates
      itemContainer.append(bidButton); // ✅ Add the button only if it's missing
    }
    console.log("🕒 Listing ends at:", data.endsAt);

    // ✅ Initialize Bidding system with the input field
    new Bidding(itemId, bidButton, bidInput);

  })
  .catch(error => {
    console.error("Error loading item:", error);
    document.getElementById("item-container").innerHTML = `<p class="text-red-500">Error loading item details.</p>`;
  });
}










