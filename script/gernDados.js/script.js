const valorInput = document.getElementById('valor');
const gastosButton = document.getElementById('gasto');
const enviarButton = document.getElementById('enviar');
const inputGatos = document.getElementById('inputGastos');
const listElement = document.getElementById('listaGastos');
const saldo = document.getElementById('saldo');

let salario = 0;
let gastosTotais = 0;
let gastosArray = [];

function adicionarSalario(valor){
    confirm("Deseja adicionar esse valor ao salário?");
    if(confirm){
        salario += valor;
        saldo.textContent = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }else {
        alert("Valor não adicionado ao salário.");
    }

    return salario;
}

enviarButton.addEventListener('click', () => {
    const valor = parseFloat(valorInput.value);
    if (!isNaN(valor)) {
        adicionarSalario(valor);
        valorInput.value = '';
    } else {
        alert('Por favor, insira um número válido.');
    }
});

function renderGastos(){
    listElement.innerHTML = ''

    gastosArray.map((todo)=>{
    
    let liElement = document.createElement("li")
    let gastosText = document.createTextNode(`R$ ${todo.valor}`)
    let posicao = gastosArray.indexOf(todo)

 
    let dateformatada = new Date(todo.data + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let dateText = document.createTextNode(` - ${dateformatada}`)
    

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
    // liElement.appendChild(editElement)
    listElement.appendChild(liElement)
})
}

gastosButton.onclick = adicionarGastosLista;

function adicionarGastosLista(){
    if(inputGatos.value === ''){
        alert("Digite uma quantia para adicionar aos gastos.");
        return false;
    }else{
        let newGAstos = inputGatos.value;
        let dataGastos = document.getElementById('dataGastos').value;

        if(!dataGastos){
            alert("Por favor, selecione uma data para o gasto.");
            return false;
        }
        gastosArray.push({
            valor: newGAstos,
            data: document.getElementById('dataGastos').value
        });

        adicionarGastos(parseFloat(newGAstos));
        renderGastos()
    }

    
}

function adicionarGastos(valor){
   
    let saldofuturo = salario - valor;
    
    console.log(saldofuturo);
    if(saldofuturo <= 0){
        let resposta = confirm("Atenção: Seus gastos excederam seu salário! Deseja continuar adicionando esse gasto?");
        if(resposta){
            salario -= valor;
            gastosTotais += valor;
            alert("Seu saldo está negativo! Considere revisar seus gastos.");
        }else{
            salario += valor; 
            alert("Gasto não adicionado.");
            return;
        }
    }else{
        salario -= valor;
        gastosTotais += valor;
    }

    saldo.textContent = (salario - gastosTotais).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


