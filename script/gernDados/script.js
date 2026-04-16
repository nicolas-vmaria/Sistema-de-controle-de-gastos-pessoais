import { showToast } from '../toast.js';
import { state, userLogado } from './state.js';
import { popularCategorias, initModals } from './modals.js';
import { renderSaldoEGastos, initListaTransacoes } from './transacoes.js';
import { initGastos } from './gastos.js';
import { initReceitas } from './receitas.js';
import { initFiltro } from './filtro.js';
import { renderGrafico, getMesesDisponiveis, initGrafico } from './grafico.js';

function init() {
    if (!userLogado) {
        showToast('Nenhum usuário logado. Redirecionando para a página de login.', 'error');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('nameUser').textContent =
        userLogado.nome.toUpperCase().slice(0, 1) + userLogado.nome.toLowerCase().slice(1);

    state.salario = userLogado.saldo || 0;
    state.gastosTotais = userLogado.gastosTotais || 0;
    state.gastosArray = userLogado.gastosArray || [];
    state.saldoArray = userLogado.saldoArray || [];

    const meses = getMesesDisponiveis();
    if (meses.length > 0) {
        state.mesSelecionado = meses[meses.length - 1];
    }

    document.getElementById('saldo').textContent =
        state.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('gastos-totais').textContent =
        state.gastosTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    popularCategorias();
    initModals();
    initListaTransacoes();
    initGastos();
    initReceitas();
    initFiltro();
    initGrafico();

    renderSaldoEGastos();
    renderGrafico();
}

document.getElementById('sair-conta').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'home.html';
});

init();
