// ========== FIREBASE AUTH ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase Config (igual ao login.js)
const firebaseConfig = {
    apiKey: "AIzaSyCTdDi53_8JNyrSQ9NsexWrOVs45ptgCN8",
    authDomain: "wall-design-a25b7.firebaseapp.com",
    projectId: "wall-design-a25b7",
    storageBucket: "wall-design-a25b7.firebasestorage.app",
    messagingSenderId: "1090764609097",
    appId: "1:1090764609097:web:02cc09e1384121521c5198",
    measurementId: "G-SM6RR0009X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ======= ELEMENTOS =======
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');''
const userPhoto = document.getElementById('userPhoto');
const btnLogout = document.getElementById('btnLogout');
const sidebarLogout = document.getElementById('sidebarLogout');

// Sidebar avatar e nome
const sidebarAvatar = document.getElementById('sidebarAvatar');
const sidebarNome = document.getElementById('sidebarNome');

// Seções do painel
const sections = document.querySelectorAll('.section-page');
const sidebarLinks = document.querySelectorAll('#sidebarMenu li a');

// ======= AUTENTICAÇÃO E DADOS DO USUÁRIO =======
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Atualiza painel e sidebar
    const nome = user.displayName || "Usuário";
    userName.innerText = nome;
    userEmail.innerText = user.email;
    userPhoto.src = user.photoURL || "img/default-avatar.png";
    sidebarAvatar.src = user.photoURL || "img/default-avatar.png";
    sidebarNome.innerText = nome;

    // Controle Admin: se o e-mail do usuário é admin, mostra abas extras
    if (user.email && (user.email.endsWith("@adm.com") || user.email === "admin@wall.com")) {
      // Torna visíveis os itens de admin
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = "block");
    } else {
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = "none");
    }

  } else {
    // Deslogado: garante que redireciona pro login.html
    window.location.replace("login.html");
  }
});

// ======= LOGOUT =======
function logoutAndRedirect() {
  signOut(auth)
    .then(() => {
      window.location.replace("login.html");
    })
    .catch(() => alert("Erro ao sair da conta. Tente novamente."));
}

if (btnLogout) btnLogout.addEventListener('click', logoutAndRedirect);
if (sidebarLogout) sidebarLogout.addEventListener('click', function(e) {
  e.preventDefault();
  logoutAndRedirect();
});

// ======= MENU LATERAL: TROCA DE SEÇÃO (SPAs) =======
sidebarLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    // Remove active de todos
    document.querySelectorAll('#sidebarMenu li').forEach(li => li.classList.remove('active'));
    this.parentElement.classList.add('active');
    // Oculta todas as seções
    sections.forEach(sec => sec.classList.remove('active'));
    // Mostra a seção escolhida
    const sectionId = this.getAttribute('data-section');
    if (sectionId) {
      document.getElementById(sectionId).classList.add('active');
    }
  });
});

// ======= MENU MOBILE DO HEADER =======
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
if (menuToggle && menu) {
  menuToggle.addEventListener('click', function() {
    menu.classList.toggle('ativo');
    menuToggle.classList.toggle('ativo');
  });
  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
      menu.classList.remove('ativo');
      menuToggle.classList.remove('ativo');
    }
  });
}

// ======= TROCA DE IDIOMA HEADER =======
window.trocarIdioma = function(lang) {
  if (lang === "en") {
    location.href = "painel-en.html";
  } else {
    location.href = "painel.html";
  }
};
