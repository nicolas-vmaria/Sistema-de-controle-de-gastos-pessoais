export const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

export const categorias = [
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

// Estado mutável compartilhado entre os módulos via objeto
export const state = {
    salario: 0,
    gastosTotais: 0,
    gastosArray: [],
    saldoArray: [],
    combinedArray: [],
    editandoIndex: null,
    editandoTipo: null,
    mesSelecionado: null,
    valoresGastosMes: [],
    valoresSaldosMes: [],
    meuGrafico: null,
};
