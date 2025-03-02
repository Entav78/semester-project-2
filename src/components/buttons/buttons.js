import { router } from "../../pages/router/router.js";
import { avatarInstance } from "../../js/api/Avatar.js";
import { toggleEditProfile } from "../../pages/profile/profile.js";
import { deleteListingById } from "../../pages/manageListings/manageListings.js";
import { basePath } from "../../js/api/constants.js";

// import { showListingsTab, showBidsTab } from "../../pages/profile/profile.js";

 

//setAvatarInstance(new Avatar());

// ✅ Setup buttons for ALL pages
export function setupButtons() {
  console.log("🔄 Initializing buttons...");

  // ✅ View Item buttons (used in home page & other pages)
  setupListingButtons();

  // ✅ Profile buttons (ONLY if we're on the profile page)
  if (document.body.classList.contains("profile-page")) {
    setupProfileButtons();
  }
}

export function createListingButton() {
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Create Listing";
  button.classList.add(
    "w-full",
    "bg-blue-600",
    "text-white",
    "py-2",
    "rounded",
    "hover:bg-blue-700",
    "transition"
  );
  return button;
}


export function createManageListingButtons(listing) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "gap-2", "mt-2");

  // ✅ Edit Button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit Listing";
  editButton.classList.add(
    "bg-primary", "hover:bg-secondary", "text-white",
    "text-lg", "font-semibold", "px-4", "py-2", "rounded"
  );
  editButton.dataset.id = listing.id;

  editButton.addEventListener("click", () => {
    console.log(`Editing listing: ${listing.id}`);
    window.history.pushState({}, "", `/manageListings?id=${listing.id}`);
    router(`/manageListings?id=${listing.id}`);
  });

  // ✅ Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add(
    "delete-listing", "bg-primary", "hover:bg-secondary", "text-white",
    "text-lg", "font-semibold", "px-4", "py-2", "rounded"
  );

  // ✅ Ensure `listing.id` is passed correctly
  deleteButton.addEventListener("click", () => {
    console.log(`🗑️ Delete button clicked for listing ID: ${listing.id}`);
    deleteListingById(listing.id);
  });

  buttonContainer.append(editButton, deleteButton);
  return buttonContainer;
}



// ✅ Handles "View Item" buttons (used on home page)
export function setupListingButtons() {
  console.log("🔄 setupListingButtons() is running...");

  document.removeEventListener("click", handleViewItemClick); // Prevent duplicate listeners
  document.addEventListener("click", handleViewItemClick);
}

export function handleViewItemClick(event) {
  if (!event.target.classList.contains("view-item")) return;

  event.preventDefault();

  const itemId = event.target.dataset.id;
  console.log("🔍 View Item Button Clicked! Extracted ID:", itemId);

  if (!itemId) {
    console.error("❌ No item ID found on button.");
    return;
  }
  console.log("✅ basePath in buttons.js:", basePath);

  const itemPagePath = `${basePath}/item?id=${itemId}`;
  console.log(`🚀 Navigating to Item Page: ${itemPagePath}`);

  if (window.location.pathname !== itemPagePath) {
    window.history.pushState({}, "", itemPagePath);
    router(itemPagePath);
}

}

let profileButtonsInitialized = false; // ✅ Prevent multiple calls

export function setupProfileButtons(attempt = 1) {
  console.log(`🔄 Initializing profile buttons... (Attempt ${attempt}/5)`);

  const editProfileBtn = document.getElementById("edit-profile-btn");
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const myListingsBtn = document.querySelector("[data-tab='listings']");
  const myBidsBtn = document.querySelector("[data-tab='bids']");

  if (!editProfileBtn || !saveProfileBtn || !myListingsBtn || !myBidsBtn) {
    console.warn(`⚠️ Some profile buttons are missing! Retrying in 500ms... (Attempt ${attempt}/5)`);
    if (attempt < 5) {
      setTimeout(() => setupProfileButtons(attempt + 1), 500);
    } else {
      console.error("❌ Profile buttons NOT found after 5 attempts! Check HTML.");
    }
    return;
  }

  // ✅ Remove ALL event listeners by cloning the button
  const newEditProfileBtn = editProfileBtn.cloneNode(true);
  editProfileBtn.parentNode.replaceChild(newEditProfileBtn, editProfileBtn);

  // ✅ Attach event listeners properly
  newEditProfileBtn.addEventListener("click", toggleEditProfile);
  saveProfileBtn.addEventListener("click", handleSaveProfile);
  myListingsBtn.addEventListener("click", showListingsTab);
  myBidsBtn.addEventListener("click", showBidsTab);

  console.log("✅ Profile buttons initialized!");
}








// ✅ Define `handleSaveProfile()` correctly
function handleSaveProfile() {
  console.log("🛠 handleSaveProfile() was triggered!");
  console.log("🔍 Checking avatarInstance before saving:", avatarInstance);
  
  if (avatarInstance) {
    console.log("💾 Save Profile Clicked - Updating profile...");
    avatarInstance.saveProfileChanges()
      .then(() => {
        console.log("✅ Profile changes saved!");

        // ✅ Close Edit Profile Section
        const editProfileContainer = document.getElementById("edit-profile-container");
        if (editProfileContainer) {
          editProfileContainer.classList.add("hidden");
          console.log("🛠 Edit Profile section closed.");
        } else {
          console.warn("⚠️ Edit Profile section not found!");
        }
      })
      .catch(error => console.error("❌ Error updating profile:", error));
  } else {
    console.error("❌ avatarInstance is not defined!");
  }
}





// ✅ Define event handlers separately
function handleUpdateAvatar() {
  console.log("🖼️ Update Avatar Clicked");

  if (!avatarInstance) {
    console.error("❌ avatarInstance is not initialized!");
    return;
  }

  avatarInstance.updateAvatar();
}




// ✅ Save Profile Changes Handler
export function saveProfileChangesHandler() {
  console.log("💾 Save Profile Clicked - Updating profile...");

  if (!avatarInstance) {
    console.error("❌ avatarInstance is not initialized!");
    return;
  }

  avatarInstance.saveProfileChanges().then(() => {
    // ✅ Close the Edit Profile section AFTER saving
    const editProfileContainer = document.getElementById("edit-profile-container");
    if (editProfileContainer) {
      editProfileContainer.classList.add("hidden");
      console.log("🛠 Edit Profile section closed.");
    } else {
      console.warn("⚠️ Edit Profile container not found!");
    }
  });
}

// ✅ Attach event listener directly (NO DOMContentLoaded)
const saveProfileBtn = document.getElementById("save-profile-btn");
if (saveProfileBtn) {
  saveProfileBtn.removeEventListener("click", saveProfileChangesHandler);
  saveProfileBtn.addEventListener("click", saveProfileChangesHandler);
} else {
  console.warn("⚠️ 'save-profile-btn' not found. Event listener not attached.");
}



function showListingsTab() {
  console.log("📜 My Listings Clicked");
  document.getElementById("listingsTab").classList.remove("hidden");
  document.getElementById("bidsTab").classList.add("hidden");
}

function showBidsTab() {
  console.log("🎯 My Bids Clicked");
  document.getElementById("bidsTab").classList.remove("hidden");
  document.getElementById("listingsTab").classList.add("hidden");
}














