import { Navigation } from './navigation.js';
import { fetchListings } from './api/listings.js';
import '../styles/main.scss';
//import '../styles/test.css';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM Loaded - Initializing Navigation and Listings');

  // Initialize Navigation
  new Navigation();

  // Ensure listings-container exists before rendering listings
  const container = document.getElementById('listings-container');
  if (!container) {
    console.error("❌ Error: 'listings-container' not found in the HTML.");
    return;
  }

  try {
    console.log('🔍 Fetching Listings...');
    const listings = await fetchListings();

    if (listings.length > 0) {
      container.innerHTML = listings
        .map((listing) => `<div class="border p-4">${listing.title}</div>`)
        .join('');
      console.log('✅ Listings successfully rendered.');
    } else {
      container.innerHTML = '<p>No listings available.</p>';
    }
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
  }
});
