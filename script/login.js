import { showToast } from "./toast.js";
const email = document.getElementById("email")
const senha = document.getElementById("senha")
const form = document.getElementById("loginForm")
const buttonToggle = document.getElementById("buttonToggle")

function logar(e) {
    e.preventDefault()
    const users= JSON.parse(localStorage.getItem('users')) || [];
    const userValidado= users.find(user => user.email === email.value && user.senha === senha.value)

    if(userValidado){
        localStorage.setItem('usuarioLogado', JSON.stringify(userValidado));
        window.location.href = '../pages/gerenciamentoDados.html'
    }else{
        showToast('Email ou senha incorretos!','error')
    }

}

form.addEventListener('submit', logar)


function toggleSenha() {
      const input = document.getElementById('senha');
      const iconEye = document.getElementById('icon-eye');
      const iconEyeOff = document.getElementById('icon-eye-off');
      if (input.type === 'password') {
        input.type = 'text';
        iconEye.style.display = 'none';
        iconEyeOff.style.display = 'block';
      } else {
        input.type = 'password';
        iconEye.style.display = 'block';
        iconEyeOff.style.display = 'none';
      }
    }

buttonToggle.addEventListener('click', toggleSenha);