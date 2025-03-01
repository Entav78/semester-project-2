export const API_KEY = "b1daef81-f82b-4fa8-888b-135fdb584411"; 
console.log("API Key Loaded:", API_KEY); // Remove before deployment!


//export { API_KEY };
export const basePath =
  window.location.hostname.includes("127.0.0.1") || window.location.hostname.includes("localhost")
    ? "" // LOCAL: Use root "/"
    : "/semester-project-2"; // GITHUB: Use "/semester-project-2"


export const API_BASE = "https://v2.api.noroff.dev";

// Auction Endpoints
export const API_AUCTION = `${API_BASE}/auction`;
export const API_LISTINGS = `${API_AUCTION}/listings`;
export const API_BIDS = `${API_LISTINGS}/<id>/bids`; // Replace <id> dynamically
export const API_SEARCH = `${API_LISTINGS}/search?q=`;

// Profile Endpoints
export const API_PROFILES = `${API_BASE}/auction/profiles`;

export const getUserListings = (userName) => `${API_PROFILES}/${userName}/listings`;
export const getUserBids = (userName) => `${API_PROFILES}/${userName}/bids`;


// Authentication Endpoints
export const API_AUTH = `${API_BASE}/auth`;
export const API_REGISTER = `${API_AUTH}/register`;
export const API_LOGIN = `${API_AUTH}/login`;

// Helper functions for building dynamic URLs
export const getListingById = (id, seller = false, bids = false) =>
  `${API_LISTINGS}/${id}?_seller=${seller}&_bids=${bids}`;

console.log("API Key Loaded:", API_KEY); // REMOVE BEFORE DELIVERY!
