export default class Filtering {
  constructor() {
    console.log("🔍 Initializing Filtering...");

    this.categoryFilter = document.getElementById("category-filter");
    this.advancedFilters = document.getElementById("advanced-filters");
    this.applyFiltersBtn = document.getElementById("apply-filters");
    this.searchBar = document.getElementById("search-bar");
    this.listings = document.querySelectorAll(".listing-item");

    if (!this.categoryFilter || !this.advancedFilters || !this.applyFiltersBtn || !this.searchBar) {
      console.warn("⚠️ Filtering elements not found. Skipping setup.");
      return;
    }

    this.setupEventListeners();
  }

  // 🔹 Attach all filtering-related event listeners
  setupEventListeners() {
    // Show/hide advanced filtering
    this.categoryFilter.addEventListener("change", () => this.toggleAdvancedFilters());

    // Handle applying category filters
    this.applyFiltersBtn.addEventListener("click", () => this.applyCategoryFilters());

    // Handle search input filtering
    this.searchBar.addEventListener("input", () => this.applySearchFilter());
  }

  // 🔹 Show or hide advanced filters when "Multiple Categories" is selected
  toggleAdvancedFilters() {
    if (this.categoryFilter.value === "multiple") {
      this.advancedFilters.classList.remove("hidden");
    } else {
      this.advancedFilters.classList.add("hidden");
    }
  }

  // 🔹 Apply filtering based on selected categories
  applyCategoryFilters() {
    const selectedCategories = Array.from(document.querySelectorAll("input[name='category']:checked"))
      .map((checkbox) => checkbox.value);

    console.log("✅ Selected categories:", selectedCategories);
    this.filterListings(selectedCategories, this.searchBar.value);
  }

  // 🔹 Apply search filtering
  applySearchFilter() {
    const searchQuery = this.searchBar.value.toLowerCase();
    this.filterListings([], searchQuery);
  }

  // 🔹 Filter listings dynamically based on search and category
  filterListings(categories = [], searchQuery = "") {
    console.log("🔍 Filtering Listings...");

    this.listings.forEach((listing) => {
      const title = listing.querySelector(".listing-title")?.textContent.toLowerCase() || "";
      const description = listing.querySelector(".listing-description")?.textContent.toLowerCase() || "";
      const category = listing.dataset.category || "";

      const matchesSearch = searchQuery === "" || title.includes(searchQuery) || description.includes(searchQuery);
      const matchesCategory = categories.length === 0 || categories.includes(category);

      listing.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
  }
}


