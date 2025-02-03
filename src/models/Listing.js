export default class Listing {
  constructor(data) {
    this.id = data.id || "";
    this.title = data.title || "Untitled";
    this.description = data.description || "No description available.";
    this.price = data.price || 0;
    this.media = data.media || []; // Store images
    this.seller = data.seller || { name: "Unknown" }; // Seller info
    this.createdAt = data.created || new Date().toISOString();
  }

  // Format price (assuming "credits" as currency)
  formatPrice() {
    return `${this.price} credits`;
  }

  // Get the first image or a default placeholder
  getImage() {
    return this.media.length > 0 ? this.media[0] : "/images/placeholder.jpg";
  }

  // Example method to display listing details
  getDetails() {
    return `${this.title} - ${this.formatPrice()} by ${this.seller.name}`;
  }
}
