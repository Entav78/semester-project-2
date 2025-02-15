import { API_LISTINGS } from "./constants.js";
import { Listing } from "../../models/Listing.js";

console.log("🔍 API_LISTINGS URL:", API_LISTINGS); // Check if correct URL is used

const ITEMS_PER_PAGE = 8; // Only defined here
let currentPage = 1; // Store current page globally

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


export function renderPaginationControls(totalCount) {
  console.log("Rendering pagination controls...");

  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) {
    console.error("paginationContainer not found in the DOM!");
    return;
  }

  paginationContainer.innerHTML = ""; // Clear previous pagination

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log(`Total Pages: ${totalPages}`);

  if (totalPages <= 1) {
    console.warn("Not enough pages for pagination.");
    return; // Hide pagination if only 1 page exists
  }

  // Create Previous Button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`;
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => changePage(currentPage - 1, totalCount));

  paginationContainer.appendChild(prevButton);

  // Create Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `px-4 py-2 mx-1 rounded ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`;
    pageButton.addEventListener("click", () => changePage(i, totalCount));
    paginationContainer.appendChild(pageButton);
  }

  // Create Next Button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`;
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => changePage(currentPage + 1, totalCount));

  paginationContainer.appendChild(nextButton);

  console.log("Pagination Controls Rendered.");
}






function changePage(newPage, totalCount) {
  if (newPage < 1 || newPage > Math.ceil(totalCount / ITEMS_PER_PAGE)) return; // Prevent invalid pages

  console.log(`📦 Changing to page ${newPage}`);
  currentPage = newPage;

  fetchAndRenderListings(currentPage); // Reload listings for selected page
  renderPaginationControls(totalCount); // Update pagination UI
}







