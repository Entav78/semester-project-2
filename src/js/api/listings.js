import { API_LISTINGS } from "./constants.js";
import { Listing } from "../../models/Listing.js";

console.log("🔍 API_LISTINGS URL:", API_LISTINGS); // ✅ Check if correct URL is used

export async function fetchListings() {
  console.log("🔍 Fetching Listings from:", API_LISTINGS); // ✅ Logs correct API URL

  try {
    const response = await fetch(`${API_LISTINGS}?_active=true`);
    if (!response.ok) throw new Error("Failed to fetch listings");

    const json = await response.json();
    console.log("📊 Full API Response:", json); // ✅ Log full response

    const { data } = json;
    console.log("✅ Listings Fetched:", data);

    return data.map((listingData) => new Listing(listingData)); // ✅ Ensure correct format
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return [];
  }
}


