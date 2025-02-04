import { fetchListings } from "@/js/api/listings.js";
alert("🏠 home/index.js is running!");
console.log("🏠 home/index.js is running!");

async function fetchListingsAndRender() {
  console.log("🏠 Fetching and rendering listings...");

  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("⚠️ listings-container not found. Retrying in 100ms...");
    setTimeout(fetchListingsAndRender, 100);
    return;
  }

  console.log("✅ listings-container found! Proceeding to fetch listings...");

  try {
    const listings = await fetchListings();
    console.log("✅ Listings Fetched:", listings);

    if (Array.isArray(listings) && listings.length > 0) {
      console.log("✅ Rendering Listings Now...");
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
      console.warn("⚠️ No listings available.");
      container.innerHTML = "<p>No listings available.</p>";
    }
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }
}

// ✅ Ensure function runs when DOM is ready
if (document.readyState === "loading") {
  console.warn("⏳ Document still loading. Retrying in 100ms...");
  setTimeout(fetchListingsAndRender, 100);
} else {
  console.log("🚀 Document ready. Running fetchListingsAndRender()...");
  fetchListingsAndRender();
}




