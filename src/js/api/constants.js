// Use Postman, or JavaScript to get your API key = e87bb321-e9d6-4af1-97fb-1bc12fe26578
// In Workflow we will learn how to secure this information
/* constants form js2
export const API_KEY = import.meta.env.VITE_API_KEY || '';

export const API_BASE = 'https://v2.api.noroff.dev';

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_SOCIAL = `${API_BASE}/social`;

export const API_SOCIAL_POSTS = `${API_SOCIAL}/posts`;

export const API_SOCIAL_PROFILES = `${API_SOCIAL}/profiles`;
*/

export const basePath =
  window.location.hostname === "localhost" ? "" : "/semester-project-2";


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
