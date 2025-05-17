// ====== Firebase Imports ======
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getFirestore,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// ====== Firebase Configuração ======
const firebaseConfig = {
  apiKey: "AIzaSyD7Mb7Vc4ozoLdqi8o0g9nKCfiAMvsTjZY",
  authDomain: "wall-design-641ff.firebaseapp.com",
  projectId: "wall-design-641ff",
  storageBucket: "wall-design-641ff.appspot.com",
  messagingSenderId: "31839317940",
  appId: "1:31839317940:web:7fb80ae6aee935c3848ce1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

let projetosPorCategoria = {};

// ====== Listar projetos do Firebase ======
async function listarProjetos() {
  const lista = document.getElementById("listaProjetos");
  if (!lista) return;

  lista.innerHTML = "Carregando...";

  const snap = await getDocs(collection(db, "projetos"));
  projetosPorCategoria = {};

  snap.forEach((docItem) => {
    const data = docItem.data();
    const categoria = data.categoria || "Outros";

    if (!projetosPorCategoria[categoria]) projetosPorCategoria[categoria] = [];
    projetosPorCategoria[categoria].push(data);
  });

  filtrarCategoria("all");
}

// ====== Filtro por categoria ======
window.filtrarCategoria = function (cat, btn = null) {
  const lista = document.getElementById("listaProjetos");
  lista.innerHTML = "";

  document.querySelectorAll("#filtroCategoria button").forEach(b => b.classList.remove("ativo"));
  if (btn) btn.classList.add("ativo");

  const categorias = cat === "all" ? Object.keys(projetosPorCategoria) : [cat];

  categorias.forEach(categoria => {
    const projetos = projetosPorCategoria[categoria] || [];
    projetos.forEach(proj => {
      const card = document.createElement("div");
      card.className = "card-projeto";
      card.innerHTML = `
        <h3>${proj.nome}</h3>
        ${proj.imagens?.map(img => `
          <a href="${img}" class="lightbox" data-lightbox="galeria-${proj.nome}">
            <img src="${img}" alt="${proj.nome}">
          </a>
        `).join("")}
        <p>${proj.descricao}</p>
      `;
      lista.appendChild(card);
    });
  });

  if (lista.innerHTML.trim() === "") {
    lista.innerHTML = "<p style='text-align:center;'>Nenhum projeto encontrado.</p>";
  }

  iniciarLightbox();
};

// ====== Filtro por texto ======
window.aplicarFiltroTexto = function (texto) {
  const lista = document.getElementById("listaProjetos");
  lista.innerHTML = "";

  const termo = texto.toLowerCase().trim();
  const categorias = Object.keys(projetosPorCategoria);

  categorias.forEach(categoria => {
    const projetos = projetosPorCategoria[categoria].filter(p => p.nome.toLowerCase().includes(termo));
    projetos.forEach(proj => {
      const card = document.createElement("div");
      card.className = "card-projeto";
      card.innerHTML = `
        <h3>${proj.nome}</h3>
        ${proj.imagens?.map(img => `
          <a href="${img}" class="lightbox" data-lightbox="galeria-${proj.nome}">
            <img src="${img}" alt="${proj.nome}">
          </a>
        `).join("")}
        <p>${proj.descricao}</p>
      `;
      lista.appendChild(card);
    });
  });

  if (lista.innerHTML.trim() === "") {
    lista.innerHTML = "<p style='text-align:center;'>Nenhum projeto encontrado com esse nome.</p>";
  }

  iniciarLightbox();
};


  // Fechar dropdown ao clicar fora
  document.addEventListener("click", (event) => {
    const avatarWrapper = document.getElementById("avatarWrapper");
    const dropdown = document.getElementById("userDropdown");

    if (avatarWrapper && dropdown && !avatarWrapper.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });

  // ======= MENU RESPONSIVO =======
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (toggle && nav) {
  toggle.addEventListener("click", function () {
    nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
  });
}
// ====== Fim do código ======