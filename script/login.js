const email = document.getElementById("email")
const senha = document.getElementById("senha")

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast')
    const toastMsg = document.getElementById('toast-msg')
    const toastIcon = document.getElementById('toast-icon')

    toastMsg.textContent = msg
    toastIcon.textContent = type === 'success' ? '✓' : '✕'
    toast.className = `toast ${type} show`

    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.classList.remove('show')
    }, 3000)
}

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