import { fetchAndRenderListings } from "@/js/api/listings.js"; 
import { setupListingButtons } from "@/components/buttons/index.js";


const ITEMS_PER_PAGE = 8;
let currentPage = 1;

export async function initializeHomePage() {
  console.log("Initializing Home Page...");

  const listingsContainer = document.getElementById("listingsContainer");
  const paginationContainer = document.getElementById("paginationContainer");

  if (!listingsContainer || !paginationContainer) {
    console.error("listingsContainer or paginationContainer not found!");
    return;
  }

  listingsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  console.log("Fetching and rendering listings...");
  await fetchAndRenderListings(currentPage); // Call function directly

  console.log("Home Page Initialized!");

}































