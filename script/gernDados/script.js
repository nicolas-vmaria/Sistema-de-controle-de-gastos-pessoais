import { showToast, showConfirm } from '../toast.js';
const salarioInput = document.getElementById('valorSalario');
const gastosButton = document.getElementById('btnGasto');
const btnSalario = document.getElementById('btnSalario');
const inputGastos = document.getElementById('gastosInput');
const listElementTransacoes = document.getElementById('listaTransacoes');
const saldo = document.getElementById('saldo');
const openButtons = document.querySelectorAll('.open-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const selectElement = document.getElementById('categoriaGastos');
const selectElementFiltro = document.getElementById('selected-Categoria');
const gastosTotaisElement = document.getElementById("gastos-totais")
const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const nameElement = document.getElementById('nameUser');
const sairButton = document.getElementById('sair-conta');
const nomeGastos = document.getElementById('nomeGasto');
const receitaUserSelect = document.getElementById('receita-user');
const nomeReceitaInput = document.getElementById('nomeReceita');
const dataSaldoInput = document.getElementById('dataSaldo');
const ctx = document.getElementById('meuGrafico').getContext('2d');
let modal1 = document.getElementById('modal-1');
let modal2 = document.getElementById('modal-2');
let modal3 = document.getElementById('modal-3');
let categoriasFiltradas = [];
let valoresPorCategoria = [];
let salario = 0;
let gastosTotais = 0;
let meuGrafico = null;
let gastosArray = [];
let saldoArray = [];
let combinedArray = [];
let categorias = [
    "Aluguel/Moradia",
    "Supermercado",
    "Água e Luz",
    "Internet e Telefone",
    "Transporte/Combustível",
    "Farmácia",
    "Consultas Médicas",
    "Escola/Faculdade",
    "Restaurantes e Delivery",
    "Streaming",
    "Academia",
    "Roupas e Calçados",
    "Impostos e Taxas",
    "Pets",
    "Presentes",
    "Outros"
];

function salvarNoStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function pegarDoStorage(chave) {
    return JSON.parse(localStorage.getItem(chave));
}

function atualizarUsuario() {
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    usuarioLogado.saldo = salario;
    usuarioLogado.gastosTotais = gastosTotais;
    usuarioLogado.gastosArray = gastosArray;
    usuarioLogado.saldoArray = saldoArray;

    salvarNoStorage('usuarioLogado', usuarioLogado);

    let users = pegarDoStorage('users') || [];
    let index = users.findIndex(user => user.email === usuarioLogado.email);
    users[index] = usuarioLogado;
    salvarNoStorage('users', users);
}

function init() {
    if (userLogado) {
        nameElement.textContent = userLogado.nome.toUpperCase().slice(0, 1) + userLogado.nome.toLowerCase().slice(1);
        salario = userLogado.saldo || 0;
        gastosTotais = userLogado.gastosTotais || 0;
        gastosArray = userLogado.gastosArray || [];
        saldoArray = userLogado.saldoArray || [];
        saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        gastosTotaisElement.textContent = gastosTotais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        renderSaldoEGastos();
        renderGrafico();
    } else {
        showToast('Nenhum usuário logado. Redirecionando para a página de login.', 'error');
        window.location.href = 'login.html';
    }
}

init();

sairButton.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'home.html';
});

function limparModal2() {
    nomeGastos.value = '';
    inputGastos.value = '';
    document.getElementById('dataGastos').value = '';
    selectElement.value = "Selecione uma opção";
}

function limparModal1() {
    salarioInput.value = '';
    receitaUserSelect.value = "salario";
    nomeReceitaInput.value = '';
    document.getElementById('outro-receita-group').style.display = "none";
    salarioInput.placeholder = "Digite o valor do salário";
    dataSaldoInput.value = '';
}

function limparModal3() {
    document.getElementById("tipofiltro").value = "";
    document.getElementById("filtroMin").value = '';
    document.getElementById("filtroMax").value = '';
    document.getElementById("dataInicial").value = '';
    document.getElementById("dataFinal").value = '';
    document.getElementById("selected-Categoria").value = "";
    document.getElementById("tipoTransacao").value = "";
    document.getElementById("filtro-group").style.display = "none";
    document.getElementById("filtro-categoria").style.display = "none";
    document.getElementById("filtro-data").style.display = "none";
    document.getElementById("filtro-valor").style.display = "none";
    document.getElementById("filtro-data-saldo").style.display = "none";
}


categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    selectElement.appendChild(option);
    selectElementFiltro.appendChild(option.cloneNode(true));
});

openButtons.forEach(button => {
    button.addEventListener('click', () => {

        const modalId = button.getAttribute('data-modal');

        const modal = document.getElementById(modalId);

        modal.showModal();
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');

        const modal = document.getElementById(modalId);

        modal.close();
        limparModal2();
        limparModal1();

        if (modalId === 'modal-3') {
            limparModal3();
        }

    });
});

async function adicionarSaldo(valor) {

    let resposta = await showConfirm("Deseja adicionar esse valor ao saldo?");

    if (resposta) {
        salario += valor;
        return true;
    } else {
        showToast("Valor não adicionado ao saldo.", 'error');
        return false;
    }
}

receitaUserSelect.addEventListener('change', () => {
    let tipo = receitaUserSelect.value;

    if (tipo === '') {
        showToast("Selecione um tipo de receita para adicionar ao saldo.", 'error');
        return false;
    } else if (tipo === 'salario') {
        salarioInput.placeholder = "Digite o valor do salário";
        document.getElementById('outro-receita-group').style.display = "none";
    }
    else if (tipo === 'outro') {
        document.getElementById('outro-receita-group').style.display = "block";
        salarioInput.placeholder = "Digite o valor da receita";
    }
})


btnSalario.addEventListener('click', async () => {
    const valor = parseFloat(salarioInput.value);
    let tipo = receitaUserSelect.value;
    let nomeReceita = nomeReceitaInput.value.trim();
    let dataSaldo = dataSaldoInput.value;
    let dataAtual = new Date().toISOString().split('T')[0];


    if (isNaN(valor)) {
        showToast('Por favor, insira um número válido.', 'error');
        return false;
    } else if (valor <= 0) {
        showToast('Por favor, insira um valor maior que zero.', 'error');
        return false;
    } else if (nomeReceitaInput.value === '' && receitaUserSelect.value === 'outro') {
        showToast('Digite um nome para a receita.', 'error');
        return false;
    } else if (dataSaldoInput.value === '') {
        showToast('Selecione uma data para o saldo.', 'error');
        return false;
    } else if (dataSaldo > dataAtual) {
        showToast('A data do saldo não pode ser no futuro.', 'error');
        return false;
    }

    let sucesso = await adicionarSaldo(valor);
    if (sucesso) {
        showToast("Saldo atualizado com sucesso!", 'success');
        saldoArray.push({
            nome: tipo === 'salario' ? 'Salário' : nomeReceita,
            valor: valor,
            data: dataSaldo
        })
        modal1.close();
        limparModal1();
        atualizarUsuario();
        renderSaldoEGastos();
        saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
});


function renderSaldoEGastos(filtro = "todos", arrayFiltrado = null) {
    combinedArray = [];
    listElementTransacoes.innerHTML = '';

    let gastos = filtro === 'gasto' && arrayFiltrado ? arrayFiltrado :
        filtro === 'saldo' ? [] :  // esconde gastos se filtro for saldo
            gastosArray;

    let saldos = filtro === 'saldo' && arrayFiltrado ? arrayFiltrado :
        filtro === 'gasto' ? [] :  // esconde saldos se filtro for gasto
            saldoArray;

    gastos.forEach(gasto => {
        combinedArray.push({
            tipo: 'gasto',
            ...gasto
        });
    });

    saldos.forEach(saldo => {
        combinedArray.push({
            tipo: 'saldo',
            ...saldo
        });
    });

    combinedArray.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (combinedArray.length === 0) {
        listElementTransacoes.innerHTML = '<li class="empty-state" id="empty-state">Nenhum valor registrada ainda.</li>';
        return;
    }

    combinedArray.forEach(item => {
        let liElement = document.createElement("li")
        let dateformatada = new Date(item.data + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        if (item.tipo === 'gasto') {
            liElement.innerHTML = `
                <div class="gasto-left">
                    <span class="gasto-nome">${item.nome}</span>
                    <span class="gasto-valor">- R$ ${item.valor}</span>
                    <span class="gasto-meta">${dateformatada}</span>
                </div>

                <div class="action-group">
                    <button class="edit-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button class="delete-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    <span class="gasto-cat">${item.categoria}</span>
                </div>
            `;

            liElement.querySelector('.edit-button').addEventListener('click', () => {
                alert('editar', item)
            });
    
            liElement.querySelector('.delete-button').addEventListener('click', () => {
                alert('deletar', item)
            });
        } else {
            liElement.innerHTML = `
                <div class="saldo-item">
                    <span class="saldo-nome">${item.nome}</span>
                    <span class="saldo-valor">+ R$ ${item.valor}</span>
                    <span class="saldo-data">${dateformatada}</span>
                </div>

                <div class="action-group">
                    <button class="edit-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button class="delete-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fefdea"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    <span class="gasto-cat">Receita</span>
                </div>
            `;

            liElement.querySelector('.edit-button').addEventListener('click', () => {
                alert('editar', item)
            });
    
            liElement.querySelector('.delete-button').addEventListener('click', () => {
                alert('deletar', item)
            });
        }


        listElementTransacoes.appendChild(liElement)
    });
}

async function adicionarGastos() {
    let newGastos = parseFloat(inputGastos.value);
    let dataGastos = document.getElementById('dataGastos').value;
    let dataAtual = new Date().toISOString().split('T')[0];
    let saldofuturo = salario - newGastos;
    let categoriaGastos = document.getElementById('categoriaGastos').value;

    if (nomeGastos.value === '') {
        showToast("Digite um nome para o gasto.", 'error');
        return false;
    } else if (inputGastos.value === '') {
        showToast("Digite uma quantia para adicionar aos gastos.", 'error');
        return false;
    } else if (isNaN(newGastos)) {
        showToast("Digite um número válido para os gastos.", 'error');
        return false;
    } else if (dataGastos === '') {
        showToast("Selecione uma data para o gasto.", 'error');
        return false;
    } else if (dataGastos > dataAtual) {
        showToast("A data do gasto não pode ser no futuro.", 'error');
        return false;
    }

    else if (categoriaGastos === 'Selecione uma opção' || categoriaGastos === '') {
        showToast("Selecione uma categoria para o gasto.", 'error');
        return false;
    }


    if (saldofuturo <= 0) {
        let resposta = await showConfirm("Atenção: Seus gastos excederam seu salário! Deseja continuar adicionando esse gasto?");
        if (resposta) {
            salario -= newGastos;
            gastosTotais += newGastos;
            showToast("Seu saldo está negativo! Considere revisar seus gastos.", 'error');
        } else {
            showToast("Gasto não adicionado.", 'error');
            modal2.close();
            limparModal2();
            return false;
        }
    } else {
        showToast("Gasto adicionado com sucesso!", 'success');
        salario -= newGastos;
        gastosTotais += newGastos;

    }

    gastosArray.push({
        nome: nomeGastos.value,
        valor: newGastos,
        data: dataGastos,
        categoria: categoriaGastos
    });

    modal2.close();
    limparModal2();
    atualizarUsuario();
    renderSaldoEGastos();
    atualizarGrafico();
    saldo.textContent = salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    gastosTotaisElement.textContent = gastosTotais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

}

gastosButton.addEventListener('click', adicionarGastos);


function mostrarFiltro() {
    let tipoTransacao = document.getElementById("tipoTransacao").value;
    let tipoFiltro = document.getElementById("tipofiltro").value;

    document.getElementById("filtro-group").style.display = "none"
    document.getElementById("filtro-categoria").style.display = "none";
    document.getElementById("filtro-data").style.display = "none";
    document.getElementById("filtro-valor").style.display = "none";

    if (tipoTransacao === 'gasto') {
        document.getElementById("filtro-group").style.display = "block";
        if (tipoFiltro !== "") {
            document.getElementById(`filtro-${tipoFiltro}`).style.display = "block";
        }
    } else if (tipoTransacao === 'saldo') {
        document.getElementById("filtro-data-saldo").style.display = "block";
    }
};
document.getElementById("tipofiltro").addEventListener("change", mostrarFiltro);
document.getElementById("tipoTransacao").addEventListener("change", mostrarFiltro);

function filtroTransacoes(tipoFiltro, tipoTransacao) {

    if (tipoTransacao === '') {
        showToast("Selecione um tipo de transação para aplicar o filtro.", 'error');
        return;
    }

    if (tipoTransacao === "saldo") {
        let inicio = document.getElementById("dataInicialSaldo").value;
        let fim = document.getElementById("dataFinalSaldo").value;

        if (inicio === '' || fim === '') {
            showToast("Selecione datas válidas para o filtro de data.", 'error');
            return;
        } else if (inicio > fim) {
            showToast("A data inicial não pode ser maior que a data final.", 'error');
            return;
        }

        renderSaldoEGastos("saldo", saldoArray.filter(saldo => saldo.data >= inicio && saldo.data <= fim));
        modal3.close();
        document.getElementById("limparFiltroDiv").style.display = "block";
        return;
    }

    if (tipoTransacao === 'gasto' && (tipoFiltro === "" || tipoFiltro === "Selecione uma opção")) {
        showToast("Selecione um tipo de transação e um filtro para aplicar.", 'error');
        return;
    }

    if (tipoFiltro === "categoria") {
        let categoria = document.getElementById("selected-Categoria").value;
        if (categoria === '' || categoria === 'Selecione uma opção') {
            showToast("Selecione uma categoria para filtrar.", 'error');
            return;
        }

        renderSaldoEGastos("gasto", gastosArray.filter(gasto => gasto.categoria === categoria));
    } else if (tipoFiltro === "valor") {
        let min = parseFloat(document.getElementById("filtroMin").value) || 0;
        let max = parseFloat(document.getElementById("filtroMax").value) || 0;

        if (isNaN(min) || isNaN(max)) {
            showToast("Digite valores numéricos válidos para o filtro de valor.", 'error');
            return;
        } else if (min > max) {
            showToast("O valor mínimo não pode ser maior que o valor máximo.", 'error');
            return;
        } else if (min === 0 && max === 0) {
            showToast("Digite pelo menos um valor para o filtro de valor.", 'error');
            return;
        }

        renderSaldoEGastos("gasto", gastosArray.filter(gasto => gasto.valor >= min && gasto.valor <= max));
    } else if (tipoFiltro === "data") {
        let inicio = document.getElementById("dataInicial").value;
        let fim = document.getElementById("dataFinal").value;

        if (inicio === '' || fim === '') {
            showToast("Selecione datas válidas para o filtro de data.", 'error');
            return;
        } else if (inicio > fim) {
            showToast("A data inicial não pode ser maior que a data final.", 'error');
            return;
        } else if (inicio === fim) {
            showToast("A data inicial e a data final não podem ser iguais para o filtro de data.", 'error');
            return;
        }

        renderSaldoEGastos("gasto", gastosArray.filter(gasto => gasto.data >= inicio && gasto.data <= fim));
    }

    modal3.close();
    document.getElementById("limparFiltroDiv").style.display = "block";
}
document.getElementById("btnFiltro").addEventListener("click", () => filtroTransacoes(document.getElementById("tipofiltro").value, document.getElementById("tipoTransacao").value));

function limparFiltro() {
    limparModal3();
    document.getElementById("limparFiltroDiv").style.display = "none";
    renderSaldoEGastos();

}
document.getElementById("limparFiltro").addEventListener("click", limparFiltro);



function atualizarGrafico() {

    categoriasFiltradas = categorias.filter(cat =>
        gastosArray.some(gasto => gasto.categoria === cat)
    )

    valoresPorCategoria = categoriasFiltradas.map(categoria => {
        return gastosArray
            .filter(gasto => gasto.categoria === categoria)
            .reduce((total, gasto) => total + Number(gasto.valor), 0);
    });

    const coresGastos = valoresPorCategoria.map((valor, index) => {
        const opacity = 0.2 + (index / valoresPorCategoria.length) * 0.7;
        return `rgba(254, 253, 234, ${opacity})`;
    })

    meuGrafico.data.labels = categoriasFiltradas;
    meuGrafico.data.datasets[0].data = valoresPorCategoria;
    meuGrafico.data.datasets[0].backgroundColor = coresGastos;
    meuGrafico.update();
}


function renderGrafico() {
    categoriasFiltradas = categorias.filter(cat =>
        gastosArray.some(gasto => gasto.categoria === cat)
    )

    valoresPorCategoria = categoriasFiltradas.map(categoria => {
        return gastosArray
            .filter(gasto => gasto.categoria === categoria)
            .reduce((total, gasto) => total + Number(gasto.valor), 0);
    });

    const coresGastos = valoresPorCategoria.map((_, index) => {
        const opacity = 0.2 + (index / valoresPorCategoria.length) * 0.7;
        return `rgba(254, 253, 234, ${opacity})`;
    })

    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoriasFiltradas,
            datasets: [
                {
                    label: 'Gastos',
                    data: valoresPorCategoria,
                    backgroundColor: coresGastos,
                    borderRadius: 6,
                    borderWidth: 0,
                    borderSkipped: false,
                },


            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            onHover: (event, elements) => {
                if (elements.length > 0) {
                    let index = elements[0].index;
                    let categoria = categoriasFiltradas[index];
                    let valorCategoria = valoresPorCategoria[index];

                    document.getElementById("gastos-totais-filtro").textContent =
                        valorCategoria.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    document.getElementById('gastos-cat-label').textContent = categoria.toUpperCase();

                    console.log(salario)
                    let saldoSemCategoria = salario + valorCategoria
                    document.getElementById("saldo-filtro").textContent = saldoSemCategoria.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    document.getElementById('saldo-label').textContent = 'SALDO SEM ' + categoria.toUpperCase();
                } else {
                    document.getElementById("gastos-totais-filtro").textContent = gastosTotais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    document.getElementById('gastos-cat-label').textContent = 'GASTOS';
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false
                },
            },

            scales: {
                x: {
                    display: true,
                    ticks: {
                        color: 'rgba(254,253,234,0.5)',
                        font: { familly: 'Poppins', size: 15 },
                        maxRotation: 45
                    },
                    grid: { display: false },
                    border: { display: false }
                },
                y: { display: false }
            }


        }
    });


}

