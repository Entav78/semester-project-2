export default class Listing {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || 'Untitled';
    this.description = data.description || 'No description';
    this.price = data.price || 0;
  }
}
