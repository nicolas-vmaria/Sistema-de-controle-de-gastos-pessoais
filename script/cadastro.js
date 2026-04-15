import { showToast } from './toast.js';
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


function cadastrar(e){
    e.preventDefault()

    const senha = senhaIn.value

    if (senha.length < 8) {
        showToast('A senha deve ter no mínimo 8 caracteres.', 'error')
        return
    }

    if (!/[A-Z]/.test(senha)) {
        showToast('A senha deve conter pelo menos uma letra maiúscula.', 'error')
        return
    }

    if (!/[0-9]/.test(senha)) {
        showToast('A senha deve conter pelo menos um número.', 'error')
        return
    }

    if (!/[^a-zA-Z0-9]/.test(senha)) {
        showToast('A senha deve conter pelo menos um caractere especial.', 'error')
        return
    }

    if (senha !== senhaConfirmIn.value) {
        showToast('As senhas não coincidem.', 'error')
        return
    }

    const newUser = {
        nome: nomeIn.value,
        sobrenome: sobrenomeIn.value,
        email: emailIn.value,
        telefone: telIn.value,
        senha: senhaIn.value,
        saldo: 0,
        gastosArray: [],
        gastosTotais: 0,
        saldoArray: [],
        combinedArray: []
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')

    if(users.some(user => user.email === newUser.email)) {
        showToast('Este email já está cadastrado.', 'error')
        return
    }

    if(users.some(user => user.telefone === newUser.telefone)) {
        showToast('Este telefone já está cadastrado.', 'error')
        return
    }

    users.push(newUser)

    localStorage.setItem('users', JSON.stringify(users))

    localStorage.setItem('usuarioLogado', JSON.stringify(newUser));

    showToast('Conta criada com sucesso!', 'success')

    window.location.href = '../pages/gerenciamentoDados.html'
}

document.getElementById('formCadastro').addEventListener('submit', cadastrar);
