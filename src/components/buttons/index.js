
import { basePath } from "@/js/api/constants.js";
import { router } from "@/pages/router/router.js"; // Import the router

export function setupListingButtons() {
  document.querySelectorAll(".view-item").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const itemId = btn.dataset.id;
      console.log("Extracted Item ID:", itemId);
      if (!itemId) {
        console.error("No item ID found on button.");
        return;
      }

      const itemPagePath = `/item?id=${itemId}`; // Use clean route
      console.log(`Navigating to Item Page: ${itemPagePath}`);
      


      // Use `router()` instead of reloading the page
      window.history.pushState({}, "", itemPagePath);
      router(itemPagePath); // Call the router to handle navigation
    });
  });
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
  editButton.textContent = "Edit";
  editButton.classList.add(
    "edit-listing",
    "bg-yellow-500",
    "text-white",
    "px-4",
    "py-2",
    "rounded",
    "hover:bg-yellow-600"
  );
  editButton.addEventListener("click", () => onEdit(listing));

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
