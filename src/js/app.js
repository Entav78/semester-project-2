import { fetchListings } from './api/listings.js';

async function displayListings() {
  const container = document.getElementById('listings-container');
  const listings = await fetchListings();

  // Render each listing
  if (listings.length > 0) {
    container.innerHTML = listings.map((listing) => listing.render()).join('');
  } else {
    container.innerHTML = '<p>No listings available.</p>';
  }
}

// Initialize the app
displayListings();
