export class Navigation {
  constructor() {
    console.log('🔍 Checking if navigation elements exist...');

    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.getElementById('overlay');
    this.openSidebar = document.getElementById('openSidebar');
    this.closeSidebar = document.getElementById('closeSidebar');

    if (
      !this.sidebar ||
      !this.overlay ||
      !this.openSidebar ||
      !this.closeSidebar
    ) {
      console.error('❌ Navigation elements not found in DOM.');
      return; // Stop execution if elements are missing
    }

    console.log('✅ Navigation elements found, adding event listeners...');

    this.openSidebar.addEventListener('click', () => this.openNav());
    this.closeSidebar.addEventListener('click', () => this.closeNav());
    this.overlay.addEventListener('click', () => this.closeNav());
  }

  openNav() {
    this.sidebar.classList.remove('translate-x-full');
    this.sidebar.classList.add('scale-100');
    this.overlay.classList.remove('hidden');
    this.overlay.classList.add('opacity-100');
    this.openSidebar.classList.add('hidden');
  }

  closeNav() {
    this.sidebar.classList.add('translate-x-full');
    this.sidebar.classList.remove('scale-100');
    this.overlay.classList.add('hidden');
    this.overlay.classList.remove('opacity-100');
    this.openSidebar.classList.remove('hidden');
  }
}
