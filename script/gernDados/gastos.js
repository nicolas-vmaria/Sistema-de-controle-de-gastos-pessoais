import { state } from './state.js';
import { atualizarUsuario } from './storage.js';
import { limparModal2 } from './modals.js';
import { renderSaldoEGastos, encerrarEdicao } from './transacoes.js';
import { showToast, showConfirm } from '../toast.js';

const gastosButton = document.getElementById('btnGasto');
const inputGastos = document.getElementById('gastosInput');
const nomeGastos = document.getElementById('nomeGasto');
const saldoElement = document.getElementById('saldo');
const gastosTotaisElement = document.getElementById('gastos-totais');

async function adicionarGastos() {
    const newGastos = parseFloat(inputGastos.value);
    const dataGastos = document.getElementById('dataGastos').value;
    const dataAtual = new Date().toISOString().split('T')[0];
    const saldofuturo = state.salario - newGastos;
    const categoriaGastos = document.getElementById('categoriaGastos').value;

    if (nomeGastos.value === '') {
        showToast('Digite um nome para o gasto.', 'error');
        return;
    } else if (inputGastos.value === '') {
        showToast('Digite uma quantia para adicionar aos gastos.', 'error');
        return;
    } else if (isNaN(newGastos)) {
        showToast('Digite um número válido para os gastos.', 'error');
        return;
    } else if (dataGastos === '') {
        showToast('Selecione uma data para o gasto.', 'error');
        return;
    } else if (dataGastos > dataAtual) {
        showToast('A data do gasto não pode ser no futuro.', 'error');
        return;
    } else if (categoriaGastos === 'Selecione uma opção' || categoriaGastos === '') {
        showToast('Selecione uma categoria para o gasto.', 'error');
        return;
    }

    if (saldofuturo <= 0) {
        const resposta = await showConfirm('Atenção: Seus gastos excederam seu salário! Deseja continuar adicionando esse gasto?');
        if (resposta) {
            state.salario -= newGastos;
            state.gastosTotais += newGastos;
            showToast('Seu saldo está negativo! Considere revisar seus gastos.', 'error');
        } else {
            showToast('Gasto não adicionado.', 'error');
            document.getElementById('modal-2').close();
            limparModal2();
            return;
        }
    } else {
        showToast('Gasto adicionado com sucesso!', 'success');
        state.salario -= newGastos;
        state.gastosTotais += newGastos;
    }

    state.gastosArray.push({
        nome: nomeGastos.value,
        valor: newGastos,
        data: dataGastos,
        categoria: categoriaGastos
    });

    document.getElementById('modal-2').close();
    limparModal2();
    atualizarUsuario();
    renderSaldoEGastos();
    import('./grafico.js').then(({ atualizarGrafico }) => atualizarGrafico());

    saldoElement.textContent = state.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    gastosTotaisElement.textContent = state.gastosTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function salvarEdicaoGasto() {
    const novoNome = nomeGastos.value.trim();
    const novoValor = parseFloat(inputGastos.value);
    const novaData = document.getElementById('dataGastos').value;
    const novaCategoria = document.getElementById('categoriaGastos').value;
    const dataAtual = new Date().toISOString().split('T')[0];

    if (!novoNome || isNaN(novoValor) || !novaData || novaCategoria === 'Selecione uma opção') {
        showToast('Preencha todos os campos.', 'error');
        return;
    }
    if (novaData > dataAtual) {
        showToast('A data do gasto não pode ser no futuro.', 'error');
        return;
    }
    if (novoValor <= 0) {
        showToast('O valor do gasto deve ser maior que zero.', 'error');
        return;
    }

    const valorAntigo = state.gastosArray[state.editandoIndex].valor;
    state.salario += valorAntigo;
    state.salario -= novoValor;
    state.gastosTotais -= valorAntigo;
    state.gastosTotais += novoValor;

    state.gastosArray[state.editandoIndex] = {
        nome: novoNome,
        valor: novoValor,
        data: novaData,
        categoria: novaCategoria
    };

    encerrarEdicao();
}

export function initGastos() {
    gastosButton.addEventListener('click', () => {
        if (state.editandoIndex !== null && state.editandoTipo === 'gasto') {
            salvarEdicaoGasto();
        } else {
            adicionarGastos();
        }
    });
}
