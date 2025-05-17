// ========== TROCA DE IDIOMA ==========
window.trocarIdioma = function(lang) {
  if (lang === "en") {
    location.href = "login-en.html";
  } else {
    location.href = "login.html";
  }
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// ========== CONFIG FIREBASE ==========
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

// ========== ELEMENTOS ==========
const form = document.getElementById('formLogin');
const erroLogin = document.getElementById('erroLogin');
const btnLogin = document.querySelector('.btn-login');
const btnGoogle = document.getElementById('btnGoogle');
const btnApple = document.getElementById('btnApple');

// ========== BLOQUEAR SE JÁ ESTIVER LOGADO ==========
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("login.html")) {
    // Se já está logado e tentar abrir login.html, redireciona para painel
    window.location.href = "painel.html";
  }
});

// ========== LOGIN EMAIL/SENHA ==========
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    btnLogin.disabled = true;
    btnLogin.innerText = "Entrando...";

    const email = form.email.value.trim();
    const senha = form.senha.value;

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        // Redireciona após login
        window.location.href = "painel.html";
      })
      .catch((error) => {
        erroLogin.innerText = "E-mail ou senha incorretos.";
        erroLogin.classList.add('ativo', 'active');
        btnLogin.disabled = false;
        btnLogin.innerText = "Entrar";
      });
  });
}

// ========== LOGIN GOOGLE ==========
if (btnGoogle) {
  btnGoogle.addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        window.location.href = "painel.html";
      })
      .catch(error => {
        erroLogin.innerText = "Não foi possível fazer login com Google.";
        erroLogin.classList.add('ativo', 'active');
      });
  });
}

// ========== LOGIN APPLE ==========
if (btnApple) {
  btnApple.addEventListener('click', function() {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider)
      .then(result => {
        window.location.href = "painel.html";
      })
      .catch(error => {
        erroLogin.innerText = "Não foi possível fazer login com Apple.";
        erroLogin.classList.add('ativo', 'active');
      });
  });
}

// ========== LOGOUT UNIVERSAL ==========
const menuLogout = document.getElementById('menuLogout');
if (menuLogout) {
  menuLogout.addEventListener('click', function(e) {
    e.preventDefault();
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });
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
