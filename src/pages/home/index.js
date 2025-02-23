import { fetchAndRenderListings } from "@/js/api/listings.js";
import { setupListingButtons } from "@/components/buttons/index.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { Filtering } from "@/components/filtering/Filtering.js";
import { Pagination } from "@/components/pagination/Pagination.js";
import { setupSidebar } from "@/components/navigation/index.js"; 

const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let pagination;

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
    const totalListings = await fetchAndRenderListings(currentPage);

    if (!pagination) {
      pagination = new Pagination(paginationContainer, ITEMS_PER_PAGE, totalListings, changePage);
    }
    pagination.update(currentPage, totalListings);

    new Filtering();

  } catch (error) {
    console.error("Error loading home page:", error);
  } finally {
    hideLoader(mainContainer);
  }

  console.log("Home Page Initialized!");

  // ✅ Ensure the sidebar works after everything is loaded
  setTimeout(() => {
    console.log("🔄 Running setupSidebar() manually...");
    setupSidebar(); // Ensures sidebar is initialized after the page loads
  }, 500);
}

function changePage(newPage) {
  currentPage = newPage;
  fetchAndRenderListings(currentPage).then(totalListings => {
    pagination.update(currentPage, totalListings);
    
    setupListingButtons();
  });
}




































