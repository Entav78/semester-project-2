import Listing from "@/models/listing.js";

export async function fetchListings() {
  try {
    const response = await fetch("YOUR_API_ENDPOINT");
    const data = await response.json();
    return data.map((item) => new Listing(item)); 
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    return [];
  }
}
