import { fetchAllListings } from "@/js/api/listings.js";

export class Filtering {
  constructor() {
    console.log("Initializing Filtering...");

    this.categoryFilter = document.getElementById("category-filter");
    this.advancedFilters = document.getElementById("advanced-filters");
    this.applyFiltersBtn = document.getElementById("apply-filters");
    this.searchBar = document.getElementById("search-bar");
    this.searchBtn = document.getElementById("search-btn");
    this.listingsContainer = document.getElementById("listingsContainer");
    this.paginationContainer = document.getElementById("paginationContainer");

    if (!this.categoryFilter || !this.advancedFilters || !this.applyFiltersBtn || !this.searchBar || !this.searchBtn || !this.listingsContainer) {
      console.warn("Filtering elements not found. Skipping setup.");
      return;
    }

    this.listings = []; // Store all listings for filtering
    this.filteredListings = []; // Store filtered results for pagination
    this.itemsPerPage = 8;
    this.currentPage = 1;

    this.setupEventListeners();
    this.loadListings();
  }

  async loadListings() {
    console.log("Fetching all listings for filtering...");
    try {
      this.listings = await fetchAllListings(); // Get all listings
      this.applyFilters(); // Apply filters immediately after loading
    } catch (error) {
      console.error("Error fetching listings for filtering:", error);
    }
  }

  setupEventListeners() {
    this.categoryFilter.addEventListener("change", () => {
      if (this.categoryFilter.value === "multiple") {
        this.advancedFilters.classList.remove("hidden"); // Show checkboxes
      } else {
        this.advancedFilters.classList.add("hidden"); // Hide checkboxes
        this.clearCheckboxes(); // Clear selected checkboxes when switching
      }
      this.applyFilters(); // Apply filters immediately when category changes
    });
  
    this.searchBar.addEventListener("input", () => this.applyFilters());
    this.searchBtn.addEventListener("click", () => this.applyFilters());
  
    // ✅ Make sure Apply Filters button works!
    this.applyFiltersBtn.addEventListener("click", () => {
      console.log("✅ Apply Filters button clicked!");
      this.applyFilters();
    });
  }
  

  clearCheckboxes() {
    document.querySelectorAll("input[name='category']:checked").forEach((checkbox) => {
      checkbox.checked = false;
    });
    console.log("Checkboxes cleared.");
  }

  applyFilters() {
    if (!this.listings || this.listings.length === 0) {
      console.warn("No listings available for filtering.");
      return;
    }
  
    const query = this.searchBar.value.toLowerCase();
    console.log("🔍 Search Query:", query);
  
    const selectedTags = Array.from(document.querySelectorAll("input[name='tags']:checked"))
      .map(checkbox => checkbox.value.toLowerCase());
  
    console.log("Selected Tags:", selectedTags);
  
    this.listingsContainer.innerHTML = ""; // Clear current listings display
  
    const filteredListings = this.listings.filter((listing) => {
      const title = listing.title.toLowerCase();
      const description = listing.description.toLowerCase();
      const tags = listing.tags ? listing.tags.map(tag => tag.toLowerCase()) : [];
  
      const matchesSearch = query === "" || title.includes(query) || description.includes(query);
      const matchesTags = selectedTags.length === 0 || tags.some(tag => selectedTags.includes(tag));
  
      return matchesSearch && matchesTags;
    });
  
    if (filteredListings.length === 0) {
      this.listingsContainer.innerHTML = "<p>No matching listings found.</p>";
    } else {
      filteredListings.forEach((listing) => {
        const listingItem = document.createElement("div");
        listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg");
  
        const title = document.createElement("h2");
        title.classList.add("listing-title", "text-xl", "font-bold");
        title.textContent = listing.title;
  
        const description = document.createElement("p");
        description.classList.add("listing-description", "text-gray-600", "mt-2");
        description.textContent = listing.description || "No description available.";
  
        listingItem.append(title, description);
        this.listingsContainer.appendChild(listingItem);
      });
    }
  
    console.log(`Filtered ${filteredListings.length} listings.`);
  }
  
  
  

  renderFilteredListings() {
    this.listingsContainer.innerHTML = ""; // Clear previous results

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedListings = this.filteredListings.slice(startIndex, endIndex);

    if (paginatedListings.length === 0) {
      this.listingsContainer.innerHTML = "<p>No matching listings found.</p>";
      return;
    }

    paginatedListings.forEach((listing) => {
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
      viewButton.addEventListener("click", () => {
        window.history.pushState({}, "", `/item?id=${listing.id}`);
        router(`/item?id=${listing.id}`);
      });

      listingItem.append(title, image, description, auctionEnd, viewButton);
      this.listingsContainer.appendChild(listingItem);
    });

    console.log(`Filtered ${paginatedListings.length} listings on page ${this.currentPage}.`);
  }

  renderPaginationControls() {
    this.paginationContainer.innerHTML = ""; // Clear existing pagination

    const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
    if (totalPages <= 1) return; // No need for pagination if only 1 page

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${this.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`;
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener("click", () => this.changePage(this.currentPage - 1));

    this.paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.className = `px-4 py-2 mx-1 rounded ${i === this.currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`;
      pageButton.addEventListener("click", () => this.changePage(i));
      this.paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = `px-4 py-2 bg-gray-500 text-white rounded ${this.currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`;
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener("click", () => this.changePage(this.currentPage + 1));

    this.paginationContainer.appendChild(nextButton);
  }

  changePage(newPage) {
    if (newPage < 1 || newPage > Math.ceil(this.filteredListings.length / this.itemsPerPage)) return;

    this.currentPage = newPage;
    this.renderFilteredListings();
    this.renderPaginationControls();
  }
}








