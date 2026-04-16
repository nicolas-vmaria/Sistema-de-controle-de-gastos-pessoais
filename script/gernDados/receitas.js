import { state } from './state.js';
import { atualizarUsuario } from './storage.js';
import { limparModal1 } from './modals.js';
import { renderSaldoEGastos, encerrarEdicao } from './transacoes.js';
import { showToast, showConfirm } from '../toast.js';

const btnSalario = document.getElementById('btnSalario');
const salarioInput = document.getElementById('valorSalario');
const receitaUserSelect = document.getElementById('receita-user');
const nomeReceitaInput = document.getElementById('nomeReceita');
const dataSaldoInput = document.getElementById('dataSaldo');
const saldoElement = document.getElementById('saldo');

async function adicionarSaldo(valor) {
    const resposta = await showConfirm('Deseja adicionar esse valor ao saldo?');
    if (resposta) {
        state.salario += valor;
        return true;
    } else {
        showToast('Valor não adicionado ao saldo.', 'error');
        return false;
    }
}

export function salvarEdicaoSaldo() {
    const novoNome = receitaUserSelect.value === 'salario' ? 'Salário' : nomeReceitaInput.value.trim();
    const novoValor = parseFloat(salarioInput.value);
    const novaData = dataSaldoInput.value;
    const dataAtual = new Date().toISOString().split('T')[0];

    if (!novoNome || isNaN(novoValor) || !novaData) {
        showToast('Preencha todos os campos.', 'error');
        return;
    }
    if (novaData > dataAtual) {
        showToast('A data do saldo não pode ser no futuro.', 'error');
        return;
    }
    if (novoValor <= 0) {
        showToast('O valor do saldo deve ser maior que zero.', 'error');
        return;
    }

    const valorAntigo = state.saldoArray[state.editandoIndex].valor;
    state.salario -= valorAntigo;
    state.salario += novoValor;

    state.saldoArray[state.editandoIndex] = {
        nome: novoNome,
        valor: novoValor,
        data: novaData
    };

    encerrarEdicao();
}

export function initReceitas() {
    receitaUserSelect.addEventListener('change', () => {
        const tipo = receitaUserSelect.value;
        if (tipo === '') {
            showToast('Selecione um tipo de receita para adicionar ao saldo.', 'error');
            return;
        } else if (tipo === 'salario') {
            salarioInput.placeholder = 'Digite o valor do salário';
            document.getElementById('outro-receita-group').style.display = 'none';
        } else if (tipo === 'outro') {
            document.getElementById('outro-receita-group').style.display = 'block';
            salarioInput.placeholder = 'Digite o valor da receita';
        }
    });

    btnSalario.addEventListener('click', async () => {
        if (state.editandoIndex !== null && state.editandoTipo === 'saldo') {
            salvarEdicaoSaldo();
            return;
        }

        const valor = parseFloat(salarioInput.value);
        const tipo = receitaUserSelect.value;
        const nomeReceita = nomeReceitaInput.value.trim();
        const dataSaldo = dataSaldoInput.value;
        const dataAtual = new Date().toISOString().split('T')[0];

        if (isNaN(valor)) {
            showToast('Por favor, insira um número válido.', 'error');
            return;
        } else if (valor <= 0) {
            showToast('Por favor, insira um valor maior que zero.', 'error');
            return;
        } else if (nomeReceitaInput.value === '' && receitaUserSelect.value === 'outro') {
            showToast('Digite um nome para a receita.', 'error');
            return;
        } else if (dataSaldoInput.value === '') {
            showToast('Selecione uma data para o saldo.', 'error');
            return;
        } else if (dataSaldo > dataAtual) {
            showToast('A data do saldo não pode ser no futuro.', 'error');
            return;
        }

        const sucesso = await adicionarSaldo(valor);
        if (sucesso) {
            showToast('Saldo atualizado com sucesso!', 'success');
            state.saldoArray.push({
                nome: tipo === 'salario' ? 'Salário' : nomeReceita,
                valor: valor,
                data: dataSaldo
            });

            document.getElementById('modal-1').close();
            limparModal1();
            atualizarUsuario();
            renderSaldoEGastos();
            import('./grafico.js').then(({ atualizarGrafico }) => atualizarGrafico());

            saldoElement.textContent = state.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    });
}
