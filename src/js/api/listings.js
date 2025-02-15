import { API_LISTINGS } from "./constants.js";
import { Listing } from "../../models/Listing.js";

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

    const totalCount = data.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedListings = data.slice(startIndex, endIndex);

    return { listings: paginatedListings, totalCount };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { listings: [], totalCount: 0 };
  }
}

//  Fetch & Render Listings
export async function fetchAndRenderListings(page = 1) {
  console.log(`Fetching and rendering listings - Page ${page}`);

  const container = document.getElementById("listingsContainer");
  if (!container) {
    console.error("listingsContainer not found in the DOM!");
    return;
  }

  try {
    console.log("Calling fetchListings()...");
    const { listings, totalCount } = await fetchListings(page);
    console.log("Listings Fetched:", listings);

    if (!Array.isArray(listings) || listings.length === 0) {
      console.warn("No listings available.");
      container.innerHTML = "<p>No listings available.</p>";
      return;
    }

    container.innerHTML = listings
      .map((listing) => `
        <div class="listing-item border p-4 rounded-lg shadow-lg" data-category="${listing.category}">
          <h2 class="listing-title text-xl font-bold">${listing.title}</h2>
          <img src="${listing.media?.[0] || 'default.jpg'}" alt="${listing.title}" class="w-full h-48 object-cover rounded-lg"/>
          <p class="listing-description text-gray-600 mt-2">${listing.description || "No description available."}</p>
          <p class="font-bold mt-2">${listing.price} credits</p>
          <button class="view-item bg-blue-500 text-white px-4 py-2 rounded mt-4" data-id="${listing.id}">
            View Item
          </button>
        </div>
      `)
      .join("");

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








