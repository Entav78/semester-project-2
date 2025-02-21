

import { API_LISTINGS, API_KEY } from "./constants.js";
import { Listing } from "../../models/Listing.js";
import { setupListingButtons } from "@/components/buttons/index.js";


console.log("API_LISTINGS URL:", API_LISTINGS); 

const ITEMS_PER_PAGE = 8;
let currentPage = 1;

//  Fetch Listings from API
export async function fetchListings(page = 1) {
  console.log(`Fetching Listings - Page ${page}`);

  try {
    const response = await fetch(`${API_LISTINGS}?_active=true`);
    if (!response.ok) throw new Error("Failed to fetch listings");

    const json = await response.json();
    console.log("API Response Data:", json);

    const { data } = json;
    console.log("Processed Listings:", data);

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

let allListings = []; // Store all fetched listings globally

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

      // Debug raw data
      console.log(`Raw API Response (Page ${page}):`, json);

      // Log first 5 fetched listings
      console.log(
        "First 5 Raw Listings Before Processing:",
        json.data.slice(0, 5).map(listing => ({
          id: listing.id,
          title: listing.title,
          endsAt: listing.endsAt || "Missing endsAt"
        }))
      );

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

// Wrap in an async function
async function logListings() {
  const listings = await fetchAllListings();
  

  const filteredListings = listings
    .filter(listing => listing.title && listing.tags.length > 0)
    .map(listing => ({
      Title: listing.title,
      Tags: listing.tags.join(", ")
    }));

  console.table(filteredListings);
}

// Call the function
logListings();


export async function fetchAndRenderListings(page = 1, filterQuery = "") {
  console.log(`Fetching and rendering listings - Page ${page}`);
  

  const container = document.getElementById("listingsContainer");
  if (!container) {
    console.error("listingsContainer not found in the DOM!");
    return;
  }

  container.innerHTML = ""; // Clear previous listings before rendering

  try {
    //Ensure we fetch all listings before filtering
    if (allListings.length === 0) {
      console.log("All listings array is empty. Fetching now...");
      await fetchAllListings();
    }

    // Apply search filtering
    let filteredListings = allListings.filter(listing => {
      return (
        listing.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(filterQuery.toLowerCase())
      );
    });

    console.log(`🔎 Filtered Listings Count: ${filteredListings.length}`);

    // Apply pagination AFTER filtering
    const totalCount = filteredListings.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    console.log("Paginated Listings:", paginatedListings);

    if (paginatedListings.length === 0) {
      container.innerHTML = "<p>No listings found.</p>";
      return;
    }

    // Render listings
    paginatedListings.forEach(listing => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg");

      const title = document.createElement("h2");
      title.classList.add("listing-title", "text-xl", "font-bold");
      title.textContent = listing.title;

      // Handle Image
      const image = document.createElement("img");
      const imageUrl =
        Array.isArray(listing.media) && listing.media.length > 0 && typeof listing.media[0] === "object"
          ? listing.media[0].url
          : "/img/default.jpg";
      image.src = imageUrl;
      image.alt = listing.title || "No image available";
      image.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

      const description = document.createElement("p");
      description.classList.add("listing-description", "text-gray-600", "mt-2");
      description.textContent = listing.description || "No description available.";

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

      // View Item Button
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("view-item", "bg-blue-500", "text-white", "px-4", "py-2", "rounded", "mt-4");
      viewButton.dataset.id = listing.id;
      

      listingItem.append(title, image, description, auctionEnd, viewButton);
      container.appendChild(listingItem);
    });

    setupListingButtons();
    console.log("setupListingButtons() called after rendering listings!");

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








