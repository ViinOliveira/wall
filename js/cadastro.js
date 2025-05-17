import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient('https://SEU-PROJECT.supabase.co', 'PUBLIC-ANON-KEY')

const form = document.getElementById("formCadastro")
const msg = document.getElementById("mensagemCadastro")

form.addEventListener("submit", async function (e) {
  e.preventDefault()

  const nome = document.getElementById("nome").value.trim()
  const email = document.getElementById("email").value.trim()
  const senha = document.getElementById("senha").value.trim()

  msg.classList.add("escondido")

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome: nome }
    }
  })

  if (error) {
    msg.textContent = "Erro: " + error.message
    msg.classList.remove("escondido")
    msg.style.color = "#ff5e5e"
  } else {
    msg.textContent = "Cadastro realizado com sucesso! Verifique seu e-mail."
    msg.classList.remove("escondido")
    msg.style.color = "#25d366"
    form.reset()
  }
})