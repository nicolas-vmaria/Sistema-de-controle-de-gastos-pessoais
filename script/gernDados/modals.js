import { categorias } from './state.js';

export function limparModal1() {
    document.getElementById('valorSalario').value = '';
    document.getElementById('receita-user').value = 'salario';
    document.getElementById('nomeReceita').value = '';
    document.getElementById('outro-receita-group').style.display = 'none';
    document.getElementById('valorSalario').placeholder = 'Digite o valor do salário';
    document.getElementById('dataSaldo').value = '';
}

export function limparModal2() {
    document.getElementById('nomeGasto').value = '';
    document.getElementById('gastosInput').value = '';
    document.getElementById('dataGastos').value = '';
    document.getElementById('categoriaGastos').value = 'Selecione uma opção';
}

export function limparModal3() {
    document.getElementById('tipofiltro').value = '';
    document.getElementById('filtroMin').value = '';
    document.getElementById('filtroMax').value = '';
    document.getElementById('dataInicial').value = '';
    document.getElementById('dataFinal').value = '';
    document.getElementById('selected-Categoria').value = '';
    document.getElementById('tipoTransacao').value = '';
    document.getElementById('filtro-group').style.display = 'none';
    document.getElementById('filtro-categoria').style.display = 'none';
    document.getElementById('filtro-data').style.display = 'none';
    document.getElementById('filtro-valor').style.display = 'none';
    document.getElementById('filtro-data-saldo').style.display = 'none';
}

export function popularCategorias() {
    const selectElement = document.getElementById('categoriaGastos');
    const selectElementFiltro = document.getElementById('selected-Categoria');

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
        selectElementFiltro.appendChild(option.cloneNode(true));
    });
}

export function initModals() {
    const openButtons = document.querySelectorAll('.open-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            document.getElementById(modalId).showModal();
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            document.getElementById(modalId).close();
            limparModal1();
            limparModal2();
            if (modalId === 'modal-3') limparModal3();
        });
    });
}
