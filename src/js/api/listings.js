import { API_LISTINGS, API_KEY } from "./constants.js";
import { Listing } from "../../models/Listing.js";
import { setupListingButtons } from "@/components/buttons/index.js";


console.log("🔍 API_LISTINGS URL:", API_LISTINGS); 

const ITEMS_PER_PAGE = 8;
let currentPage = 1;

//  Fetch Listings from API
export async function fetchListings(page = 1) {
  console.log(`Fetching Listings - Page ${page}`);

  try {
    const response = await fetch(`${API_LISTINGS}?_active=true`);
    if (!response.ok) throw new Error("Failed to fetch listings");

    const json = await response.json();
    const { data } = json;

    // Apply Listing class to each listing
    const processedListings = data.map(listing => new Listing(listing));

    const totalCount = processedListings.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedListings = processedListings.slice(startIndex, endIndex);

    return { listings: paginatedListings, totalCount };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { listings: [], totalCount: 0 };
  }
}



export async function fetchAndRenderListings(page = 1) {
  console.log(`Fetching and rendering listings - Page ${page}`);

  const container = document.getElementById("listingsContainer");
  if (!container) {
    console.error("listingsContainer not found in the DOM!");
    return;
  }

  container.innerHTML = ""; // Clear previous listings before rendering

  try {
    console.log("📡 Calling fetchListings()...");
    const { listings, totalCount } = await fetchListings(page);
    console.log("📡 Listings Fetched:", listings);

    if (!Array.isArray(listings) || listings.length === 0) {
      console.warn("No listings available.");
      container.innerHTML = "<p>No listings available.</p>";
      return;
    }

    listings.forEach((listing) => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg");

      const title = document.createElement("h2");
      title.classList.add("listing-title", "text-xl", "font-bold");
      title.textContent = listing.title;

      // Handle Image (Ensure correct format)
      const image = document.createElement("img");
      const imageUrl = (Array.isArray(listing.media) && listing.media.length > 0 && typeof listing.media[0] === 'object') 
  ? listing.media[0].url 
  : "/img/default.jpg";

      console.log("Image URL:", imageUrl);
      image.src = imageUrl;
      image.alt = listing.title || "No image available";
      image.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

      const description = document.createElement("p");
      description.classList.add("listing-description", "text-gray-600", "mt-2");
      description.textContent = listing.description || "No description available.";

      const price = document.createElement("p");
      price.classList.add("font-bold", "mt-2");
      price.textContent = `${listing.price ?? "No price set"} credits`;


      // Format Auction End Date
      const auctionEnd = document.createElement("p");
      auctionEnd.classList.add("mt-2", "font-bold");

      // Check if auction has ended
      if (listing.endsAt) {
        const now = new Date();
        console.log("🔎 Auction End Date Raw:", listing.endsAt);
        const auctionEndTime = listing.endsAt ? new Date(listing.endsAt) : null;
        if (auctionEndTime && isNaN(auctionEndTime)) {
          console.warn("Invalid Auction End Date:", listing.endsAt);
        }
        

        const isAuctionOver = auctionEndTime < now;

        if (isAuctionOver) {
          auctionEnd.textContent = "SOLD / AUCTION ENDED";
          auctionEnd.classList.add("text-gray-700", "bg-yellow-300", "p-2", "rounded-lg");
        } else {
          auctionEnd.textContent = `Auction Ends: ${auctionEndTime.toLocaleString()}`;
          auctionEnd.classList.add("text-red-500");
        }
      } else {
        auctionEnd.textContent = "No deadline set";
        auctionEnd.classList.add("text-gray-500");
      }

      // View Item Button
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("view-item", "bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
      viewButton.dataset.id = listing.id;
      viewButton.addEventListener("click", () => {
        console.log(`🛒 Navigating to item: ${listing.id}`);
        window.history.pushState({}, "", `/item?id=${listing.id}`);
        router(`/item?id=${listing.id}`); // Use router to navigate
      });

      // Append elements to listing item
      listingItem.append(title, image, description, price, auctionEnd, viewButton);
      container.appendChild(listingItem);

      console.log("Listing appended to container:", listingItem);
    });

    setupListingButtons();
    renderPaginationControls(totalCount);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}




// Render Pagination Controls
export function renderPaginationControls(totalCount) {
  console.log("Rendering pagination controls...");

  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) {
    console.error("paginationContainer not found in the DOM!");
    return;
  }

  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`;
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => changePage(currentPage - 1, totalCount));

  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `px-4 py-2 mx-1 rounded ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`;
    pageButton.addEventListener("click", () => changePage(i, totalCount));
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`;
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => changePage(currentPage + 1, totalCount));

  paginationContainer.appendChild(nextButton);
}

//  Change Page Function
function changePage(newPage, totalCount) {
  if (newPage < 1 || newPage > Math.ceil(totalCount / ITEMS_PER_PAGE)) return;

  console.log(`Changing to page ${newPage}`);
  currentPage = newPage;

  fetchAndRenderListings(currentPage);
  renderPaginationControls(totalCount);
}

//  Ensure `fetchAndRenderListings` is globally available
window.fetchAndRenderListings = fetchAndRenderListings;








