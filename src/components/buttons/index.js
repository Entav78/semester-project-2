export function setupListingButtons() {
  document.querySelectorAll(".view-item").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault(); // ✅ Prevent default behavior

      const itemId = btn.dataset.id;
      if (!itemId) {
        console.error("❌ No item ID found on button.");
        return;
      }

      console.log(`🛒 Navigating to Item Page: /src/pages/item/item.html?id=${itemId}`);

      // ✅ Redirect to the correct `item.html` page
      window.location.href = `/src/pages/item/item.html?id=${itemId}`;
    });
  });
}






