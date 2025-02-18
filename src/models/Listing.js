export class Listing {
  constructor(data) {
    this.id = data.id || "";
    this.title = data.title || "Untitled";
    this.description = data.description || "No description available.";
    this.price = data.price || 0;
    this.media = Array.isArray(data.media) ? data.media : []; // Ensure it's always an array
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.seller = data.seller || { userName: "Unknown" }; 
    this.endsAt = data.endsAt;
    this.createdAt = data.created || new Date().toISOString();
  }

  formatPrice() {
    return `${this.price} credits`;
  }

  getImage() {
    // Ensure media[0] exists and has a `url` property
    return this.media.length > 0 && this.media[0].url ? this.media[0].url : "/images/placeholder.jpg";
  }

  getDetails() {
    return `${this.title} - ${this.formatPrice()} by ${this.seller.userName}`;
  }
}


