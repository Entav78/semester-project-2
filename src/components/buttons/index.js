export function setupListingButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-item");
    if (button) {
      const itemId = button.getAttribute("data-id");
      if (!itemId) {
        console.error("❌ Button is missing data-id!");
        return;
      }

      console.log(`🛒 Redirecting to Item: ${itemId}`);
      window.location.href = `/pages/item/?id=${itemId}`;
    }
  });
}


