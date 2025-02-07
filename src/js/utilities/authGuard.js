import { getToken } from "./storage.js"; // A utility to fetch the user token

export function authGuard(redirectPath = "/") {
  const token = getToken();
  if (!token) {
    alert("You must log in to access this page.");
    window.location.href = redirectPath; // Redirect to the login page
    return false;
  }
  return true;
}
