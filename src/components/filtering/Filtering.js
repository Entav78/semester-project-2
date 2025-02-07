export class Filtering {
  constructor() {
    console.log("🔍 Initializing Filtering...");

    this.categoryFilter = document.getElementById("category-filter");
    this.advancedFilters = document.getElementById("advanced-filters");
    this.applyFiltersBtn = document.getElementById("apply-filters");
    this.searchBar = document.getElementById("search-bar");
    this.searchBtn = document.getElementById("search-btn");
    this.listings = document.querySelectorAll(".listing-item");

    if (!this.categoryFilter || !this.advancedFilters || !this.applyFiltersBtn || !this.searchBar || !this.searchBtn) {
      console.warn("⚠️ Filtering elements not found. Skipping setup.");
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // ✅ Show or hide checkboxes when "Multiple Categories" is selected
    this.categoryFilter.addEventListener("change", () => {
      if (this.categoryFilter.value === "multiple") {
        this.advancedFilters.classList.remove("hidden"); // ✅ Show checkboxes
      } else {
        this.advancedFilters.classList.add("hidden"); // ✅ Hide checkboxes
        this.clearCheckboxes(); // ✅ Clear selected checkboxes when switching
      }
      this.applyFilters(); // ✅ Apply new filtering immediately
    });

    // ✅ Event listener for search input (Enter key)
    this.searchBar.addEventListener("input", () => this.applyFilters());

    // ✅ Event listener for clicking search button
    this.searchBtn.addEventListener("click", () => this.applyFilters());

    // ✅ Event listener for applying advanced filters
    this.applyFiltersBtn.addEventListener("click", () => this.applyFilters());
  }

  clearCheckboxes() {
    document.querySelectorAll("input[name='category']:checked").forEach((checkbox) => {
      checkbox.checked = false;
    });
    console.log("🧹 Checkboxes cleared.");
  }

  applyFilters() {
    const query = this.searchBar.value.toLowerCase();
    console.log("🔍 Search Query:", query);

    const selectedCategories = Array.from(document.querySelectorAll("input[name='category']:checked"))
      .map((checkbox) => checkbox.value);

    console.log("✅ Selected Categories:", selectedCategories);

    this.listings.forEach((listing) => {
      const title = listing.querySelector(".listing-title")?.textContent.toLowerCase() || "";
      const description = listing.querySelector(".listing-description")?.textContent.toLowerCase() || "";
      const category = listing.dataset.category || "";

      const matchesSearch = query === "" || title.includes(query) || description.includes(query);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);

      listing.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
  }
}





