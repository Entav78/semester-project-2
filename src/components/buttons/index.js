import { router } from "@/pages/router/router.js";
import { avatarInstance } from "@/js/api/Avatar.js";
 

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

export function createManageListingButtons(listing, onDelete, onEdit) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "gap-2", "mt-2");

  // Edit Button
  const editButton = document.createElement("button");
editButton.textContent = "Edit Listing";
editButton.classList.add("bg-yellow-500", "text-white", "px-4", "py-2", "rounded", "mt-2");
editButton.dataset.id = listing.id;

editButton.addEventListener("click", () => {
  console.log(`Editing listing: ${listing.id}`);
  window.history.pushState({}, "", `/manageListings?id=${listing.id}`); // ✅ Pass listing ID
  router(`/manageListings?id=${listing.id}`); // Navigate to manageListings
});


  // Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add(
    "delete-listing",
    "bg-red-500",
    "text-white",
    "px-4",
    "py-2",
    "rounded",
    "hover:bg-red-600"
  );
  deleteButton.addEventListener("click", () => onDelete(listing.id));

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

  const itemPagePath = `/item?id=${itemId}`;
  console.log(`🚀 Navigating to Item Page: ${itemPagePath}`);

  window.history.pushState({}, "", itemPagePath);
  router(itemPagePath);
}

function toggleEditProfile() {
  const editProfileContainer = document.getElementById("edit-profile-container");

  if (!editProfileContainer) {
    console.warn("⚠️ Edit Profile container not found!");
    return;
  }

  console.log("🔄 Toggling edit profile...");

  // Check if the container is hidden
  const isHidden = editProfileContainer.classList.contains("hidden");

  if (isHidden) {
    console.log("✅ Showing edit profile section...");
    editProfileContainer.classList.remove("hidden");
  } else {
    console.log("🚪 Hiding edit profile section...");
    editProfileContainer.classList.add("hidden"); // ✅ Hide everything when closing
  }
}





let profileButtonsInitialized = false; // ✅ Prevent multiple calls

export function setupProfileButtons() {
  if (profileButtonsInitialized) {
    console.warn("⚠️ Profile buttons already initialized. Removing old event listeners...");
  
    // 🚨 Remove old listeners
    document.getElementById("edit-profile-btn")?.removeEventListener("click", toggleEditProfile);
    document.getElementById("save-profile-btn")?.removeEventListener("click", handleSaveProfile);
    document.getElementById("update-avatar-btn")?.removeEventListener("click", handleUpdateAvatar);
    document.querySelector("[data-tab='listings']")?.removeEventListener("click", showListingsTab);
    document.querySelector("[data-tab='bids']")?.removeEventListener("click", showBidsTab);
  
    profileButtonsInitialized = false; // ✅ Force re-initialization
  }
  
  

  console.log("🔄 Initializing profile buttons...");

  // ✅ Select elements
  const updateAvatarSection = document.getElementById("updateAvatarSection");
  const updateAvatarBtn = document.getElementById("update-avatar-btn");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const myListingsTab = document.querySelector("[data-tab='listings']");
  const myBidsTab = document.querySelector("[data-tab='bids']");

  if (updateAvatarBtn) {
    updateAvatarBtn.removeEventListener("click", handleUpdateAvatar);
    updateAvatarBtn.addEventListener("click", handleUpdateAvatar);
  } else {
    console.warn("⚠️ 'update-avatar-btn' not found!");
  }

  if (editProfileBtn) {
    editProfileBtn.removeEventListener("click", toggleEditProfile);
    editProfileBtn.addEventListener("click", toggleEditProfile);
  } else {
    console.warn("⚠️ 'edit-profile-btn' not found!");
  }

  if (saveProfileBtn) {
    saveProfileBtn.removeEventListener("click", handleSaveProfile);
    saveProfileBtn.addEventListener("click", handleSaveProfile);
  } else {
    console.warn("⚠️ 'save-profile-btn' not found!");
  }

  if (myListingsTab) {
    myListingsTab.removeEventListener("click", showListingsTab);
    myListingsTab.addEventListener("click", showListingsTab);
  } else {
    console.warn("⚠️ 'listings tab' not found!");
  }

  if (myBidsTab) {
    myBidsTab.removeEventListener("click", showBidsTab);
    myBidsTab.addEventListener("click", showBidsTab);
  } else {
    console.warn("⚠️ 'bids tab' not found!");
  }

  profileButtonsInitialized = true; // ✅ Stops infinite calls
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
      console.warn("⚠️ Edit Profile section not found!");
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














