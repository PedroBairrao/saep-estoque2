/* Funções de interface compartilhadas. */
function esc(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function brl(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderTopo(ativa) {
  const u = Auth.usuario();
  const topo = document.getElementById("topo");
  topo.innerHTML = `
    <a class="marca" href="index.html">Estoque</a>
    <nav>
      <a href="index.html" ${ativa === "painel" ? 'aria-current="page"' : ""}>Painel</a>
      <a href="produtos.html" ${ativa === "produtos" ? 'aria-current="page"' : ""}>Produtos</a>
    </nav>
    <div class="sair"><span>${esc(u.nome)}</span><button type="button" class="btn btn-leve" id="btn-sair">Sair</button></div>`;
  document.getElementById("btn-sair").addEventListener("click", Auth.sair);
}

function mostrarAviso(tipo, texto) {
  const area = document.getElementById("avisos");
  area.innerHTML = `<p class="aviso aviso-${tipo}">${esc(texto)}</p>`;
}
