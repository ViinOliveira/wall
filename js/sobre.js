  // ======= MENU RESPONSIVO =======
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("show");
      toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
    });
  }