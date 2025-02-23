import { Pagination } from "@components/pagination/Pagination.js";
import { Listing } from "@/models/Listing.js";
import { API_LISTINGS } from "@/js/api/constants.js";


const ITEMS_PER_PAGE = 9;
let allListings = [];
let currentPage = 1;

export async function fetchAllListings() {
  console.log("🔄 Fetching ALL listings...");

  let allFetchedListings = [];
  let page = 1;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const response = await fetch(`${API_LISTINGS}?_active=true&page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch listings");

      const json = await response.json();

      // Ensure `endsAt` is included when creating `Listing` instances
      const listings = json.data.map(listing => new Listing({
        ...listing, // Spread existing properties
        endsAt: listing.endsAt ?? null // Ensure `endsAt` is at least `null` if missing
      }));

      if (listings.length === 0) {
        hasMoreData = false;
      } else {
        allFetchedListings = [...allFetchedListings, ...listings];
        page++;
      }
    }

    console.log("Fetch Complete. Total Listings:", allFetchedListings.length);

    // Log first 5 listings AFTER creating Listing instances
    console.log(
      "First 5 Listings After Processing:",
      allFetchedListings.slice(0, 5).map(listing => ({
        title: listing.title,
        endsAt: listing.endsAt || "Missing endsAt"
      }))
    );

    return allFetchedListings;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function fetchAndRenderListings(page = 1, filterQuery = "") {
  console.log("🚀 fetchAndRenderListings() is running...");

  console.log(`Fetching and rendering listings - Page ${page}`);

  const container = document.getElementById("listingsContainer");
  if (!container) {
    console.error("listingsContainer not found in the DOM!");
    return;
  }

  container.innerHTML = ""; // Clear previous listings before rendering

  try {
    // Fetch listings if empty
    if (allListings.length === 0) {
      console.log("All listings array is empty. Fetching now...");
      await fetchAllListings();
    }

    // 🔥 **Calculate total listings BEFORE pagination**
    let filteredListings = allListings.filter(listing => {
      return (
        listing.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(filterQuery.toLowerCase())
      );
    });

    const totalCount = filteredListings.length; 
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    console.log("Paginated Listings:", paginatedListings);

    if (paginatedListings.length === 0) {
      container.innerHTML = "<p>No listings found.</p>";
      return totalCount;
    }

    paginatedListings.forEach(listing => {
      const listingItem = document.createElement("div");
      listingItem.classList.add(
        "bg-soft", "border", "border-accent",
        "p-4", "rounded-lg", "shadow-lg",
        "hover:shadow-xl", "transition-shadow", "duration-200",
        "flex", "flex-col", "justify-between",
        "h-[500px]" // ✅ Increased height slightly for consistency
      );
    
      // ✅ Ensure the title takes up a fixed amount of space
      const title = document.createElement("h2");
      title.classList.add("listing-title", "text-xl", "font-bold", "min-h-[3rem]"); 
      title.textContent = listing.title; 
    
      const defaultImagePath = "/img/default.jpg";
    
      const imageUrl =
        Array.isArray(listing.media) && listing.media.length > 0 && typeof listing.media[0] === "object"
          ? listing.media[0].url
          : defaultImagePath;
    
      // ✅ Ensure all images take the same space
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("w-full", "h-[200px]", "overflow-hidden", "flex", "justify-center", "items-center", "bg-gray-200", "rounded-lg");
    
      const image = document.createElement("img");
      image.classList.add("w-full", "h-full", "object-cover", "rounded-lg");
      image.src = imageUrl;
      image.alt = listing.title || "No image available";
    
      imageWrapper.appendChild(image);
    
      // ✅ Fix description height for consistency
      const description = document.createElement("p");
      description.classList.add("listing-description", "text-gray-600", "mt-2", "flex-grow");
      description.textContent = listing.description || "No description available.";
    
      // ✅ Auction End Date
      const auctionEnd = document.createElement("p");
      auctionEnd.classList.add("mt-2", "font-bold");
      if (listing.endsAt) {
        const now = new Date();
        const auctionEndTime = new Date(listing.endsAt);
        auctionEnd.textContent = auctionEndTime < now ? "SOLD / AUCTION ENDED" : `Auction Ends: ${auctionEndTime.toLocaleString()}`;
        auctionEnd.classList.add(auctionEndTime < now ? "text-gray-700 bg-yellow-300 p-2 rounded-lg" : "text-red-500");
      } else {
        auctionEnd.textContent = "No deadline set";
      }
    
      // ✅ Fix button positioning by wrapping it in a div
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("flex", "justify-center", "mt-auto"); 
    
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("view-item", "bg-red-500", "text-white", "px-4", "py-2", "rounded", "mt-4", "hover:bg-red-700");
      viewButton.dataset.id = listing.id;
    
      buttonContainer.appendChild(viewButton);
    
      // ✅ Append all elements to the listing card
      listingItem.append(title, imageWrapper, description, auctionEnd, buttonContainer);
      container.appendChild(listingItem);
    });
    
    

    setupListingButtons();
    console.log("setupListingButtons() called after rendering listings!");

    return totalCount; // ✅ Ensure this function returns total listings
  } catch (error) {
    console.error("Error fetching listings:", error);
    return 0; // Return 0 on error
  }
}








