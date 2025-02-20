
import { basePath } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js"; // Import the router


export function setupListingButtons() {
  console.log("🔄 Setting up event listener for View Item buttons...");

  document.removeEventListener("click", handleViewItemClick); // Prevent duplicate listeners
  document.addEventListener("click", handleViewItemClick);
}

function handleViewItemClick(event) {
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

export function setupProfileButtons() {
  console.log("🔄 Re-initializing profile buttons...");

  const editProfileBtn = document.getElementById("edit-profile-btn");
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const updateAvatarBtn = document.getElementById("update-avatar-btn");

  if (!editProfileBtn || !saveProfileBtn || !updateAvatarBtn) {
    console.error("❌ One or more profile buttons are missing!");
    return;
  }

  // ✅ Remove old event listeners to prevent duplicates
  editProfileBtn.replaceWith(editProfileBtn.cloneNode(true));
  saveProfileBtn.replaceWith(saveProfileBtn.cloneNode(true));
  updateAvatarBtn.replaceWith(updateAvatarBtn.cloneNode(true));

  // ✅ Select new elements
  const newEditProfileBtn = document.getElementById("edit-profile-btn");
  const newSaveProfileBtn = document.getElementById("save-profile-btn");
  const newUpdateAvatarBtn = document.getElementById("update-avatar-btn");

  // ✅ Reattach event listeners
  newEditProfileBtn.addEventListener("click", () => {
    console.log("✏️ Edit Profile clicked!");
    document.getElementById("edit-profile-container").classList.toggle("hidden");
  });

  newSaveProfileBtn.addEventListener("click", () => {
    console.log("💾 Saving profile changes...");
    saveProfileChanges();
  });

  newUpdateAvatarBtn.addEventListener("click", () => {
    console.log("🖼 Updating Avatar...");
    const avatarImg = document.getElementById("avatar-img");
    const avatarInput = document.getElementById("avatar-url-input");
    if (avatarImg && avatarInput) {
      avatarImg.src = avatarInput.value.trim();
    }
  });

  console.log("✅ Profile buttons initialized!");
}



