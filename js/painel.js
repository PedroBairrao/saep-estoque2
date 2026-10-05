Auth.exigirLogin();
renderTopo("painel");

const r = DB.resumo();
document.getElementById("resumo").innerHTML = `
  <div class="dado"><span class="num">${r.produtos}</span><span>produtos cadastrados</span></div>
  <div class="dado"><span class="num">${r.unidades}</span><span>unidades em estoque</span></div>
  <div class="dado"><span class="num">${esc(brl(r.valor))}</span><span>valor em estoque</span></div>
  <div class="dado ${r.alertas ? "dado-alerta" : ""}"><span class="num">${r.alertas}</span><span>abaixo do mínimo</span></div>`;

const alertas = DB.emAlerta();
document.getElementById("alertas").innerHTML = alertas.length
  ? `<div class="tabela-rolagem"><table>
      <thead><tr><th>Produto</th><th>Categoria</th><th class="num-col">Em estoque</th><th class="num-col">Mínimo</th><th class="num-col">Faltam</th></tr></thead>
      <tbody>${alertas.map((p) => `
        <tr>
          <td><a href="produtos.html?q=${encodeURIComponent(p.nome)}">${esc(p.nome)}</a></td>
          <td>${esc(p.categoria)}</td>
          <td class="num-col"><span class="selo selo-alerta">${p.quantidade}</span></td>
          <td class="num-col">${p.estoque_minimo}</td>
          <td class="num-col">${p.estoque_minimo - p.quantidade}</td>
        </tr>`).join("")}
      </tbody></table></div>`
  : `<p class="vazio">Nenhum produto abaixo do estoque mínimo.</p>`;
