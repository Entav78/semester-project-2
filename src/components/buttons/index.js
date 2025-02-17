
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

