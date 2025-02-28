import { API_LISTINGS } from "./../js/api/constants.js";
import { API_KEY } from "./../js/api/constants.js";

export class Bidding {
  constructor(listingId, buttonElement, inputElement) {
    this.listingId = listingId;
    this.buttonElement = buttonElement;
    this.inputElement = inputElement; // Store reference to the input field

    if (!this.buttonElement) {
      console.error("No bid button found! Check the item page.");
      return;
    }

    if (!this.inputElement) {
      console.error("No bid input field found! Check the item page.");
      return;
    }

    console.log("Bidding initialized for:", listingId);
    this.buttonElement.addEventListener("click", () => this.placeBid());
  }

  async placeBid() {
    console.log(`Placing bid on ${this.listingId}`);

    const bidAmount = this.inputElement.value.trim(); // Get input value

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert("Please enter a valid bid amount!");
      return;
    }

    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_LISTINGS}/${this.listingId}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.trim()}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });

      if (!response.ok) throw new Error("Failed to place bid");

      console.log("Bid placed successfully!");
      alert("Your bid has been placed!");
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Try again.");
    }
  }
}

