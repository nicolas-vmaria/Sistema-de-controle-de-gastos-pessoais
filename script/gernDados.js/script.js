const salarioInput = document.getElementById('valorSalario');
const gastosButton = document.getElementById('btnGasto');
const btnSalario = document.getElementById('btnSalario');
const inputGastos = document.getElementById('gastosInput');
const listElement = document.getElementById('listaGastos');
const saldo = document.getElementById('saldo');
const openButtons = document.querySelectorAll('.open-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const selectElement = document.getElementById('cat-gastos');
let modal1 = document.getElementById('modal-1');
let modal2 = document.getElementById('modal-2');


let salario = 0;    
let gastosTotais = 0;
let gastosArray = [];
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
        }
        

    } else {
        alert('Por favor, insira um número válido.');
    }
});

function renderGastos(){
    listElement.innerHTML = ''

    gastosArray.forEach((todo, index)=>{
    
    let liElement = document.createElement("li")
    let gastosText = document.createTextNode(`R$ ${todo.valor}`)
    let posicao = index;

 
    let dateformatada = new Date(todo.data + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let dateText = document.createTextNode(` - ${dateformatada}`)

    let catgeoriaText = document.createTextNode(` - ${todo.categoria}`)
    

    // let linkElement = document.createElement("a")
    // linkElement.setAttribute("href", "#")

    // let textLink = document.createTextNode("Excluir")
    // linkElement.appendChild(textLink)
    
    // linkElement.setAttribute("onclick", `deletartarefas(${posicao})`)

    let editElement = document.createElement("a")
    editElement.setAttribute("href", "#")

    // let textedit = document.createTextNode("Editar")
    // editElement.appendChild(textedit)

    editElement.setAttribute("onclick",`editarTarefa(${posicao})`)

    // liElement.appendChild(linkElement)
    liElement.appendChild(gastosText)
    liElement.appendChild(dateText)
    liElement.appendChild(catgeoriaText)
    // liElement.appendChild(editElement)
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
    limparModal2();
    modal2.close();
    renderGastos();
    saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    
}


