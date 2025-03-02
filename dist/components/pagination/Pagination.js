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
    if (totalPages <= 1) return; // No pagination if only one page

    const paginationButtons = [];

    // Previous Button
    if (currentPage > 1) {
      const prevButton = this.createButton("« Prev", () => this.onPageChange(currentPage - 1));
      paginationButtons.push(prevButton);
    }

    // Page Numbers (Dynamically Displayed)
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
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

    // ✅ Ensure the buttons are inside a flex container
    const paginationWrapper = document.createElement("div");
    paginationWrapper.classList.add(
      "flex", "justify-center", "gap-2", "mt-4", "p-2", "border-t", "border-gray-300"
    );
    
    paginationButtons.forEach((btn) => paginationWrapper.appendChild(btn));
    this.container.appendChild(paginationWrapper);

    console.log("✅ Pagination rendered on home page!");
}



  createButton(text, onClick, isActive = false) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(
      "px-4", "py-2", "mx-1", "rounded", "transition",
      "bg-red-300", "text-black", "hover:bg-gray-400"
    );
    
    if (isActive) {
      button.classList.add("bg-red-500", "text-white", "font-bold");
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

// Ensure global access to Pagination
window.Pagination = Pagination;


