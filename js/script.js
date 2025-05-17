document.addEventListener("DOMContentLoaded", function () {
  // ======= HERO SLIDESHOW =======
  const images = [
    'img/slide1.jpg',
    'img/slide2.jpg',
    'img/slide3.jpg'
  ];
  let current = 0;
  const bg = document.querySelector('.hero-background');
  const leftArrow = document.querySelector('.hero-arrow-left');
  const rightArrow = document.querySelector('.hero-arrow-right');
  let intervalId;

  function setHeroBackground(idx) {
    if (bg) {
      // Adiciona uma opacidade 0 para fazer fade suave
      bg.style.opacity = 0;
      setTimeout(() => {
        bg.style.backgroundImage =
          `linear-gradient(rgba(15,46,32,0.7), rgba(15,46,32,0.7)), url('${images[idx]}')`;
        bg.style.opacity = 1;
      }, 150); // Pequeno delay para dar fade bonito
    }
  }

  function nextSlide() {
    current = (current + 1) % images.length;
    setHeroBackground(current);
    resetInterval();
  }
  function prevSlide() {
    current = (current - 1 + images.length) % images.length;
    setHeroBackground(current);
    resetInterval();
  }

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', prevSlide);
    rightArrow.addEventListener('click', nextSlide);
  }

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 6000);
  }

  // INICIALIZAÇÃO
  if (bg) {
    setHeroBackground(current);
    resetInterval();
  }

  // ======= MENU RESPONSIVO =======
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("show");
      toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
    });
  }

  // ======= TROCA DE IDIOMA (BANDEIRAS) =======
  window.trocarIdioma = function(lang) {
    if (lang === "en") {
      location.href = "index-en.html";
    } else {
      location.href = "index.html";
    }
  };

  // ======= AVATAR/LOGIN (simples, exemplo para você integrar o Firebase depois) =======
  const loginMenu = document.getElementById("loginMenu");
  const avatarMenu = document.getElementById("avatarMenu");
  const userAvatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("dropdownAvatar");
  const btnLogout = document.getElementById("btnLogout");

  if (userAvatar && dropdown) {
    userAvatar.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", function(event) {
      if (dropdown && dropdown.style.display === "block" && !avatarMenu.contains(event.target)) {
        dropdown.style.display = "none";
      }
    });
  }
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      loginMenu.style.display = "block";
      avatarMenu.style.display = "none";
      dropdown.style.display = "none";
    });
  }
});
