import { Register } from "@/js/api/register.js";

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const registerInstance = new Register();
  registerForm.addEventListener("submit", (event) => registerInstance.handleRegister(event));
}
