import { API_LISTINGS, API_KEY } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { createListingButton, createManageListingButtons } from "@/components/buttons/index.js";

export class ManageListings {
  constructor(container) {
    this.container = container;
    this.formMessage = null;
    this.listings = []; // Store user listings
    this.init();
  }

  /**
   * Initialize the Manage Listings Page
   */
  async init() {
    if (!this.container) {
      console.error("Manage Listings container not found.");
      return;
    }

    console.log("Initializing Manage Listings...");
    showLoader();

    this.renderForm();
    this.setupEventListeners();
    await this.fetchUserListings(); // Fetch existing listings

    hideLoader();
  }

  /**
   * Render the Create Listing Form
   */
  renderForm() {
    this.container.innerHTML = ""; 

    // Title
    const title = document.createElement("h1");
    title.classList.add("text-xl", "font-bold", "mb-4");
    title.textContent = "Manage Your Listings";

    // Form
    const form = document.createElement("form");
    form.id = "createListingForm";
    form.classList.add("space-y-4", "bg-gray-100", "p-6", "rounded-lg", "shadow-lg");

    // Helper function for input fields
    const createInputField = (labelText, id, type = "text", isRequired = false) => {
      const wrapper = document.createElement("div");
      const label = document.createElement("label");
      label.textContent = labelText;
      label.setAttribute("for", id);
      label.classList.add("block", "font-semibold");

      const input = document.createElement("input");
      input.id = id;
      input.name = id;
      input.type = type;
      input.classList.add("w-full", "p-2", "border", "rounded");
      if (isRequired) input.required = true;

      wrapper.append(label, input);
      return wrapper;
    };

    // Add fields
    form.append(
      createInputField("Title", "listingTitle", "text", true),
      createInputField("Upload Image URL", "listingMediaUrl"),
      createInputField("Tags (comma-separated)", "listingTags"),
      createInputField("Deadline", "listingDeadline", "datetime-local", true)
    );

    // Description Field
    const descWrapper = document.createElement("div");
    const descLabel = document.createElement("label");
    descLabel.textContent = "Description";
    descLabel.setAttribute("for", "listingDescription");
    descLabel.classList.add("block", "font-semibold");

    const descInput = document.createElement("textarea");
    descInput.id = "listingDescription";
    descInput.name = "description";
    descInput.classList.add("w-full", "p-2", "border", "rounded");
    descInput.rows = 4;

    descWrapper.append(descLabel, descInput);
    form.append(descWrapper);

    // Media Preview
    const mediaPreview = document.createElement("div");
    mediaPreview.id = "mediaPreview";
    mediaPreview.classList.add("mt-2", "flex", "gap-2");
    form.appendChild(mediaPreview);

    // ✅ Use the imported Create Listing button
    form.append(createListingButton());

    // Append form
    this.formMessage = document.createElement("p");
    this.formMessage.id = "formMessage";
    this.formMessage.classList.add("mt-4", "text-center", "text-red-500", "hidden");

    this.container.append(title, form, this.formMessage);
  }

  /**
   * Fetch user's listings and render them
   */
  async fetchUserListings() {
    console.log("Fetching user listings...");
    showLoader();

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No Auth Token. Cannot fetch listings.");
        this.showMessage("You must be logged in to manage listings!", "red");
        hideLoader();
        return;
      }

      const response = await fetch(`${API_LISTINGS}/user`, {
        headers: { 
          "Authorization": `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY
        },
      });

      if (!response.ok) throw new Error("Failed to fetch listings");

      this.listings = await response.json();
      this.renderListings();
    } catch (error) {
      console.error("Error fetching user listings:", error);
      this.showMessage("Failed to fetch listings!", "red");
    }

    hideLoader();
  }

  /**
   * Render Listings with Edit and Delete Buttons
   */
  renderListings() {
    const listingsContainer = document.createElement("div");
    listingsContainer.id = "listingsContainer";
    listingsContainer.classList.add("mt-6");

    this.listings.forEach((listing) => {
      const listingItem = document.createElement("div");
      listingItem.classList.add("listing-item", "border", "p-4", "rounded-lg", "shadow-lg");

      const title = document.createElement("h2");
      title.classList.add("text-xl", "font-bold");
      title.textContent = listing.title;

      // ✅ Use imported Edit/Delete buttons
      const buttonContainer = createManageListingButtons(
        listing,
        this.handleDeleteListing.bind(this),
        this.handleEditListing.bind(this)
      );

      listingItem.append(title, buttonContainer);
      listingsContainer.appendChild(listingItem);
    });

    this.container.appendChild(listingsContainer);
  }

  /**
   * Handle Listing Deletion
   */
  async handleDeleteListing(listingId) {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    showLoader();

    try {
      const response = await fetch(`${API_LISTINGS}/${listingId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "X-Noroff-API-Key": API_KEY
        },
      });

      if (!response.ok) throw new Error("Failed to delete listing");

      console.log("Listing successfully deleted!");
      this.showMessage("Listing deleted successfully!", "green");

      await this.fetchUserListings(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting listing:", error);
      this.showMessage("Failed to delete listing!", "red");
    }

    hideLoader();
  }

  /**
   * Handle Listing Editing (Redirects to Edit Page)
   */
  handleEditListing(listing) {
    window.history.pushState({}, "", `/edit-listing?id=${listing.id}`);
    router(`/edit-listing?id=${listing.id}`);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    console.log("Setting up event listeners...");
    const form = document.getElementById("createListingForm");
    const mediaInput = document.getElementById("listingMediaUrl");

    if (form) {
      console.log("Adding submit listener...");
      form.addEventListener("submit", (event) => this.handleCreateListing(event));
    }

    if (mediaInput) {
      console.log("Adding media preview listener...");
      mediaInput.addEventListener("change", this.handleMediaPreview.bind(this));
    }
  }

  /**
   * Display Success or Error Message
   */
  showMessage(text, color) {
    this.formMessage.textContent = text;
    this.formMessage.classList.remove("hidden", "text-red-500", "text-green-600");
    this.formMessage.classList.add(color === "red" ? "text-red-500" : "text-green-600");
  }
}

/**
 * Initialize the Manage Listings Page
 */
export function initializeManageListingsPage() {
  console.log("Initializing Manage Listings Page...");
  const mainContainer = document.getElementById("main-container");
  if (!mainContainer) return;
  new ManageListings(mainContainer);
}






