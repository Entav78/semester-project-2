import { fetchAndRenderListings } from "@/js/api/listings.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Filtering } from "@/components/filtering/Filtering.js";

const ITEMS_PER_PAGE = 8;
let currentPage = 1;

export async function initializeHomePage() {
  console.log("Initializing Home Page...");

  const mainContainer = document.getElementById("main-container");
  if (!mainContainer) {
    console.error("main-container not found!");
    return;
  }

  showLoader(mainContainer);

  try {
    const listingsContainer = document.getElementById("listingsContainer");
    const paginationContainer = document.getElementById("paginationContainer");

    if (!listingsContainer || !paginationContainer) {
      console.error("listingsContainer or paginationContainer not found!");
      return;
    }

    listingsContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    console.log("Fetching and rendering listings...");
    await fetchAndRenderListings(currentPage); // ✅ Fetch Listings

    // Initialize Filtering after listings are loaded
    new Filtering();

  } catch (error) {
    console.error("Error loading home page:", error);
  } finally {
    hideLoader(mainContainer);
  }

  console.log("Home Page Initialized!");
}


































