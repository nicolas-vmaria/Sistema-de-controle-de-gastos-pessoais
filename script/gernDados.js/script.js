const salarioInput = document.getElementById('valorSalario');
const gastosButton = document.getElementById('btnGasto');
const btnSalario = document.getElementById('btnSalario');
const inputGastos = document.getElementById('gastosInput');
const listElement = document.getElementById('listaGastos');
const saldo = document.getElementById('saldo');
const openButtons = document.querySelectorAll('.open-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const selectElement = document.getElementById('cat-gastos');
const selectElementFiltro = document.getElementById('filtroCategoria');
const gastosTotaisElement = document.getElementById("gastos-totais")
let modal1 = document.getElementById('modal-1');
let modal2 = document.getElementById('modal-2');
const userLogado = JSON.parse(localStorage.getItem('usuarioLogado')); 
const nameElement = document.getElementById('nameUser');
const sairButton = document.getElementById('sair-conta');
let salario = 0;    
let gastosTotais = 0;
let gastosArray = [];
let saldoArray = [];
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

function salvarNoSorage(chave, valor){
    localStorage.setItem(chave, JSON.stringify(valor));
}

function pegarDoStoreage(chave){
    return JSON.parse(localStorage.getItem(chave));
}

function atualizarUsuario(){
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    usuarioLogado.saldo = salario;
    usuarioLogado.gastosTotais = gastosTotais;
    usuarioLogado.gastosArray = gastosArray;

    salvarNoSorage('usuarioLogado', usuarioLogado);

    let users = pegarDoStoreage('users') || [];
    let index = users.findIndex(user => user.email === usuarioLogado.email);
    users[index] = usuarioLogado;
    salvarNoSorage('users', users);
}

function init() {
    if (userLogado) {
        nameElement.textContent = userLogado.nome.toUpperCase().slice(0, 1) + userLogado.nome.toLowerCase().slice(1);
        salario = userLogado.saldo || 0;
        gastosTotais = userLogado.gastosTotais || 0;
        gastosArray = userLogado.gastosArray || [];
        saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        gastosTotaisElement.textContent = gastosTotais.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
        renderGastos();
    } else {
        alert('Nenhum usuário logado. Redirecionando para a página de login.');
        window.location.href = 'login.html';
    }
}

init();

sairButton.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'home.html';
});

function limparModal2() {
    inputGastos.value = '';
    document.getElementById('dataGastos').value = '';
    document.getElementById('cat-gastos').value = 'Escolha uma categoria';
}

function limparModal1() {
    salarioInput.value = '';
}


categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    selectElement.appendChild(option);
    selectElementFiltro.appendChild(option)
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
    });
});

function adicionarSalario(valor){
    let resposta = confirm("Deseja adicionar esse valor ao salário?");

    if(resposta){
        salario += valor;
        saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return true;
    }else {
        alert("Valor não adicionado ao salário.");
        return false;
    }
}

btnSalario.addEventListener('click', () => {
    const valor = parseFloat(salarioInput.value);

    if (!isNaN(valor)) {
        let sucesso = adicionarSalario(valor);
        if(sucesso){
            alert("Salário atualizado com sucesso!");
            modal1.close();
            limparModal1();
            atualizarUsuario();
            
        }
        

    } else {
        alert('Por favor, insira um número válido.');
    }
});

function renderGastos(array = gastosArray){
    listElement.innerHTML = ''

    if(gastosArray.length === 0){
        listElement.innerHTML = '<li class="empty-state"> Nenhum gasto registrado ainda </li>'
        return;
    }

    array.slice().reverse().forEach((todo, index)=>{
    
    let liElement = document.createElement("li")
    let posicao = index;

    let dateformatada = new Date(todo.data + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
     liElement.innerHTML = `
            <div class="gasto-left">
                <span class="gasto-valor">- R$ ${todo.valor}</span>
                <span class="gasto-meta">${dateformatada}</span>
            </div>
            <span class="gasto-cat">${todo.categoria}</span>
        `;

    listElement.appendChild(liElement)
})
}

gastosButton.addEventListener('click', adicionarGastos);

function adicionarGastos(){
    let newGastos = parseFloat(inputGastos.value);
    let dataGastos = document.getElementById('dataGastos').value;
    let saldofuturo = salario - newGastos;
    let categoriaGastos = document.getElementById('cat-gastos').value;

    if(inputGastos.value === ''){
        alert("Digite uma quantia para adicionar aos gastos.");
        return false;
    }else if(isNaN(newGastos)){
        alert("Digite um número válido para os gastos.");
        return false;
    }else if(dataGastos === ''){
        alert("Selecione uma data para o gasto.");
        return false;
    }else if(categoriaGastos === 'Escolha uma categoria'){
        alert("Selecione uma categoria para o gasto.");
        return false;
    }

      // Depois que o usuário preencher os campos, o sistema verifica se o gasto fará o saldo ficar negativo. 
      // Se sim, ele exibe um alerta e pergunta se o usuário deseja continuar adicionando esse gasto. 
      // Se o usuário confirmar, o gasto é adicionado mesmo com o saldo negativo, e um alerta adicional é exibido para avisar sobre a situação. 
      // Se o usuário cancelar, o gasto não é adicionado e uma mensagem de confirmação é exibida.

    if(saldofuturo <= 0){
        let resposta = confirm("Atenção: Seus gastos excederam seu salário! Deseja continuar adicionando esse gasto?");
        if(resposta){
            salario -= newGastos;
            gastosTotais += newGastos;
            alert("Seu saldo está negativo! Considere revisar seus gastos.");
        }else{
            alert("Gasto não adicionado.");
            modal2.close();
            limparModal2();
            return false;
        }
    }else{
        alert("Gasto adicionado com sucesso!");
        salario -= newGastos;
        gastosTotais += newGastos;
        
    }

    gastosArray.push({valor: newGastos, data: dataGastos, categoria: categoriaGastos});
    modal2.close();
    limparModal2();
    atualizarUsuario();
    renderGastos();
    saldo.textContent = salario.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    gastosTotaisElement.textContent = gastosTotais.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    
}

function mostrarFiltro(){
    let tipoFiltro = document.getElementById("tipofiltro").value;

    document.getElementById("filtroCategoria").style.display = "none";
    document.getElementById("filtro-data").style.display = "none";
    document.getElementById("filtro-valor").style.display = "none";

    if(tipo !== ""){
        document.getElementById(`filtro-${tipoFiltro}`).style.display = "block";
    }

}

function filtrarGastos(){
    let tipo = document.getElementById("tipofiltro").value
    let filtrado = []

    if(tipo === "categoria"){
        let categoria = document.getElementById("filtro")
        filtrado = gastosArray.filter(gasto => gasto.categoria === categoria)
    } else if(tipo === "valor"){
        let min = parseFloat(document.getElementById("filtroMin").value) || 0;
        let max = parseFloat(document.getElementById("filtroMax").value) || 0;
        filtrado = gastosArray.filter(gasto => gasto.valor >= min && gasto.valor >= max)
    }else if(tipo === "data"){
        let inicio = document.getElementById("dataInicial").value
        let fim = document.getElementById("dataFinal").value
        filtrado = gastosArray.filter(gasto => gasto.data >= inicio && gasto.data <= fim)
    }else {
        renderGastos()
        return
    }

    renderGastos(filtrado)


}

function limparFiltro(){
    document.getElementById("tipoFiltro").value = ""
    mostrarFiltro()
    renderGastos()
}
