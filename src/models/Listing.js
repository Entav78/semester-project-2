export default class Listing {
  constructor(data) {
    this.id = data.id || "";
    this.title = data.title || "Untitled";
    this.description = data.description || "No description available.";
    this.price = data.price || 0;
    this.media = data.media || []; 
    this.seller = data.seller || { name: "Unknown" }; 
    this.createdAt = data.created || new Date().toISOString();
  }

  formatPrice() {
    return `${this.price} credits`;
  }

  getImage() {
    return this.media.length > 0 ? this.media[0] : "/images/placeholder.jpg";
  }

  getDetails() {
    return `${this.title} - ${this.formatPrice()} by ${this.seller.name}`;
  }
}

