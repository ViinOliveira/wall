// Firebase imports  
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

// Inicialização do Firebase

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
const auth = getAuth(app);
const storage = getStorage(app);

//Verificação de autenticação e admin

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDocs = await getDocs(collection(db, "users"));
  const isAdmin = userDocs.docs.some(docItem => docItem.id === user.uid && docItem.data().role === "admin");

  if (!isAdmin) {
    window.location.href = "projetos.html";
    return;
  }

  const avatarURL = user.photoURL || "img/default-avatar.png";
  const userImg = document.getElementById("userImg");
  const previewAvatar = document.getElementById("previewAvatar");

  if (userImg) userImg.src = avatarURL;
  if (previewAvatar) previewAvatar.src = avatarURL;
});

//Menu do Avatar e controle de navegação
const userToggle = document.getElementById("userImg");
const userDropdown = document.getElementById("userDropdown");
userToggle?.addEventListener("click", () => {
  userDropdown?.classList.toggle("show");
});

document.getElementById("logoutLink")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

const links = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.admin-section');
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(section => section.classList.remove('active'));
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.classList.add('active');
  });
});

//Pré-visualização do avatar ao selecionar arquivo

const avatarInput = document.getElementById("avatarInput");
const previewAvatar = document.getElementById("previewAvatar");

avatarInput?.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewAvatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

//Atualização de dados do usuário

document.getElementById("formPerfil")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  const novoEmail = document.getElementById("novoEmail").value.trim();
  const novaSenha = document.getElementById("novaSenha").value;
  const avatarFile = avatarInput?.files[0];
  let newAvatarURL = null;

  const senhaAtual = prompt("Confirme sua senha atual:");
  if (!senhaAtual) {
    alert("É necessário confirmar sua senha para atualizar o perfil.");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, senhaAtual);
    await reauthenticateWithCredential(user, credential);

    if (novoEmail && user.email !== novoEmail) {
      await updateEmail(user, novoEmail);
    }

    if (novaSenha && novaSenha.length >= 6) {
      await updatePassword(user, novaSenha);
    }

    if (avatarFile) {
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, avatarFile);
      newAvatarURL = await getDownloadURL(avatarRef);
      await updateProfile(user, { photoURL: newAvatarURL });
      if (userImg) userImg.src = newAvatarURL;
      if (previewAvatar) previewAvatar.src = newAvatarURL;
    }

    alert("Perfil atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    alert("Erro ao atualizar perfil: " + (err.message || err.code));
  }
});

// Envio de novo projeto com múltiplas imagens

const formProjeto = document.getElementById("formProjeto");

formProjeto?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nomeProjeto").value.trim();
  const descricao = document.getElementById("descricaoProjeto").value.trim();
  const categoria = document.getElementById("categoriaProjeto").value;
  const files = document.getElementById("imagemProjeto").files;

  if (!files.length || !categoria || !nome || !descricao) {
    alert("Preencha todos os campos e selecione ao menos uma imagem.");
    return;
  }

  try {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `projetos/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    await addDoc(collection(db, "projetos"), {
      nome,
      descricao,
      categoria,
      imagens: urls,
      criadoEm: serverTimestamp()
    });

    alert("Projeto enviado com sucesso!");
    formProjeto.reset();
    listarProjetos();
  } catch (err) {
    console.error("Erro ao enviar projeto:", err);
    alert("Erro ao enviar projeto.");
  }
});

// Listagem e exclusão de projetos (simples)

async function listarProjetos() {
  const lista = document.getElementById("listaProjetos");
  if (!lista) return;

  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "projetos"));
  snap.forEach((docItem) => {
    const data = docItem.data();
    const card = document.createElement("div");
    card.className = "card-projeto";
    card.innerHTML = `
      <h3>${data.nome}</h3>
      ${data.imagens.map(img => `<img src="${img}" onclick="abrirImagemModal('${img}')">`).join('')}
      <p>${data.descricao}</p>
      <button onclick="excluirProjeto('${docItem.id}')">Excluir</button>
    `;
    lista.appendChild(card);
  });
}

//Função para excluir projetos

async function excluirProjeto(id) {
  if (confirm("Deseja realmente excluir este projeto?")) {
    try {
      await deleteDoc(doc(db, "projetos", id));
      alert("Projeto excluído com sucesso!");
      listarProjetos();
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      alert("Erro ao excluir projeto.");
    }
  }
}

// Modal de imagem ampliada

function abrirImagemModal(url) {
  const modal = document.getElementById("modalImagem");
  const modalImg = document.getElementById("modalImg");
  modalImg.src = url;
  modal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", listarProjetos);

// Listagem por categoria 

listarProjetos();

//Upload com pré-visualização e limite

let imagensSelecionadas = [];

const imagemInput = document.getElementById("imagemProjeto");
const previewContainer = document.getElementById("previewContainer");
const uploadArea = document.getElementById("uploadArea");

uploadArea.addEventListener("click", () => imagemInput.click());

imagemInput.addEventListener("change", () => {
  const novosArquivos = Array.from(imagemInput.files);

  // Limita a 5 imagens
  if (imagensSelecionadas.length + novosArquivos.length > 5) {
    alert("Você pode enviar no máximo 5 imagens.");
    return;
  }

  novosArquivos.forEach(file => {
    if (file.type.startsWith("image/") && imagensSelecionadas.length < 5) {
      imagensSelecionadas.push(file);
      mostrarPreview(file);
    }
  });

  imagemInput.value = ""; // limpa para permitir reescolher a mesma
});

// Cadastro de novo administrador

// cadastro de novo usuário (administrador)
const formAdmin = document.getElementById("formAdmin");

formAdmin?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("novoAdminEmail").value.trim();
  const senha = prompt("Digite uma senha para o novo admin:");

  if (!senha || senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      email,
      role: "admin"
    });

    alert("Novo admin criado com sucesso!");
    formAdmin.reset();
  } catch (error) {
    console.error("Erro ao criar admin:", error.message);
    alert("Erro ao criar admin: " + error.message);
  }
});






