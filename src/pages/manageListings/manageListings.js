import { API_LISTINGS, API_KEY } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";

export class ManageListings {
  constructor(container) {
    this.container = container;
    this.formMessage = null;
    this.init();
  }

  /**
   * Initialize the Manage Listings Page
   */
  init() {
    if (!this.container) {
      console.error("Manage Listings container not found.");
      return;
    }

    console.log("Initializing Manage Listings...");
    showLoader(); //Show loader during initialization

    this.renderForm();
    this.setupEventListeners();

    hideLoader(); // Hide loader once form is ready
  }

  /**
   * Render Form
   */
  renderForm() {
    this.container.innerHTML = ""; // Clear old content

    // Create Title
    const title = document.createElement("h1");
    title.classList.add("text-xl", "font-bold", "mb-4");
    title.textContent = "Manage Your Listings";

    // Create Form
    const form = document.createElement("form");
    form.id = "createListingForm";
    form.classList.add("space-y-4", "bg-gray-100", "p-6", "rounded-lg", "shadow-lg");

    // Helper function to create input fields
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

    // Add fields using createInputField
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

    // Ensure mediaPreview container exists
    const mediaPreview = document.createElement("div");
    mediaPreview.id = "mediaPreview";
    mediaPreview.classList.add("mt-2", "flex", "gap-2");
    form.appendChild(mediaPreview);

    // Submit Button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Create Listing";
    submitButton.classList.add("w-full", "bg-blue-600", "text-white", "py-2", "rounded", "hover:bg-blue-700", "transition");

    form.append(submitButton);

    // Append form & success message container
    this.formMessage = document.createElement("p");
    this.formMessage.id = "formMessage";
    this.formMessage.classList.add("mt-4", "text-center", "text-red-500", "hidden");

    this.container.append(title, form, this.formMessage);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    console.log("Setting up event listeners for Manage Listings...");
    const form = document.getElementById("createListingForm");
    const mediaInput = document.getElementById("listingMediaUrl");

    if (form) {
      console.log("Found form. Adding submit listener...");
      form.addEventListener("submit", (event) => this.handleCreateListing(event));
    }

    if (mediaInput) {
      console.log("Found media input. Adding change listener...");
      mediaInput.addEventListener("change", this.handleMediaPreview.bind(this));
    }
  }

  /**
   * Handle Image Preview (Now Works with URLs)
   */
  handleMediaPreview(event) {
    const previewContainer = document.getElementById("mediaPreview");
    previewContainer.innerHTML = ""; 

    const imageUrl = event.target.value.trim();
    if (!imageUrl) {
      console.warn("No image URL provided.");
      return;
    }

    if (!imageUrl.startsWith("http")) {
      console.error("Invalid image URL. Must start with http or https.");
      return;
    }

    // Create and Display Image Preview
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "w-24 h-24 object-cover rounded-lg shadow-md";
    img.alt = "Listing Image Preview";
    previewContainer.appendChild(img);

    console.log("Image preview updated with URL:", imageUrl);
  }

  /**
   * Handle Form Submission (Create Listing)
   */
  async handleCreateListing(event) {
    event.preventDefault();
    console.log("Creating a new listing...");

    showLoader(); // Show loader before submission

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No Auth Token Found. Redirecting to Login...");
      this.showMessage("You must be logged in to create a listing!", "red");
      hideLoader();
      return;
    }

    const title = document.getElementById("listingTitle")?.value.trim();
    const description = document.getElementById("listingDescription")?.value.trim();
    const deadline = document.getElementById("listingDeadline")?.value;
    const mediaInput = document.getElementById("listingMediaUrl")?.value.trim();
    const tagsInput = document.getElementById("listingTags")?.value.trim();

    if (!title || !deadline) {
      this.showMessage("Title and Deadline are required!", "red");
      hideLoader();
      return;
    }

    const endsAt = new Date(deadline).toISOString();
    const media = mediaInput ? [{ url: mediaInput, alt: title }] : [];
    const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : [];

    const listingData = { title, description, tags, media, endsAt };

    try {
      const response = await fetch(API_LISTINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY
        },
        body: JSON.stringify(listingData)
      });

      if (!response.ok) throw new Error("Failed to create listing");

      console.log("Listing successfully created!");

      // Clear Form & Hide It
      event.target.reset();
      document.getElementById("mediaPreview").innerHTML = "";
      document.getElementById("createListingForm").classList.add("hidden");

      this.showSuccessOptions();
    } catch (error) {
      console.error("Error creating listing:", error);
      this.showMessage("Failed to create listing!", "red");
    }

    hideLoader();
  }

  /**
   * Show success message and redirect button
   */
  showSuccessOptions() {
    this.formMessage.textContent = "Listing created successfully!";
    this.formMessage.classList.remove("hidden", "text-red-500");
    this.formMessage.classList.add("text-green-600");

    const viewListingsButton = document.createElement("button");
    viewListingsButton.textContent = "View My Listings";
    viewListingsButton.classList.add("bg-blue-600", "text-white", "p-2", "rounded", "mt-2", "hover:bg-blue-700");

    this.formMessage.appendChild(viewListingsButton);
    viewListingsButton.addEventListener("click", () => {
      window.history.pushState({}, "", "/profile");
      router("/profile");
    });
  }
}

/**
 * Ensure correct function name for router
 */
export function initializeManageListingsPage() {
  console.log("Initializing Manage Listings Page...");
  const mainContainer = document.getElementById("main-container");
  if (!mainContainer) return;
  new ManageListings(mainContainer);
}





