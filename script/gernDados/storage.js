import { state, userLogado } from './state.js';

export function salvarNoStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

export function pegarDoStorage(chave) {
    return JSON.parse(localStorage.getItem(chave));
}

export function atualizarUsuario() {
    const usuarioAtualizado = {
        ...userLogado,
        saldo: state.salario,
        gastosTotais: state.gastosTotais,
        gastosArray: state.gastosArray,
        saldoArray: state.saldoArray
    };
    salvarNoStorage('usuarioLogado', usuarioAtualizado);

    let users = pegarDoStorage('users') || [];
    let index = users.findIndex(user => user.email === usuarioAtualizado.email);
    if (index !== -1) users[index] = usuarioAtualizado;
    salvarNoStorage('users', users);
}
