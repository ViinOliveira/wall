// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Sua configuração Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyD7Mb7Vc4ozoLdqi8o0g9nKCfiAMvsTjZY",
  authDomain: "wall-design-641ff.firebaseapp.com",
  projectId: "wall-design-641ff",
  storageBucket: "wall-design-641ff.appspot.com",
  messagingSenderId: "31839317940",
  appId: "1:31839317940:web:7fb80ae6aee935c3848ce1",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('formRecuperarSenha').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('recuperarEmail').value.trim();
  const msg = document.getElementById('recuperarMsg');
  msg.classList.remove('ativo', 'active');
  msg.classList.add('escondido');
  msg.style.color = "#ff7272";

  if (!email) return;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      msg.textContent = "E-mail enviado! Confira sua caixa de entrada (e SPAM).";
      msg.style.color = "#49d772";
      msg.classList.add('ativo');
      msg.classList.remove('escondido');
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        msg.textContent = "Usuário não encontrado.";
      } else if (error.code === 'auth/invalid-email') {
        msg.textContent = "E-mail inválido.";
      } else {
        msg.textContent = "Erro ao enviar e-mail. Tente novamente.";
      }
      msg.style.color = "#ff7272";
      msg.classList.add('ativo');
      msg.classList.remove('escondido');
    });
});
