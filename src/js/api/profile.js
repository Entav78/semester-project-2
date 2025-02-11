import { getUserListings, getUserBids } from "@/js/api/constants.js";

// 🔐 Get user details from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const authToken = localStorage.getItem("authToken");

// 🛠️ Fetch user listings
export async function fetchUserListings(userName) {
  if (!authToken) {
    console.error("❌ No auth token available.");
    throw new Error("Unauthorized: No token provided.");
  }

  try {
    const response = await fetch(getUserListings(userName), {
      headers: {
        "Authorization": `Bearer ${authToken}`, // ✅ Bearer token
        "X-Noroff-API-Key": apiKey, // ✅ API key
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error fetching listings:`, errorData);
      throw new Error(errorData.errors?.[0]?.message || `Failed to fetch listings: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("⚠️ Failed to fetch listings:", error.message);
    return null;
  }
}

// 🛠️ Fetch user bids
export async function fetchUserBids(userName) {
  if (!authToken) {
    console.error("❌ No auth token available.");
    throw new Error("Unauthorized: No token provided.");
  }

  try {
    const response = await fetch(getUserBids(userName), {
      headers: {
        "Authorization": `Bearer ${authToken}`, // ✅ Bearer token
        "X-Noroff-API-Key": apiKey, // ✅ API key
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error fetching bids:`, errorData);
      throw new Error(errorData.errors?.[0]?.message || `Failed to fetch bids: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("⚠️ Failed to fetch bids:", error.message);
    return null;
  }
}





