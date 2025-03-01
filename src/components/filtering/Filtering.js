import { fetchAllListings } from "../../js/api/listings.js";
//import { router } from "./../pages/router/router.js";
//import { Pagination } from "./../js/components/pagination/Pagination.js";


export class Filtering {
  constructor() {
    console.log("Initializing Filtering...");

    this.categoryFilter = document.getElementById("category-filter");
    this.advancedFilters = document.getElementById("advanced-filters");
    this.applyFiltersBtn = document.getElementById("apply-filters");
    this.searchBar = document.getElementById("search-bar");
    this.listingsContainer = document.getElementById("listingsContainer");
    this.paginationContainer = document.getElementById("paginationContainer");
    this.sortDropdown = document.getElementById("sort-dropdown"); // ✅ Fix added!

    if (!this.categoryFilter || !this.advancedFilters || !this.applyFiltersBtn || !this.searchBar || !this.listingsContainer) {
      console.warn("Filtering elements not found. Skipping setup.");
      return;
    }

    this.listings = []; // Store all listings for filtering
    this.filteredListings = []; // Store filtered results for pagination
    this.itemsPerPage = 9;
    this.currentPage = 1;

    this.setupEventListeners();
    this.loadListings();

    
}


  async loadListings() {
    console.log("Fetching all listings for filtering...");
    try {
        this.listings = await fetchAllListings();
        this.applyFilters();
    } catch (error) {
        console.error("Error fetching listings for filtering:", error);
    }

    this.listings.forEach(listing => {
      if (!listing.endsAt) {
        console.warn(`Missing endsAt for: ${listing.title} (ID: ${listing.id})`);
      } else {
        console.log(`Title: ${listing.title}, Ends At: ${listing.endsAt}`);
      }
    });
    this.listings = await fetchAllListings();

    this.listings.forEach(listing => {
      //console.log(`Filtering.js - Listing: ${listing.title}, Ends At: ${listing.endsAt}`);
    });
       
}


setupEventListeners() {
  this.categoryFilter.addEventListener("change", () => {
    if (this.categoryFilter.value === "multiple") {
      this.advancedFilters.classList.remove("hidden");
    } else {
      this.advancedFilters.classList.add("hidden");
      this.clearCheckboxes();
    }
    this.applyFilters(); // ✅ This one is fine
  });

  this.searchBar.addEventListener("input", () => this.applyFilters());
  this.applyFiltersBtn.addEventListener("click", () => this.applyFilters());

  if (this.sortDropdown) {
    this.sortDropdown.addEventListener("change", (event) => {
      console.log("🔄 Sort dropdown changed. Resetting selected tags...");
      this.clearCheckboxes();
      console.log("✅ All tags have been reset!");

      // ✅ Avoid infinite loop: Only call applyFilters **after** sorting is done
      this.sortListings(event.target.value);
      this.renderFilteredListings();
      this.renderPaginationControls(); 
    });
  }
}



clearCheckboxes() {
  const tagFilters = document.querySelectorAll("input[name='tags']:checked");
  tagFilters.forEach(tag => tag.checked = false);
  console.log("✅ Cleared all selected tag checkboxes.");
}


applyFilters() {
  console.log("🔍 Applying Filters...");
  console.log("🛠 API Tags in Listings:", this.listings.map(l => l.tags));

  // ✅ Map API tags to more user-friendly names
  const tagMappings = {
    "vehicles & parts": "cars",
    "vehicle": "cars",
    "watch": "jewelry",
    "timekeeper": "jewelry",
    "technology": "tech",
    "electronics": "tech",
    "furniture": "home decor",
    "decor": "home decor",
    "artauctionapp": "art",
    "bff": "fashion", // 🤷‍♂️ Looks like BFF is a fashion thing?
  };

  // ✅ Check if listings exist
  if (!this.listings || this.listings.length === 0) {
    console.warn("⚠️ No listings found! Are they being loaded?");
    return;
  }

  console.log("✅ All Listings Before Filtering:", this.listings);

  const query = this.searchBar.value.toLowerCase();
  console.log("🔍 Search Query:", query);

  let selectedDropdownTag = this.categoryFilter.value.toLowerCase();

  // ✅ Convert plural to singular if necessary
  if (selectedDropdownTag.endsWith("s")) {
    selectedDropdownTag = selectedDropdownTag.slice(0, -1);
  }

  console.log("📌 Updated Dropdown Tag (Singular):", selectedDropdownTag);

  const selectedTags = Array.from(document.querySelectorAll("input[name='tags']:checked"))
    .map(checkbox => checkbox.value.toLowerCase());

  // ✅ Ensure dropdown value is added, but ignore "all" and empty values
  if (selectedDropdownTag && selectedDropdownTag !== "all") {
    selectedTags.push(selectedDropdownTag);
  }

  console.log("📌 Updated Selected Tags:", selectedTags);

  // ✅ Before filtering - Debug first 5 items
  console.log(
    "🔍 Before Filtering (First 5 Listings):",
    this.listings.slice(0, 5).map((listing) => ({
      title: listing.title,
      endsAt: listing.endsAt || "Missing endsAt",
    }))
  );

  this.listingsContainer.innerHTML = ""; // ✅ Clear listings display

  this.filteredListings = this.listings.filter((listing) => {
    const title = listing.title.toLowerCase();
    const description = listing.description?.toLowerCase() || "";

    // ✅ Normalize API tags using mappings
    const cleanedTags = listing.tags
      ? listing.tags.map(tag => tagMappings[tag.toLowerCase().trim()] || tag.toLowerCase().trim())
      : [];

    console.log("🧹 Cleaned Tags for Listing:", listing.title, cleanedTags);

    const matchesSearch = query === "" || title.includes(query) || description.includes(query);
    const matchesTags =
      selectedTags.length === 0 || cleanedTags.some(tag => selectedTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // ✅ After filtering - Debug first 5 items
  console.log(
    "After Filtering (First 5 Listings):",
    this.filteredListings.slice(0, 5).map((listing) => ({
      title: listing.title,
      endsAt: listing.endsAt || "Missing endsAt",
    }))
  );

  this.currentPage = 1; // ✅ Reset to page 1
  this.renderFilteredListings();
  this.renderPaginationControls();
}





sortListings(sortBy) {
  if (!this.filteredListings || this.filteredListings.length === 0) {
    console.warn("⚠️ No listings available for sorting.");
    return;
  }

  switch (sortBy) {
    case "endingSoon":
      this.filteredListings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
      break;
    case "newest":
      this.filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "highestBid":
      this.filteredListings.sort((a, b) => (b.highestBid ?? 0) - (a.highestBid ?? 0)); // ✅ Default to 0 if undefined
      break;
    case "lowestBid":
      this.filteredListings.sort((a, b) => (a.highestBid ?? 0) - (b.highestBid ?? 0)); // ✅ Default to 0 if undefined
      break;
    default:
      console.warn("⚠️ Unknown sorting method:", sortBy);
      break;
  }

  this.renderFilteredListings();
  this.renderPaginationControls();
}


  renderFilteredListings() {
    this.listingsContainer.innerHTML = ""; // Clear previous results

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedListings = this.filteredListings.slice(startIndex, endIndex);

    if (paginatedListings.length === 0) {
      this.listingsContainer.innerHTML = "<p>No matching listings found.</p>";
      return;
    }

    paginatedListings.forEach((listing) => {
      const listingItem = document.createElement("div");
      listingItem.classList.add(
        "bg-soft", "border", "border-accent",
        "p-4", "rounded-lg", "shadow-lg",
        "hover:shadow-xl", "transition-shadow", "duration-200",
        "flex", "flex-col", "justify-between",
        "h-[500px]" // ✅ Ensure all cards have the same height
      );

      const title = document.createElement("h2");
      title.classList.add("listing-title", "text-xl", "font-bold");
      title.textContent = listing.title;

      

      // Handle Image
      const image = document.createElement("img");
      image.src = (listing.media?.length > 0 && typeof listing.media[0] === "object") ? listing.media[0].url : "/img/default.jpg";
      image.alt = listing.title || "No image available";
      image.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

       // ✅ Description that fills available space
      const description = document.createElement("p");
      description.classList.add(
        "listing-description",
        "text-gray-600",
        "mt-2",
        "flex-grow",
        "line-clamp-2"
      );
      
      description.textContent = listing.description || "No description available.";

      // ✅ Declare auctionEnd before using it
      const auctionEnd = document.createElement("p");
      auctionEnd.classList.add("mt-2", "font-bold");
      if (listing.endsAt) {
        const now = new Date();
        const auctionEndTime = new Date(listing.endsAt);
        auctionEnd.textContent = auctionEndTime < now ? "SOLD / AUCTION ENDED" : `Auction Ends: ${auctionEndTime.toLocaleString()}`;
        auctionEnd.classList.add(auctionEndTime < now ? "text-gray-700 bg-yellow-300 p-2 rounded-lg" : "text-text");
      } else {
        auctionEnd.textContent = "No deadline set";
      }

     // console.log(`Listing: ${listing.title}, Ends At: ${listing.endsAt}`);


      if (listing.endsAt) {
        const auctionEndTime = new Date(listing.endsAt);
        const now = new Date();

        if (auctionEndTime < now) {
          auctionEnd.textContent = "SOLD / AUCTION ENDED";
          auctionEnd.classList.add("text-gray-700", "bg-yellow-300", "p-2", "rounded-lg");
        } else {
          auctionEnd.textContent = `Auction Ends: ${auctionEndTime.toLocaleString()}`;
          auctionEnd.classList.add("text-red-500");
        }
      } else {
        auctionEnd.textContent = "No deadline set"; // ✅ Fallback for missing `endsAt`
        auctionEnd.classList.add("text-gray-700", "bg-yellow-300", "p-2", "rounded-lg");
      }

      // ✅ Correct button styles (matching brown theme)
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Item";
      viewButton.classList.add("view-item", "bg-primary", "hover:bg-secondary", "transition", "text-white", "text-lg", "font-semibold", "px-4", "py-2", "rounded");
      viewButton.dataset.id = listing.id;

      

      listingItem.append(title, image, description, auctionEnd, viewButton);
      this.listingsContainer.appendChild(listingItem);
    });

    console.log(`Filtered ${paginatedListings.length} listings on page ${this.currentPage}.`);
}




renderPaginationControls() {
  if (this.filteredListings.length === 0) {
    console.warn("⚠️ No listings matched the filters! Showing all instead.");
    this.filteredListings = [...this.listings]; // ✅ Show all if filtering removes everything
    this.currentPage = 1; // ✅ Reset to page 1 if no listings were found
  }
  
  this.paginationContainer.innerHTML = ""; // Clear existing pagination

  const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
  if (totalPages <= 1) return; // No pagination needed for 1 page

  const paginationButtons = [];

  // 🔹 **Previous Button**
  if (this.currentPage > 1) {
      const prevButton = this.createPaginationButton("« Prev", this.currentPage - 1);
      paginationButtons.push(prevButton);
  }

  // 🔹 **First Page**
  if (this.currentPage > 3) {
      paginationButtons.push(this.createPaginationButton(1, 1));
      if (this.currentPage > 4) paginationButtons.push(this.createEllipsis());
  }

  // 🔹 **Middle Pages (Current ± 1)**
  for (let i = Math.max(1, this.currentPage - 1); i <= Math.min(totalPages, this.currentPage + 1); i++) {
      paginationButtons.push(this.createPaginationButton(i, i, i === this.currentPage));
  }

  // 🔹 **Last Page**
  if (this.currentPage < totalPages - 2) {
      if (this.currentPage < totalPages - 3) paginationButtons.push(this.createEllipsis());
      paginationButtons.push(this.createPaginationButton(totalPages, totalPages));
  }

  // 🔹 **Next Button**
  if (this.currentPage < totalPages) {
      const nextButton = this.createPaginationButton("Next »", this.currentPage + 1);
      paginationButtons.push(nextButton);
  }

  // 🔹 Append buttons to container
  paginationButtons.forEach((btn) => this.paginationContainer.appendChild(btn));

  console.log(`✅ Pagination Updated: ${this.currentPage} / ${totalPages}`);
}



createPaginationButton(text, page, isActive = false) {
  const button = document.createElement("button");
  button.textContent = text;
  
  // Always add these base styles
  button.classList.add("px-4", "py-2", "mx-1", "rounded", "transition");

  // Add active or default styles correctly
  if (isActive) {
    button.classList.add("bg-primary", "text-white", "font-bold");
  } else {
    button.classList.add("bg-soft", "text-text", "hover:bg-secondary", "hover:text-white");
  }

  button.addEventListener("click", () => this.changePage(page));
  return button;
}


createEllipsis() {
  const ellipsis = document.createElement("span");
  ellipsis.textContent = "...";
  ellipsis.classList.add("px-2", "py-2", "mx-1", "text-text");
  return ellipsis;
}




  changePage(newPage) {
    if (newPage < 1 || newPage > Math.ceil(this.filteredListings.length / this.itemsPerPage)) return;

    this.currentPage = newPage;
    this.renderFilteredListings();
    this.renderPaginationControls();
  }
  
}









