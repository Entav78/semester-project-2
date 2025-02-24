import { router } from "@/pages/router/router.js";

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
  console.log("🔄 Setting up View Item buttons...");

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

// ✅ Profile Page Buttons (Only runs if user is on profile page)
let profileButtonsInitialized = false; // ✅ Prevent multiple calls

export function setupProfileButtons() {
  if (profileButtonsInitialized) {
    console.warn("⚠️ Profile buttons already initialized. Skipping...");
    return; // ✅ Stops multiple setups
  }

  console.log("🔄 Initializing profile buttons...");

  // ✅ Select elements
  const updateAvatarBtn = document.getElementById("update-avatar-btn");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const myListingsTab = document.querySelector("[data-tab='listings']");
  const myBidsTab = document.querySelector("[data-tab='bids']");

  if (updateAvatarBtn) {
    updateAvatarBtn.removeEventListener("click", handleUpdateAvatar);
    updateAvatarBtn.addEventListener("click", handleUpdateAvatar);
  }

  if (editProfileBtn) {
    editProfileBtn.removeEventListener("click", toggleEditProfile);
    editProfileBtn.addEventListener("click", toggleEditProfile);
  }

  if (saveProfileBtn) {
    saveProfileBtn.removeEventListener("click", saveProfileChanges);
    saveProfileBtn.addEventListener("click", saveProfileChanges);
  }

  if (myListingsTab) {
    myListingsTab.removeEventListener("click", showListingsTab);
    myListingsTab.addEventListener("click", showListingsTab);
  }

  if (myBidsTab) {
    myBidsTab.removeEventListener("click", showBidsTab);
    myBidsTab.addEventListener("click", showBidsTab);
  }

  profileButtonsInitialized = true; // ✅ Stops infinite calls
  console.log("✅ Profile buttons initialized!");
}

// ✅ Define event handlers separately
function handleUpdateAvatar() {
  console.log("🖼️ Update Avatar Clicked");
  const avatarInput = document.getElementById("avatar-url-input").value.trim();
  if (!avatarInput) {
    alert("Please enter a valid avatar URL!");
    return;
  }
  new Avatar(
    document.getElementById("avatar-img"),
    document.getElementById("avatar-url-input"),
    document.getElementById("update-avatar-btn")
  ).updateAvatar();
}

function toggleEditProfile() {
  console.log("✏️ Edit Profile Clicked");
  document.getElementById("edit-profile-container").classList.toggle("hidden");
}

function saveProfileChanges() {
  console.log("💾 Save Profile Clicked - Updating profile...");
  if (typeof avatarInstance !== "undefined" && avatarInstance) {
    avatarInstance.saveProfileChanges();
  } else {
    console.error("❌ avatarInstance is not defined yet!");
  }
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














