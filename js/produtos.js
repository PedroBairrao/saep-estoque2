Auth.exigirLogin();
renderTopo("produtos");

const $ = (id) => document.getElementById(id);
const dlg = $("dlg-produto");
let editandoId = null; // null = cadastrando

/* ---------- lista e busca (RF04, RF05) ---------- */
function desenharLista() {
  const termo = $("q").value;
  $("btn-limpar").hidden = !termo.trim();
  const lista = DB.produtos(termo);

  if (!lista.length) {
    $("lista").innerHTML = termo.trim()
      ? `<p class="vazio">Nenhum produto encontrado para “${esc(termo)}”. Tente outro termo.</p>`
      : `<p class="vazio">Nenhum produto cadastrado. Comece em “Novo produto”.</p>`;
    return;
  }

  $("lista").innerHTML = `<div class="tabela-rolagem"><table>
    <thead><tr><th>Produto</th><th>Categoria</th><th class="num-col">Preço</th><th class="num-col">Em estoque</th><th class="num-col">Mínimo</th><th><span class="oculto">Ações</span></th></tr></thead>
    <tbody>${lista.map((p) => `
      <tr>
        <td><strong>${esc(p.nome)}</strong>${p.especificacoes ? `<div class="espec">${esc(p.especificacoes)}</div>` : ""}</td>
        <td>${esc(p.categoria)}</td>
        <td class="num-col">${esc(brl(p.preco))}</td>
        <td class="num-col">${p.quantidade < p.estoque_minimo
          ? `<span class="selo selo-alerta" title="Abaixo do estoque mínimo">${p.quantidade} · repor</span>`
          : p.quantidade}</td>
        <td class="num-col">${p.estoque_minimo}</td>
        <td class="acoes">
          <button type="button" class="btn btn-leve" data-acao="editar" data-id="${p.id}">Editar</button>
          <button type="button" class="btn btn-perigo" data-acao="excluir" data-id="${p.id}">Excluir</button>
        </td>
      </tr>`).join("")}
    </tbody></table></div>`;
}

$("form-busca").addEventListener("submit", (e) => { e.preventDefault(); desenharLista(); });
$("q").addEventListener("input", desenharLista);
$("btn-limpar").addEventListener("click", () => { $("q").value = ""; desenharLista(); $("q").focus(); });

$("lista").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-acao]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.acao === "editar") abrirFormulario(id);
  if (btn.dataset.acao === "excluir") excluir(id);
});

/* ---------- formulário (RF03, RF06) ---------- */
function abrirFormulario(id = null) {
  editandoId = id;
  const p = id ? DB.produto(id) : null;

  $("f-categoria").innerHTML = `<option value="">Escolha uma categoria</option>` +
    DB.categorias().map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join("");

  $("dlg-titulo").textContent = p ? "Editar produto" : "Novo produto";
  $("f-salvar").textContent = p ? "Salvar alterações" : "Cadastrar produto";
  $("f-nome").value = p ? p.nome : "";
  $("f-categoria").value = p ? p.categoria_id : "";
  $("f-espec").value = p ? p.especificacoes : "";
  $("f-preco").value = p ? String(p.preco).replace(".", ",") : "";
  $("f-minimo").value = p ? p.estoque_minimo : 0;
  $("f-dica").innerHTML = p
    ? `Em estoque agora: <strong>${p.quantidade}</strong>. O saldo muda apenas com entradas e saídas.`
    : "O produto começa com saldo 0. Registre uma entrada para adicionar unidades.";
  $("erros-form").innerHTML = "";
  dlg.showModal();
  $("f-nome").focus();
}

$("btn-novo").addEventListener("click", () => abrirFormulario());
$("f-cancelar").addEventListener("click", () => dlg.close());

$("form-produto").addEventListener("submit", (e) => {
  e.preventDefault();
  const entrada = {
    nome: $("f-nome").value,
    categoria_id: $("f-categoria").value,
    especificacoes: $("f-espec").value,
    preco: $("f-preco").value,
    estoque_minimo: $("f-minimo").value,
  };
  const r = editandoId ? DB.atualizarProduto(editandoId, entrada) : DB.criarProduto(entrada);

  if (!r.ok) {
    $("erros-form").innerHTML = r.erros.map((m) => `<p class="aviso aviso-erro">${esc(m)}</p>`).join("");
    return;
  }
  dlg.close();
  mostrarAviso("ok", `Produto “${r.produto.nome}” ${editandoId ? "atualizado" : "cadastrado"}.`);
  desenharLista();
});

/* ---------- exclusão (RF07) ---------- */
function excluir(id) {
  const p = DB.produto(id);
  if (!p || !confirm(`Excluir “${p.nome}”?`)) return;
  const r = DB.excluirProduto(id);
  if (r.ok) mostrarAviso("ok", `Produto “${p.nome}” excluído.`);
  else mostrarAviso("erro", r.erros[0]);
  desenharLista();
}

// permite abrir já filtrado (link vindo do painel)
const qInicial = new URLSearchParams(location.search).get("q");
if (qInicial) $("q").value = qInicial;
desenharLista();
