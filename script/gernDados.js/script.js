let salario = 0;
const mostrarSal = document.getElementById('mostrarsalario');
const buttonMostrar = document.getElementById('mostrar');
const valorInput = document.getElementById('valor');
const enviarButton = document.getElementById('enviar');
const gastos = document.getElementById('gastos');
const saldoAtulizado = document.getElementById("saldoAtualizado");


function adicionarSalario(valor){
    salario += valor;
}

function mostrarSalario(){
    mostrarSal.innerHTML = `Salário total: R$ ${salario.toFixed(2)}`;
}

function adicionarGastos(gasto){
    
    salario -= gasto;
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


buttonMostrar.addEventListener('click', () => {
        if (salario > 0) {
            mostrarSalario();
        } else {
            alert('O salário total é R$ 0. Por favor, adicione algum valor antes de mostrar o salário.');
        }
});