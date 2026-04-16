# Lista de Testes — Sistema de Controle de Gastos Pessoais

---

## Autenticação — Cadastro

- [X] **#01** — Cadastro com todos os campos válidos → Usuário salvo no localStorage, redirecionado para login
- [X] **#02** — Cadastro com e-mail já existente → Toast de erro: "E-mail já cadastrado"
- [X] **#03** — Cadastro com telefone já existente → Toast de erro: "Telefone já cadastrado"
- [X] **#04** — Senha sem letra maiúscula → Feedback de fraqueza na senha, botão bloqueado
- [X] **#05** — Senha sem número → Feedback de fraqueza na senha
- [X] **#06** — Senha sem caractere especial → Feedback de fraqueza na senha
- [X] **#07** — Senha com menos de 8 caracteres → Feedback de fraqueza na senha
- [X] **#08** — Campos obrigatórios em branco → Formulário não enviado, campos destacados
- [X] **#09** — Formato de telefone aplicado automaticamente → Input formatado como `(11) 99999-9999`
- [X] **#10** — Termos não aceitos → Cadastro bloqueado

---

## Autenticação — Login

- [X] **#11** — Login com credenciais corretas → Sessão criada, redirecionado para dashboard
- [X] **#12** — Login com e-mail inexistente → Toast de erro
- [X] **#13** — Login com senha incorreta → Toast de erro
- [X] **#14** — Campos em branco → Formulário não enviado
- [X] **#15** — Toggle de visualização de senha → Campo alterna entre `password` e `text`

---

## Gestão de Receitas

- [X] **#16** — Adicionar salário com valor válido → Transação salva, saldo atualizado
- [X] **#17** — Adicionar receita com nome customizado → Entrada listada com nome correto
- [X] **#18** — Adicionar receita com data futura → Bloqueado, mensagem de erro
- [X] **#19** — Adicionar receita com valor R$0 ou negativo → Bloqueado, mensagem de erro
- [X] **#20** — Editar uma receita existente → Dados atualizados no localStorage e na lista
- [X] **#21** — Cancelar edição de receita → Nenhuma alteração salva

---

## Gestão de Gastos — CRUD

- [X] **#22** — Adicionar gasto com todos os campos válidos → Gasto salvo, saldo e total atualizados
- [X] **#23** — Adicionar gasto sem nome → Bloqueado, campo destacado
- [X] **#24** — Adicionar gasto sem categoria → Bloqueado
- [X] **#25** — Adicionar gasto com data futura → Bloqueado
- [X] **#26** — Editar gasto existente → Dados alterados corretamente
- [X] **#27** — Deletar gasto com confirmação → Gasto removido, saldo recalculado
- [X] **#28** — Cancelar deleção de gasto → Gasto mantido intacto
- [X] **#29** — Deletar última receita → Saldo zerado corretamente

---

## Filtros

- [X] **#30** — Filtrar apenas por gastos → Somente despesas listadas
- [X] **#31** — Filtrar apenas por receitas → Somente receitas listadas
- [X] **#32** — Filtrar por categoria "Supermercado" → Somente gastos dessa categoria
- [X] **#33** — Filtrar por intervalo de valor (ex: R$50–R$200) → Somente transações nesse range
- [X] **#34** — Filtrar por intervalo de datas → Somente transações no período
- [X] **#35** — Limpar filtros → Lista volta ao estado original completo
- [X] **#36** — Filtro sem resultados → Mensagem de "nenhum resultado"

---

## Visualização — Gráfico

- [X] **#37** — Gráfico renderiza ao entrar no dashboard → Barras exibidas corretamente
- [X] **#38** — Navegar para o mês anterior → Gráfico atualiza com dados do mês
- [X] **#39** — Navegar para o mês seguinte → Gráfico atualiza ou desabilita se não há próximo mês
- [X] **#40** — Hover em dia com gasto → Tooltip mostra valor e saldo hipotético
- [X] **#41** — Mês sem nenhuma transação → Gráfico exibe barras zeradas

---

## Cards de Resumo

- [] **#42** — Saldo exibido após adicionar receita → Card "Saldo" atualizado corretamente
- [X] **#43** — Total de gastos após adicionar despesa → Card "Gastos Totais" atualizado
- [X] **#44** — Saldo negativo (gastos > receitas) → Saldo exibido em vermelho ou sinalizado

---

## Persistência (localStorage)

- [X] **#45** — Recarregar a página após adicionar dados → Todos os dados persistem
- [X] **#46** — Fazer logout e login novamente → Dados do usuário corretos carregados
- [X] **#47** — Dois usuários distintos no mesmo navegador → Dados de cada usuário são isolados

---

## Notificações

- [X] **#48** — Toast de sucesso exibido → Aparece em verde, desaparece em 3s
- [X] **#49** — Toast de erro exibido → Aparece em vermelho, desaparece em 3s
- [X] **#50** — Confirmação aceita → Retorna `true`, ação executada
- [X] **#51** — Confirmação cancelada → Retorna `false`, nada acontece

---

**Total: 51 testes** | Concluídos: 0 / 51
