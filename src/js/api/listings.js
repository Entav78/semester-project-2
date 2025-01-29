// API Base URL
const API_BASE = 'https://v2.api.noroff.dev/auction';
const API_LISTINGS = `${API_BASE}/listings`;

// Fetch all active listings and return them as Listing objects
import Listing from '../models/Listing.js';

export async function fetchListings() {
  try {
    const response = await fetch(`${API_LISTINGS}?_active=true`);
    if (!response.ok) throw new Error('Failed to fetch listings');

    const { data } = await response.json();

    // Convert API data into Listing objects
    return data.map((listingData) => new Listing(listingData));
  } catch (error) {
    console.error(error);
    return [];
  }
}
