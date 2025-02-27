import { API_LISTINGS, API_KEY } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js";
import { showLoader, hideLoader } from "@/components/loader/loader.js";
import { createListingButton, createManageListingButtons } from "@/components/buttons/index.js";

console.log("🔍 Checking createListingButton:", typeof createListingButton);
console.log("🔍 Checking createManageListingButtons:", typeof createManageListingButtons);

export class ManageListings {
  constructor(container) {
    this.container = container;
    this.formMessage = null;
    
    // ✅ Extract listing ID from URL (for editing)
    const params = new URLSearchParams(window.location.search);
    this.listingId = params.get("id"); 
  
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
    showLoader(); // Show loader while fetching
  
    this.renderForm();
    this.setupEventListeners();
  
    // If editing, fetch existing listing data and populate form
    if (this.listingId) {
      console.log("🛠 Edit mode detected! Calling populateEditForm...");
      await this.populateEditForm(); // ✅ Make sure this runs
  } else {
      console.log("🆕 Create mode detected! Skipping populateEditForm().");
  }
  
    hideLoader(); // Hide loader once ready

    console.log("Calling populateEditForm()...");
await this.populateEditForm();
console.log("populateEditForm() executed!");

  }
  
  
  async populateEditForm() {
    if (!this.listingId) {
      console.warn("⚠️ No listing ID found in the URL. Skipping API call.");
      return;
    }
  
    console.log(`📡 Fetching listing details for ID: ${this.listingId}`);
  
    try {
      const response = await fetch(`${API_LISTINGS}/${this.listingId}`);
      if (!response.ok) throw new Error("Failed to fetch listing data");
  
      const listing = await response.json();
      console.log("✅ Listing data received:", listing);
  
      // ✅ Ensure we access the correct data
      const listingData = listing.data;
      if (!listingData) {
        console.error("❌ No listing data found!");
        return;
      }
  
      // ✅ Populate form fields using a helper function
      this.populateFormFields(listingData);
  
      console.log("✅ Form populated successfully!");
    } catch (error) {
      console.error("❌ Error fetching listing data:", error);
    }
  }
  

        populateFormFields(listingData) {
          const fields = {
            titleInput: document.getElementById("listingTitle"),
            descriptionInput: document.getElementById("listingDescription"),
            deadlineInput: document.getElementById("listingDeadline"),
            mediaInput: document.getElementById("listingMediaUrl"),
            tagsInput: document.getElementById("listingTags"),
          };
        
          // ✅ Set values in form fields (if they exist)
          if (fields.titleInput) {
            fields.titleInput.value = listingData.title || "";
            console.log("📌 Title set:", listingData.title);
          }
        
          if (fields.descriptionInput) {
            fields.descriptionInput.value = listingData.description || "";
            console.log("📌 Description set:", listingData.description);
          }
        
          if (fields.deadlineInput) {
            fields.deadlineInput.value = listingData.endsAt
              ? new Date(listingData.endsAt).toISOString().slice(0, 16)
              : "";
            console.log("📌 Deadline set:", listingData.endsAt);
          }
        
          if (fields.mediaInput) {
            fields.mediaInput.value = listingData.media?.[0]?.url || "";
            console.log("📌 Media URL set:", listingData.media?.[0]?.url);
          }
        
          if (fields.tagsInput) {
            fields.tagsInput.value = listingData.tags?.join(", ") || "";
            console.log("📌 Tags set:", listingData.tags?.join(", "));
          }
        }
        



  

  /**
   * Render the Create Listing Form
   */
  renderForm() {
    this.container.innerHTML = ""; 
    
    // Page Title
    const title = document.createElement("h1");
    title.classList.add("text-xl", "font-bold", "mb-4");
    title.textContent = "Manage Your Listings";

    // Create Form
    const form = document.createElement("form");
    form.id = "manageListingForm"; // Renamed for clarity (was `createListingForm`)
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

    // Buttons (Create vs. Update)
    // Create Submit Button (Dynamically handles Create vs. Update)
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.id = "submitButton"; // ID for reference
    submitButton.classList.add("w-full", "text-white", "py-2", "rounded", "transition");

    if (this.listingId) {
        submitButton.textContent = "Update Listing";
        submitButton.classList.add("bg-primary", "hover:bg-secondary");
    } else {
        submitButton.textContent = "Create Listing";
        submitButton.classList.add("bg-primary", "hover:bg-secondary");
    }

    form.append(submitButton); // Add inside the form

    // Delete Button (Only for Edit Mode)
    if (this.listingId) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete Listing";
        deleteButton.classList.add("w-full", "bg-accent", "text-white", "py-2", "rounded", "hover:bg-secondary", "mt-2");
        
        deleteButton.addEventListener("click", () => this.handleDeleteListing());

        form.append(deleteButton);
    }



    // Append the form and message container
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
      listingItem.classList.add(
        "bg-soft", "border", "border-accent",
        "p-4", "rounded-lg", "shadow-lg",
        "hover:shadow-xl", "transition-shadow", "duration-200",
        "flex", "flex-col", "justify-between", "h-full"
      );
      
      const title = document.createElement("h2");
      title.classList.add("listing-title", "text-xl", "font-bold", "min-h-[3rem]");

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

  async handleCreateListing(event) {
    event.preventDefault();
    console.log("📡 Creating New Listing...");

    showLoader();

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.error("❌ No Auth Token Found. Redirecting to Login...");
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

    if (description.length > 280) {
      this.showMessage(`Description is too long! (${description.length}/280)`, "red");
      hideLoader();
        return;
    }

    if (tagsInput.length > 50) {
        this.showMessage(`Tags are too long! (${tagsInput.length}/50)`, "red");
        hideLoader();
        return;
    }

    if (!title || !deadline) {
        this.showMessage("Title and Deadline are required!", "red");
        hideLoader();
        return;
    }

    const endsAt = new Date(deadline).toISOString();
    const media = mediaInput ? [{ url: mediaInput, alt: title }] : [];
    const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : [];

    const listingData = { title, description, tags, media, endsAt };

    console.log("📤 Sending data to API:", listingData);

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

        if (!response.ok) {
          const responseData = await response.json(); // Fetch the API error response
          console.error("❌ API Error:", responseData);
      
          // ✅ Extract and display the error message to the user
          const errorMessage = responseData.errors?.[0]?.message || "Failed to create listing";
          this.showMessage(errorMessage, "red");
      
          throw new Error(errorMessage);
      }
      
      console.log("✅ Listing successfully created!");
      
      event.target.reset();
      document.getElementById("mediaPreview").innerHTML = "";
      this.showSuccessOptions();
      alert("🎉 Listing created successfully! The auction floor awaits your masterpiece! 🏆", "success");
      
      window.history.pushState({}, "", "/profile");
      router("/profile");
    } catch (error) {
        console.error("Error creating listing:", error);
        this.showMessage("Failed to create listing!", "red");
    }

    hideLoader();
}


async handleUpdateListing(event) {
  event.preventDefault();
  console.log("🔄 Updating Listing...");
  
  showLoader();

  console.log("📡 Checking form values before update:");
  console.log("Title:", document.getElementById("listingTitle")?.value);
  console.log("Description:", document.getElementById("listingDescription")?.value);
  console.log("Deadline:", document.getElementById("listingDeadline")?.value);
  console.log("Media URL:", document.getElementById("listingMediaUrl")?.value);
  console.log("Tags:", document.getElementById("listingTags")?.value);

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
      console.error("❌ No Auth Token Found. Redirecting to Login...");
      this.showMessage("You must be logged in to update a listing!", "red");
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

  console.log("📤 Sending updated data to API:", listingData);

  try {
      const url = `${API_LISTINGS}/${this.listingId}`;
      const response = await fetch(url, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken.trim()}`,
              "X-Noroff-API-Key": API_KEY
          },
          body: JSON.stringify(listingData)
      });

      if (!response.ok) {
          throw new Error("Failed to update listing");
      }

      console.log("✅ Listing successfully updated!");

      event.target.reset();
      document.getElementById("mediaPreview").innerHTML = "";
      this.showSuccessOptions();

      // ✅ Navigate back to profile page
      window.history.pushState({}, "", "/profile");
      router("/profile");
  } catch (error) {
      console.error("❌ Error updating listing:", error);
      this.showMessage("Update failed!", "red");
  }

  hideLoader();
}

showSuccessOptions() {
  console.log("✅ Listing updated successfully!");
  this.showMessage("Listing updated successfully!", "green");

  // ✅ Redirect back to Profile page after success
  setTimeout(() => {
      window.history.pushState({}, "", "/profile");
      router("/profile");
  }, 1000);
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
    console.log("🔧 Setting up event listeners for Manage Listings...");

    // Ensure the form exists before proceeding
    const form = document.getElementById("manageListingForm");
    if (!form) {
        console.error("❌ Form not found! Skipping event listeners.");
        return;
    }

    console.log("✅ Form found. Adding event listeners...");

    if (this.listingId) {
        console.log("🛠 Editing Mode: Attaching handleUpdateListing()");
        console.log("🔍 Checking handleUpdateListing:", this.handleUpdateListing);

        if (typeof this.handleUpdateListing === "function") {
            form.addEventListener("submit", this.handleUpdateListing.bind(this));
        } else {
            console.error("❌ handleUpdateListing() is missing or undefined!");
        }
    } else {
        console.log("🆕 Creation Mode: Attaching handleCreateListing()");
        console.log("🔍 Checking handleCreateListing:", this.handleCreateListing);

        if (typeof this.handleCreateListing === "function") {
            form.addEventListener("submit", this.handleCreateListing.bind(this));
        } else {
            console.error("❌ handleCreateListing() is missing or undefined!");
        }
    }

    // Ensure media input exists before adding event listener
    const mediaInput = document.getElementById("listingMediaUrl");
    if (mediaInput) {
        console.log("✅ Media input found. Adding change listener...");
        mediaInput.addEventListener("change", this.handleMediaPreview?.bind(this));
    } else {
        console.warn("⚠️ Media input not found. Skipping media preview listener.");
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







