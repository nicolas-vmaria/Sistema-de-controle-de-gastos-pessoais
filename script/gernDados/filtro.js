import { state } from './state.js';
import { limparModal3 } from './modals.js';
import { renderSaldoEGastos } from './transacoes.js';
import { showToast } from '../toast.js';

function mostrarFiltro() {
    const tipoTransacao = document.getElementById('tipoTransacao').value;
    const tipoFiltro = document.getElementById('tipofiltro').value;

    document.getElementById('filtro-group').style.display = 'none';
    document.getElementById('filtro-categoria').style.display = 'none';
    document.getElementById('filtro-data').style.display = 'none';
    document.getElementById('filtro-valor').style.display = 'none';

    if (tipoTransacao === 'gasto') {
        document.getElementById('filtro-group').style.display = 'block';
        document.getElementById('filtro-data-saldo').style.display = 'none';
        if (tipoFiltro !== '') {
            document.getElementById(`filtro-${tipoFiltro}`).style.display = 'block';
        }
    } else if (tipoTransacao === 'saldo') {
        document.getElementById('filtro-data-saldo').style.display = 'block';
    }
}

function filtroTransacoes(tipoFiltro, tipoTransacao) {
    if (tipoTransacao === '') {
        showToast('Selecione um tipo de transação para aplicar o filtro.', 'error');
        return;
    }

    if (tipoTransacao === 'saldo') {
        const inicio = document.getElementById('dataInicialSaldo').value;
        const fim = document.getElementById('dataFinalSaldo').value;

        if (inicio === '' || fim === '') {
            showToast('Selecione datas válidas para o filtro de data.', 'error');
            return;
        } else if (inicio > fim) {
            showToast('A data inicial não pode ser maior que a data final.', 'error');
            return;
        }

        renderSaldoEGastos('saldo', state.saldoArray.filter(s => s.data >= inicio && s.data <= fim));
        document.getElementById('modal-3').close();
        document.getElementById('limparFiltroDiv').style.display = 'block';
        return;
    }

    if (tipoFiltro === '' || tipoFiltro === 'Selecione uma opção') {
        showToast('Selecione um tipo de transação e um filtro para aplicar.', 'error');
        return;
    }

    if (tipoFiltro === 'categoria') {
        const categoria = document.getElementById('selected-Categoria').value;
        if (categoria === '' || categoria === 'Selecione uma opção') {
            showToast('Selecione uma categoria para filtrar.', 'error');
            return;
        }
        renderSaldoEGastos('gasto', state.gastosArray.filter(g => g.categoria === categoria));

    } else if (tipoFiltro === 'valor') {
        const min = parseFloat(document.getElementById('filtroMin').value) || 0;
        const max = parseFloat(document.getElementById('filtroMax').value) || 0;

        if (isNaN(min) || isNaN(max)) {
            showToast('Digite valores numéricos válidos para o filtro de valor.', 'error');
            return;
        } else if (min > max) {
            showToast('O valor mínimo não pode ser maior que o valor máximo.', 'error');
            return;
        } else if (min === 0 && max === 0) {
            showToast('Digite pelo menos um valor para o filtro de valor.', 'error');
            return;
        }
        renderSaldoEGastos('gasto', state.gastosArray.filter(g => g.valor >= min && g.valor <= max));

    } else if (tipoFiltro === 'data') {
        const inicio = document.getElementById('dataInicial').value;
        const fim = document.getElementById('dataFinal').value;

        if (inicio === '' || fim === '') {
            showToast('Selecione datas válidas para o filtro de data.', 'error');
            return;
        } else if (inicio > fim) {
            showToast('A data inicial não pode ser maior que a data final.', 'error');
            return;
        }
        renderSaldoEGastos('gasto', state.gastosArray.filter(g => g.data >= inicio && g.data <= fim));
    }

    document.getElementById('modal-3').close();
    document.getElementById('limparFiltroDiv').style.display = 'block';
}

function limparFiltro() {
    limparModal3();
    document.getElementById('limparFiltroDiv').style.display = 'none';
    renderSaldoEGastos();
}

export function initFiltro() {
    document.getElementById('tipofiltro').addEventListener('change', mostrarFiltro);
    document.getElementById('tipoTransacao').addEventListener('change', mostrarFiltro);
    document.getElementById('btnFiltro').addEventListener('click', () => {
        filtroTransacoes(
            document.getElementById('tipofiltro').value,
            document.getElementById('tipoTransacao').value
        );
    });
    document.getElementById('limparFiltro').addEventListener('click', limparFiltro);
}
