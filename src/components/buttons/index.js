document.querySelectorAll(".view-item").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault(); // ✅ Prevent default behavior

    const itemId = btn.dataset.id;
    if (!itemId) {
      console.error("❌ No item ID found on button.");
      return;
    }

    console.log(`🛒 Navigating to Item Page: /pages/item/item.html?id=${itemId}`);

    // ✅ Redirect to the correct new page
    window.location.href = `/pages/item/item.html?id=${itemId}`;
  });
});





