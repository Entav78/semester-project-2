import { API_LISTINGS, API_KEY } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js";


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

    this.renderForm();
    this.setupEventListeners();
  }

  /**
   * Render the Listing Form
   */
  renderForm() {
    this.container.innerHTML = `
      <h1 class="text-xl font-bold mb-4">Manage Your Listings</h1>
      <form id="createListingForm" class="space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg">
        <!-- Title -->
        <div>
          <label for="listingTitle" class="block font-semibold">Title</label>
          <input type="text" id="listingTitle" name="title" class="w-full p-2 border rounded" required />
        </div>

        <!-- Description -->
        <div>
          <label for="listingDescription" class="block font-semibold">Description</label>
          <textarea id="listingDescription" name="description" class="w-full p-2 border rounded" rows="4"></textarea>
        </div>

        <!-- Media Upload -->
        <div>
          <label for="listingMedia" class="block font-semibold">Upload Image(s)</label>
          <input type="text" id="listingMediaUrl" name="mediaUrl" class="w-full p-2 border rounded" placeholder="Paste image URL here" />
          <div id="mediaPreview" class="flex flex-wrap gap-2 mt-2"></div>
        </div>

        <!-- Tags -->
        <div>
          <label for="listingTags" class="block font-semibold">Tags (comma-separated)</label>
          <input type="text" id="listingTags" name="tags" class="w-full p-2 border rounded" placeholder="e.g., vintage, electronics, antique" />
        </div>

        <!-- Deadline -->
        <div>
          <label for="listingDeadline" class="block font-semibold">Deadline</label>
          <input type="datetime-local" id="listingDeadline" name="deadline" class="w-full p-2 border rounded" required />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Create Listing
        </button>
      </form>

      <!-- Success/Error Message -->
      <p id="formMessage" class="mt-4 text-center text-red-500 hidden"></p>
    `;

    this.formMessage = document.getElementById("formMessage");
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    console.log("Setting up event listeners for Manage Listings...");
    const form = document.getElementById("createListingForm");
    const mediaInput = document.getElementById("listingMediaUrl"); // Make sure this matches your input ID

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
  // Get Image URL from Input Field
  const imageUrl = event.target.value.trim();

  if (!imageUrl) {
      console.warn("No image URL provided.");
      return;
  }

  // Validate URL Format (Basic Check)
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

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.error("No Auth Token Found. Redirecting to Login...");
        this.showMessage("You must be logged in to create a listing!", "red");
        return;
    }

    const title = document.getElementById("listingTitle")?.value.trim();
    const description = document.getElementById("listingDescription")?.value.trim();
    const deadline = document.getElementById("listingDeadline")?.value;
    const mediaInput = document.getElementById("listingMediaUrl")?.value.trim();
    const tagsInput = document.getElementById("listingTags")?.value.trim();

    if (!title || !deadline) {
        this.showMessage("Title and Deadline are required!", "red");
        return;
    }

    const endsAt = new Date(deadline).toISOString();
    const media = mediaInput ? [{ url: mediaInput, alt: title }] : [];
    const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : [];

    const listingData = { title, description, tags, media, endsAt };

    console.log("Sending data to API:", listingData);
    console.log("Using Auth Token:", authToken);
    console.log("Using API Key:", API_KEY);

    try {
        console.log("🔍 API Key Length:", API_KEY.length);

        const response = await fetch(API_LISTINGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken.trim()}`,
                "X-Noroff-API-Key": API_KEY
            },
            body: JSON.stringify(listingData)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error(`API Error: ${response.status} - ${response.statusText}`, errorResponse);
            console.error("API Error Message:", errorResponse.errors?.[0]?.message || "Unknown error");

            throw new Error("Failed to create listing");
        }

        console.log("✅ Listing successfully created!");

        // Clear Form & Hide It
        event.target.reset();
        document.getElementById("mediaPreview").innerHTML = "";
        document.getElementById("createListingForm").classList.add("hidden"); // Hide the form

        // Show Success Message with "View My Listings" Button
        this.showSuccessOptions();

    } catch (error) {
        console.error("Error creating listing:", error);
        this.showMessage("Failed to create listing!", "red");
    }
}


  /**
   * Show Success Message with "View My Listings" Button
   */
  showSuccessOptions() {
    const successMessage = document.getElementById("formMessage");
    successMessage.innerHTML = `
      Listing created successfully! <br>
      <button id="goToProfile" class="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700">
        View My Listings
      </button>
    `;
    successMessage.classList.remove("hidden");

    document.getElementById("goToProfile").addEventListener("click", () => {
      window.history.pushState({}, "", "/profile");
      router("/profile");
    });
  }
}

/**
 * Function to initialize the Manage Listings Page
 */
export function initializeManageListingsPage() {
  console.log("Initializing Manage Listings Page... FUNCTION CALLED");

  const mainContainer = document.getElementById("main-container");
  if (!mainContainer) {
    console.error("Main container not found!");
    return;
  }

  new ManageListings(mainContainer);
}

window.initializeManageListingsPage = initializeManageListingsPage;

