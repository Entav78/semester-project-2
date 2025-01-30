import { fetchListings } from './api/listings.js';
import '../styles/main.css';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM Loaded - Running displayListings()');
  const container = document.getElementById('listings-container');
  if (!container) {
    console.error("❌ Error: 'listings-container' not found in the HTML.");
    return;
  }

  const listings = await fetchListings();
  if (listings.length > 0) {
    container.innerHTML = listings
      .map((listing) => `<div class="border p-4">${listing.title}</div>`)
      .join('');
  } else {
    container.innerHTML = '<p>No listings available.</p>';
  }
});
