export function showLoader(container) {
  if (!container) return;

  // Prevent duplicate loaders
  if (container.querySelector(".loader")) return;

  const loader = document.createElement("div");
  loader.className = "loader text-center text-gray-500 mt-4";

  const spinner = document.createElement("div");
  spinner.className = "animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500 mx-auto";

  const text = document.createElement("p");
  text.textContent = "Loading...";

  loader.appendChild(spinner);
  loader.appendChild(text);
  container.appendChild(loader);
}

export function hideLoader(container) {
  if (!container) return;
  const loader = container.querySelector(".loader");
  if (loader) loader.remove();
}

