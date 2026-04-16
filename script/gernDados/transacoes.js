import { state } from './state.js';
import { atualizarUsuario } from './storage.js';
import { limparModal1, limparModal2 } from './modals.js';
import { showToast, showConfirm } from '../toast.js';

const listElementTransacoes = document.getElementById('listaTransacoes');
const saldoElement = document.getElementById('saldo');
const gastosTotaisElement = document.getElementById('gastos-totais');

export function renderSaldoEGastos(filtro = 'todos', arrayFiltrado = null) {
    state.combinedArray = [];
    listElementTransacoes.innerHTML = '';

    const gastos = filtro === 'gasto' && arrayFiltrado ? arrayFiltrado :
        filtro === 'saldo' ? [] : state.gastosArray;

    const saldos = filtro === 'saldo' && arrayFiltrado ? arrayFiltrado :
        filtro === 'gasto' ? [] : state.saldoArray;

    gastos.forEach((gasto, index) => {
        state.combinedArray.push({ tipo: 'gasto', indexReal: index, ...gasto });
    });

    saldos.forEach((s, index) => {
        state.combinedArray.push({ tipo: 'saldo', indexReal: index, ...s });
    });

    state.combinedArray.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (state.combinedArray.length === 0) {
        listElementTransacoes.innerHTML = '<li class="empty-state" id="empty-state">Nenhum valor registrada ainda.</li>';
        return;
    }

    state.combinedArray.forEach(item => {
        const liElement = document.createElement('li');
        const dateformatada = new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        if (item.tipo === 'gasto') {
            liElement.innerHTML = `
                <div class="gasto-left">
                    <span class="gasto-nome">${item.nome}</span>
                    <span class="gasto-valor">- ${Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span class="gasto-meta">${dateformatada}</span>
                </div>
                <div class="action-group">
                    <button class="edit-button" data-modal="modal-2" data-index="${item.indexReal}" data-tipo="gasto"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button class="delete-button" data-modal="modal-2" data-index="${item.indexReal}" data-tipo="gasto"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    <span class="gasto-cat">${item.categoria}</span>
                </div>
            `;
        } else {
            liElement.innerHTML = `
                <div class="saldo-item">
                    <span class="saldo-nome">${item.nome}</span>
                    <span class="saldo-valor">+ ${Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span class="saldo-data">${dateformatada}</span>
                </div>
                <div class="action-group">
                    <button class="edit-button" data-modal="modal-1" data-index="${item.indexReal}" data-tipo="saldo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button class="delete-button" data-index="${item.indexReal}" data-tipo="saldo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    <span class="gasto-cat">Receita</span>
                </div>
            `;
        }

        listElementTransacoes.appendChild(liElement);
    });
}

export function editarGasto(item, index, tipo) {
    state.editandoIndex = index;
    state.editandoTipo = tipo;

    if (tipo === 'gasto') {
        document.getElementById('nomeGasto').value = item.nome;
        document.getElementById('gastosInput').value = item.valor;
        document.getElementById('dataGastos').value = item.data;
        document.getElementById('categoriaGastos').value = item.categoria;
        document.getElementById('btnGasto').textContent = 'Salvar alteração';
    } else {
        document.getElementById('receita-user').value = item.nome === 'Salário' ? 'salario' : 'outro';
        if (item.nome !== 'Salário') {
            document.getElementById('nomeReceita').value = item.nome;
            document.getElementById('outro-receita-group').style.display = 'block';
        }
        document.getElementById('dataSaldo').value = item.data;
        document.getElementById('valorSalario').value = item.valor;
        document.getElementById('btnSalario').textContent = 'Salvar alteração';
    }
}

export function encerrarEdicao() {
    state.editandoIndex = null;
    state.editandoTipo = null;

    document.getElementById('btnGasto').textContent = 'Adicionar gasto';
    document.getElementById('btnSalario').textContent = 'Salvar receita';

    document.getElementById('modal-1').close();
    document.getElementById('modal-2').close();
    limparModal1();
    limparModal2();

    atualizarUsuario();
    renderSaldoEGastos();

    // Import dinâmico evita dependência circular com grafico.js
    import('./grafico.js').then(({ atualizarGrafico }) => atualizarGrafico());

    saldoElement.textContent = state.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    gastosTotaisElement.textContent = state.gastosTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    showToast('Alteração salva com sucesso!', 'success');
}

export function initListaTransacoes() {
    listElementTransacoes.addEventListener('click', async (event) => {
        const editBtn = event.target.closest('.edit-button');
        const deleteBtn = event.target.closest('.delete-button');

        if (editBtn) {
            const index = parseInt(editBtn.getAttribute('data-index'));
            const tipo = editBtn.getAttribute('data-tipo');
            const item = tipo === 'gasto' ? state.gastosArray[index] : state.saldoArray[index];
            const modalId = editBtn.getAttribute('data-modal');

            if (modalId) document.getElementById(modalId).showModal();
            editarGasto(item, index, tipo);
        }

        if (deleteBtn) {
            const index = parseInt(deleteBtn.getAttribute('data-index'));
            const tipo = deleteBtn.getAttribute('data-tipo');

            const resposta = await showConfirm('Tem certeza que deseja excluir esta transação?');

            if (resposta) {
                if (tipo === 'gasto') {
                    const gastoRemovido = state.gastosArray.splice(index, 1)[0];
                    state.salario += gastoRemovido.valor;
                    state.gastosTotais -= gastoRemovido.valor;
                } else {
                    const saldoRemovido = state.saldoArray.splice(index, 1)[0];
                    state.salario -= saldoRemovido.valor;
                }

                atualizarUsuario();
                renderSaldoEGastos();
                import('./grafico.js').then(({ atualizarGrafico }) => atualizarGrafico());

                saldoElement.textContent = state.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                gastosTotaisElement.textContent = state.gastosTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                showToast('Transação excluída com sucesso!', 'success');
            } else {
                showToast('Transação não excluída.', 'error');
            }
        }
    });
}
