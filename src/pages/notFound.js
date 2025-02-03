export default function notFoundPage() {
  document.getElementById("app").innerHTML = `
    <div class="text-center p-6">
      <h1 class="text-4xl text-red-500 font-bold">404 - Page Not Found</h1>
      <p class="text-gray-600 mt-2">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" class="text-blue-500 underline mt-4 inline-block">Go back home</a>
    </div>
  `;
}
