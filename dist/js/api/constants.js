export let API_KEY = "";

fetch("/config.json")
  .then(response => response.json())
  .then(config => {
    API_KEY = config.API_KEY;
    console.log("✅ API Key Loaded:", API_KEY);
  })
  .catch(error => console.error("❌ Failed to load API Key:", error));

export const API_BASE = "https://v2.api.noroff.dev";


export const basePath =
window.location.hostname === "localhost" ? "" : "/semester-project-2/dist/";
console.log("✅ basePath is:", basePath);

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


