import { state } from './state.js';

const ctx = document.getElementById('meuGrafico').getContext('2d');
const buttonGrafico = document.getElementById('mostrar-grafico');
const buttonGraficoClose = document.getElementById('fechar-grafico');

function getMesLabel(mesKey) {
    const [ano, mes] = mesKey.split('-');
    const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${nomes[parseInt(mes) - 1]} ${ano}`;
}

export function getMesesDisponiveis() {
    const meses = new Set();
    state.gastosArray.forEach(g => meses.add(g.data.slice(0, 7)));
    state.saldoArray.forEach(s => meses.add(s.data.slice(0, 7)));
    return [...meses].sort();
}

function agruparPorDia(array, mesKey) {
    const mapa = {};
    array.filter(item => item.data.startsWith(mesKey)).forEach(item => {
        const dia = item.data.slice(8, 10);
        mapa[dia] = (mapa[dia] || 0) + Number(item.valor);
    });
    return mapa;
}

function getDiasDoMes(mesKey) {
    const [ano, mes] = mesKey.split('-').map(Number);
    const total = new Date(ano, mes, 0).getDate();
    return Array.from({ length: total }, (_, i) => String(i + 1).padStart(2, '0'));
}

function atualizarCardsMes() {
    const totalGastosMes = state.valoresGastosMes.reduce((a, b) => a + b, 0);
    const totalSaldoMes = state.valoresSaldosMes.reduce((a, b) => a + b, 0);
    const saldoRealMes = totalSaldoMes - totalGastosMes;

    document.getElementById('gastos-totais-filtro').textContent =
        totalGastosMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('gastos-cat-label').textContent = 'GASTOS';
    document.getElementById('saldo-filtro').textContent =
        saldoRealMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('saldo-label').textContent = 'SALDO';
}

function renderizarMesAtual() {
    const meses = getMesesDisponiveis();

    if (meses.length === 0) {
        if (state.meuGrafico) {
            state.meuGrafico.data.labels = [];
            state.meuGrafico.data.datasets.forEach(ds => ds.data = []);
            state.meuGrafico.options.plugins.legend.display = false;
            state.meuGrafico.update();
        }

        document.getElementById('grafico-nav').style.display = 'none';
        document.getElementById('grafico-wrapper').style.display = 'none';
        document.getElementById('grafico-sem-dados').style.display = 'block';
        document.getElementById('label-mes-atual').textContent = 'Sem dados';
        document.getElementById('gastos-totais-filtro').textContent = 'R$ 0,00';
        document.getElementById('gastos-cat-label').textContent = 'GASTOS';
        document.getElementById('saldo-filtro').textContent = 'R$ 0,00';
        document.getElementById('saldo-label').textContent = 'SALDO';

        state.mesSelecionado = null;
        return;
    }

    document.getElementById('grafico-nav').style.display = '';
    document.getElementById('grafico-wrapper').style.display = '';
    document.getElementById('grafico-sem-dados').style.display = 'none';

    if (state.meuGrafico) {
        state.meuGrafico.options.plugins.legend.display = true;
        state.meuGrafico.update();
    }

    if (state.mesSelecionado === null || !meses.includes(state.mesSelecionado)) {
        state.mesSelecionado = meses[meses.length - 1];
    }

    const gastosDia = agruparPorDia(state.gastosArray, state.mesSelecionado);
    const saldosDia = agruparPorDia(state.saldoArray, state.mesSelecionado);
    const dias = getDiasDoMes(state.mesSelecionado);

    state.valoresGastosMes = dias.map(d => gastosDia[d] || 0);
    state.valoresSaldosMes = dias.map(d => saldosDia[d] || 0);

    state.meuGrafico.data.labels = dias.map(d => `${d}`);
    state.meuGrafico.data.datasets[0].data = state.valoresGastosMes;
    state.meuGrafico.data.datasets[1].data = state.valoresSaldosMes;
    state.meuGrafico.update();

    document.getElementById('label-mes-atual').textContent = getMesLabel(state.mesSelecionado);

    const idx = meses.indexOf(state.mesSelecionado);
    document.getElementById('btn-mes-anterior').disabled = idx === 0;
    document.getElementById('btn-mes-proximo').disabled = idx === meses.length - 1;

    atualizarCardsMes();
}

export function atualizarGrafico() {
    const meses = getMesesDisponiveis();
    if (meses.length > 0 && !meses.includes(state.mesSelecionado)) {
        state.mesSelecionado = meses[meses.length - 1];
    }
    renderizarMesAtual();
}

export function renderGrafico() {
    state.meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Gastos',
                    data: [],
                    backgroundColor: 'rgba(220, 80, 80, 0.7)',
                    borderRadius: 6,
                    borderWidth: 0,
                    borderSkipped: false,
                },
                {
                    label: 'Saldo',
                    data: [],
                    backgroundColor: 'rgba(80, 200, 120, 0.7)',
                    borderRadius: 6,
                    borderWidth: 0,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            animation: { duration: 400, easing: 'easeInOutQuart' },
            responsive: true,
            maintainAspectRatio: false,
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                const saldoEl = document.getElementById('gastos-totais-filtro');

                if (elements.length > 0) {
                    const el = elements[0];
                    const label = state.meuGrafico.data.labels[el.index];
                    const dsLabel = state.meuGrafico.data.datasets[el.datasetIndex].label;
                    const valor = state.meuGrafico.data.datasets[el.datasetIndex].data[el.index];
                    const totalSaldoMes = state.valoresSaldosMes.reduce((acc, val) => acc + val, 0);
                    const totalGastosMes = state.valoresGastosMes.reduce((acc, val) => acc + val, 0);
                    const saldoRealMes = totalSaldoMes - totalGastosMes;

                    if (el.datasetIndex === 1) {
                        saldoEl.classList.add('verde-destaque');
                        document.getElementById('gastos-totais-filtro').textContent =
                            valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        document.getElementById('gastos-cat-label').textContent =
                            `${dsLabel.toUpperCase()} — DIA ${label}`;
                        document.getElementById('saldo-filtro').textContent =
                            saldoRealMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        document.getElementById('saldo-label').textContent = 'SALDO';
                    } else {
                        saldoEl.classList.remove('verde-destaque');
                        document.getElementById('gastos-totais-filtro').textContent =
                            valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        document.getElementById('gastos-cat-label').textContent =
                            `${dsLabel.toUpperCase()} — DIA ${label}`;
                        document.getElementById('saldo-filtro').textContent =
                            (saldoRealMes + valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        document.getElementById('saldo-label').textContent = 'SALDO SEM ESTE GASTO';
                    }
                } else {
                    saldoEl.classList.remove('verde-destaque');
                    atualizarCardsMes();
                }
            },
            plugins: {
                legend: { display: true },
                tooltip: { enabled: false },
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        color: 'rgba(254,253,234,0.5)',
                        font: { family: 'Poppins', size: 12 },
                        maxRotation: 45
                    },
                    grid: { display: false },
                    border: { display: false }
                },
                y: { display: false }
            }
        }
    });

    renderizarMesAtual();
}

export function initGrafico() {
    buttonGrafico.addEventListener('click', () => {
        document.getElementById('grafico-completo').style.display = 'block';
        buttonGraficoClose.style.display = 'block';
        buttonGrafico.style.display = 'none';
    });

    buttonGraficoClose.addEventListener('click', () => {
        document.getElementById('grafico-completo').style.display = 'none';
        buttonGraficoClose.style.display = 'none';
        buttonGrafico.style.display = 'block';
    });

    document.getElementById('btn-mes-anterior').addEventListener('click', () => {
        const meses = getMesesDisponiveis();
        const idx = meses.indexOf(state.mesSelecionado);
        if (idx > 0) {
            state.mesSelecionado = meses[idx - 1];
            renderizarMesAtual();
        }
    });

    document.getElementById('btn-mes-proximo').addEventListener('click', () => {
        const meses = getMesesDisponiveis();
        const idx = meses.indexOf(state.mesSelecionado);
        if (idx < meses.length - 1) {
            state.mesSelecionado = meses[idx + 1];
            renderizarMesAtual();
        }
    });

    ctx.canvas.addEventListener('mouseleave', () => {
        atualizarCardsMes();
        document.getElementById('gastos-totais-filtro').classList.remove('verde-destaque');
    });
}
