// API Base URL
const API_BASE = "https://v2.api.noroff.dev/auction";
const API_LISTINGS = `${API_BASE}/listings`;
import Listing from "../../models/Listing.js";

// Fetch all active listings and return them as Listing objects
//import Listing from '../models/Listing.js';

export async function fetchListings() {
  console.log("🔍 Fetching Listings...");
  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/auction/listings?_active=true",
    );
    if (!response.ok) throw new Error("Failed to fetch listings");

    const { data } = await response.json();
    console.log("✅ Listings Fetched:", data);

    return data.map((listingData) => new Listing(listingData));
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return [];
  }
}
