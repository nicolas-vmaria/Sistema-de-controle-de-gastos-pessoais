const nomeIn = document.getElementById('nome')
const sobrenomeIn = document.getElementById('sobrenome')
const emailIn = document.getElementById('email')
const telIn = document.getElementById('tel')
const senhaIn = document.getElementById('senha')
const senhaConfirmIn = document.getElementById('senhaConfirm')

telIn.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    }

    e.target.value = value
})

let toastTimer = null

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

function cadastrar(e){
    e.preventDefault()

    if (senhaIn.value !== senhaConfirmIn.value) {
        showToast('As senhas não coincidem.', 'error')
        return
    }

    const newUser = {
        nome: nomeIn.value,
        sobrenome: sobrenomeIn.value,
        email: emailIn.value,
        telefone: telIn.value,
        senha: senhaIn.value
    }

    localStorage.setItem('user', JSON.stringify(newUser))
    showToast('Conta criada com sucesso!', 'success')

    window.location.href = '../pages/gerenciamentoDados.html'
}

