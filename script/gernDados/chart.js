// chart.js — lê dados reais do usuário logado e renderiza o gráfico
// Não altera nenhuma função do script.js principal

const CATEGORY_ICONS = {
  'Supermercado': '🛒',
  'Aluguel/Moradia': '🏠',
  'Streaming': '📺',
  'Transporte/Combustível': '🚗',
  'Restaurantes e Delivery': '🍔',
  'Farmácia': '💊',
  'Academia': '🏋️',
  'Escola/Faculdade': '📚',
  'Água e Luz': '💡',
  'Internet e Telefone': '📱',
  'Roupas e Calçados': '👕',
  'Impostos e Taxas': '🧾',
  'Pets': '🐾',
  'Presentes': '🎁',
  'Consultas Médicas': '🩺',
  'Outros': '💸',
  'salario': '💼',
  'outro': '💰',
};

function fmt(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildChart() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!user) return;

  const gastosArray = user.gastosArray || [];
  const saldoArray  = user.saldoArray  || [];

  const chartSection = document.getElementById('chart-section');

  // Só mostra o gráfico se houver dados
  if (gastosArray.length === 0 && saldoArray.length === 0) {
    chartSection.style.display = 'none';
    return;
  }
  chartSection.style.display = 'block';

  // ── Totais para os stat boxes ──────────────────────────────────
  const totalReceitas  = saldoArray.reduce((s, x) => s + x.valor, 0);
  const totalDespesas  = gastosArray.reduce((s, x) => s + x.valor, 0);
  const saldoAtual     = user.saldo || 0;

  document.getElementById('chart-receitas').textContent  = fmt(totalReceitas);
  document.getElementById('chart-despesas').textContent  = fmt(totalDespesas);
  document.getElementById('chart-saldo-val').textContent = fmt(saldoAtual);

  // ── Agrupar por mês (YYYY-MM) ──────────────────────────────────
  const byMonth = {};

  saldoArray.forEach(item => {
    const m = item.data.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = { receita: 0, despesa: 0 };
    byMonth[m].receita += item.valor;
  });

  gastosArray.forEach(item => {
    const m = item.data.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = { receita: 0, despesa: 0 };
    byMonth[m].despesa += item.valor;
  });

  const months = Object.keys(byMonth).sort();

  // Título dinâmico
  if (months.length > 0) {
    const last = months[months.length - 1];
    const [y, mo] = last.split('-');
    const label = new Date(Number(y), Number(mo) - 1, 1)
      .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    document.getElementById('chart-period-title').textContent =
      label.charAt(0).toUpperCase() + label.slice(1);
  }

  // ── Barras ──────────────────────────────────────────────────────
  const maxVal = Math.max(
    ...months.map(m => Math.max(byMonth[m].receita, byMonth[m].despesa)),
    1
  );

  const barsContainer = document.getElementById('chart-bars');
  barsContainer.innerHTML = '';

  months.forEach(m => {
    const { receita, despesa } = byMonth[m];
    const [y, mo] = m.split('-');
    const shortLabel = new Date(Number(y), Number(mo) - 1, 1)
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '');

    const recH  = Math.max((receita  / maxVal) * 100, 4);
    const despH = Math.max((despesa  / maxVal) * 100, 4);

    const group = document.createElement('div');
    group.className = 'chart-bar-group';
    group.innerHTML = `
      <div class="chart-bar-pair">
        <div class="bar-col income"  style="height:${recH}px"  title="Receitas: ${fmt(receita)}"></div>
        <div class="bar-col expense" style="height:${despH}px" title="Despesas: ${fmt(despesa)}"></div>
      </div>
      <div class="chart-bar-label">${shortLabel}</div>
    `;
    barsContainer.appendChild(group);
  });

  // ── Transações recentes (últimas 3) ────────────────────────────
  const combined = [
    ...saldoArray.map(x  => ({ ...x, tipo: 'saldo'  })),
    ...gastosArray.map(x => ({ ...x, tipo: 'gasto'  })),
  ].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 3);

  const txList = document.getElementById('chart-tx-list');
  txList.innerHTML = '';

  combined.forEach(item => {
    const isIncome = item.tipo === 'saldo';
    const icon = isIncome
      ? (CATEGORY_ICONS[item.nome?.toLowerCase()] || CATEGORY_ICONS['outro'])
      : (CATEGORY_ICONS[item.categoria] || '💸');

    const dateFmt = new Date(item.data + 'T00:00:00')
      .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    const cat = isIncome ? 'Receita' : (item.categoria || 'Gasto');

    const row = document.createElement('div');
    row.className = 'chart-tx-row';
    row.innerHTML = `
      <div class="chart-tx-left">
        <div class="chart-tx-icon">${icon}</div>
        <div class="chart-tx-info">
          <div class="chart-tx-name">${item.nome}</div>
          <div class="chart-tx-cat">${cat} · ${dateFmt}</div>
        </div>
      </div>
      <div class="chart-tx-amount ${isIncome ? 'income' : 'expense'}">
        ${isIncome ? '+' : '−'} ${fmt(item.valor)}
      </div>
    `;
    txList.appendChild(row);
  });
}

// Roda ao carregar e "escuta" mudanças no storage (caso script.js atualize)
document.addEventListener('DOMContentLoaded', buildChart);

// Reage a atualizações feitas pelo script.js sem precisar modificá-lo
const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  _origSetItem(key, value);
  if (key === 'usuarioLogado') {
    buildChart();
  }
};
