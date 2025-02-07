export function setupListingButtons() {
  console.log("🔍 Setting up item buttons...");
  document.querySelectorAll(".view-item").forEach((btn, index) => {
    console.log(`🛒 Button ${index + 1}:`, btn);

    btn.addEventListener("click", (event) => {
      event.preventDefault(); 
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






