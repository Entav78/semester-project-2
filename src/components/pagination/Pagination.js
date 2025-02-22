export class Pagination {
  constructor(container, itemsPerPage, totalItems, onPageChange) {
    this.container = container;
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.onPageChange = onPageChange;
  }

  update(currentPage, totalItems = this.totalItems) {
    this.totalItems = totalItems;
    this.render(currentPage);
  }

  render(currentPage) {
    this.container.innerHTML = "";

    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (totalPages <= 1) return; // No pagination needed if only one page

    const paginationButtons = [];

    // Previous Button
    if (currentPage > 1) {
      const prevButton = this.createButton("« Prev", () => this.onPageChange(currentPage - 1));
      paginationButtons.push(prevButton);
    }

    // Dynamic Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const pageButton = this.createButton(i, () => this.onPageChange(i), currentPage === i);
        paginationButtons.push(pageButton);
      } else if (i === 2 || i === totalPages - 1) {
        paginationButtons.push(this.createEllipsis());
      }
    }

    // Next Button
    if (currentPage < totalPages) {
      const nextButton = this.createButton("Next »", () => this.onPageChange(currentPage + 1));
      paginationButtons.push(nextButton);
    }

    paginationButtons.forEach((btn) => this.container.appendChild(btn));
  }

  createButton(text, onClick, isActive = false) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("px-4", "py-2", "mx-1", "rounded", "transition");
    if (isActive) {
      button.classList.add("bg-blue-500", "text-white", "font-bold");
    } else {
      button.classList.add("bg-gray-300", "text-black", "hover:bg-gray-400");
    }
    button.addEventListener("click", onClick);
    return button;
  }

  createEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.classList.add("px-2", "py-2", "mx-1", "text-gray-500");
    return ellipsis;
  }
}


// 🏆 Ensure `Pagination.render` is available globally
window.Pagination = Pagination;

