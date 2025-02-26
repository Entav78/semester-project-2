import { API_KEY } from "@/js/api/constants.js";
import { getUserListings, getUserBids } from "@/js/api/constants.js";


// Get user details from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const authToken = localStorage.getItem("authToken");

// Fetch user listings
export async function fetchUserListings(userName) {
  // ✅ Ensure username is valid before making the API call
  if (!userName) {
    console.error("Cannot fetch listings. Username is missing.");
    return null;
  }

  // Get the authToken inside the function to avoid undefined reference issues
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error(" No auth token available.");
    throw new Error("Unauthorized: No token provided.");
  }

  console.log(`📡 Fetching listings for user: ${userName}`);

  try {
    const response = await fetch(getUserListings(userName), {
      headers: {
        "Authorization": `Bearer ${authToken.trim()}`, // Trim to avoid accidental spaces
        "X-Noroff-API-Key": API_KEY, 
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching listings:`, errorData);
      throw new Error(errorData.errors?.[0]?.message || `Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Listings fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch listings:", error.message);
    return null;
  }
}


// 🛠️ Fetch user bids
export async function fetchUserBids(userName) {
  // ✅ Ensure authToken is retrieved inside function
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token available.");
    throw new Error("Unauthorized: No token provided.");
  }

  try {
    const response = await fetch(getUserBids(userName), {
      headers: {
        "Authorization": `Bearer ${authToken}`, // Bearer token
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching bids:`, errorData);
      throw new Error(errorData.errors?.[0]?.message || `Failed to fetch bids: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("📡 Full Bids Data:", responseData); // ✅ Debugging

    return responseData.data; // ✅ Extract and return only the bids array
  } catch (error) {
    console.error("Failed to fetch bids:", error.message);
    return null;
  }
}








