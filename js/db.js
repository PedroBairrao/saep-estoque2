/* Camada de dados do sistema de estoque.
   Guarda tudo no localStorage do navegador, começando com os mesmos dados do estoque.db.
   Tabelas: usuarios, categorias, produtos, movimentacoes. */
const DB = (() => {
  const CHAVE = "estoque_db_v1";

  const SEMENTE = {
    usuarios: [
      { id: 1, nome: "Administrador", login: "admin", senha_hash: "bf6b5bdb74c79ece9fc0ad0ac9fb0359f9555d4f35a83b2e6ec69ae99e09603d" },
      { id: 2, nome: "Maria Souza", login: "maria", senha_hash: "734f68a9fb7bc1918b8d11bd7cc8e31505a771b47e3a9c7cb248291842f6c67f" },
    ],
    categorias: [
      { id: 1, nome: "Smartphone" },
      { id: 2, nome: "Notebook" },
      { id: 3, nome: "Smart TV" },
      { id: 4, nome: "Acessório" },
    ],
    produtos: [
      { id: 1, nome: "Galaxy S24 128GB", categoria_id: 1, especificacoes: '6.2" AMOLED; 128GB; 5G; Bivolt', preco: 4299.9, quantidade: 8, estoque_minimo: 5 },
      { id: 2, nome: "iPhone 15 256GB", categoria_id: 1, especificacoes: '6.1" OLED; 256GB; 5G; USB-C', preco: 6499.0, quantidade: 3, estoque_minimo: 4 },
      { id: 3, nome: "Moto G54 256GB", categoria_id: 1, especificacoes: '6.5" LCD 120Hz; 256GB; 5G', preco: 1399.0, quantidade: 25, estoque_minimo: 8 },
      { id: 4, nome: "Notebook Dell Inspiron 15", categoria_id: 2, especificacoes: 'i5 13ª ger.; 16GB RAM; SSD 512GB; 15.6" FHD; 19V', preco: 3899.0, quantidade: 6, estoque_minimo: 3 },
      { id: 5, nome: "Notebook Lenovo IdeaPad 3", categoria_id: 2, especificacoes: 'Ryzen 5; 8GB RAM; SSD 256GB; 15.6" FHD', preco: 2799.0, quantidade: 3, estoque_minimo: 3 },
      { id: 6, nome: "MacBook Air M2", categoria_id: 2, especificacoes: 'M2; 8GB; SSD 256GB; 13.6" Retina', preco: 8999.0, quantidade: 1, estoque_minimo: 2 },
      { id: 7, nome: 'Smart TV LG 50" 4K', categoria_id: 3, especificacoes: '50"; 3840x2160; WebOS; 3 HDMI; 110-240V', preco: 2599.0, quantidade: 10, estoque_minimo: 4 },
      { id: 8, nome: 'Smart TV Samsung 55" QLED', categoria_id: 3, especificacoes: '55"; 4K QLED; Tizen; Wi-Fi/Bluetooth', preco: 3799.0, quantidade: 5, estoque_minimo: 3 },
      { id: 9, nome: 'Smart TV TCL 32" HD', categoria_id: 3, especificacoes: '32"; 1366x768; Google TV', preco: 1099.0, quantidade: 11, estoque_minimo: 5 },
      { id: 10, nome: "Carregador USB-C 65W", categoria_id: 4, especificacoes: "65W; GaN; Bivolt", preco: 149.9, quantidade: 15, estoque_minimo: 10 },
      { id: 11, nome: "Fone Bluetooth JBL Tune", categoria_id: 4, especificacoes: "Bluetooth 5.3; 40h bateria", preco: 249.0, quantidade: 17, estoque_minimo: 10 },
      { id: 12, nome: "Mouse sem fio Logitech", categoria_id: 4, especificacoes: "2.4GHz; 1000dpi", preco: 89.9, quantidade: 2, estoque_minimo: 6 },
    ],
    // [id, produto_id, usuario_id, tipo, quantidade, observacao]
    movimentacoes: [
      [1, 1, 1, "ENTRADA", 20, "Compra inicial"], [2, 1, 2, "SAIDA", 12, "Vendas da semana"],
      [3, 2, 1, "ENTRADA", 10, "Compra inicial"], [4, 2, 2, "SAIDA", 7, "Vendas"],
      [5, 3, 1, "ENTRADA", 30, "Compra inicial"], [6, 3, 2, "SAIDA", 5, "Vendas"],
      [7, 4, 1, "ENTRADA", 8, "Compra inicial"], [8, 4, 2, "SAIDA", 2, "Venda corporativa"],
      [9, 5, 1, "ENTRADA", 6, "Compra inicial"], [10, 5, 2, "SAIDA", 3, "Vendas"],
      [11, 6, 1, "ENTRADA", 4, "Compra inicial"], [12, 6, 2, "SAIDA", 3, "Vendas"],
      [13, 7, 1, "ENTRADA", 12, "Compra inicial"], [14, 7, 2, "SAIDA", 2, "Vendas"],
      [15, 8, 1, "ENTRADA", 6, "Compra inicial"], [16, 8, 2, "SAIDA", 1, "Vendas"],
      [17, 9, 1, "ENTRADA", 15, "Compra inicial"], [18, 9, 2, "SAIDA", 4, "Vendas"],
      [19, 10, 1, "ENTRADA", 40, "Compra inicial"], [20, 10, 2, "SAIDA", 25, "Vendas"],
      [21, 11, 1, "ENTRADA", 25, "Compra inicial"], [22, 11, 2, "SAIDA", 8, "Vendas"],
      [23, 12, 1, "ENTRADA", 3, "Compra inicial"], [24, 12, 2, "SAIDA", 1, "Venda"],
    ].map(([id, produto_id, usuario_id, tipo, quantidade, observacao]) => ({
      id, produto_id, usuario_id, tipo, quantidade, data_hora: "2026-09-28 01:35:12", observacao,
    })),
  };

  let memoria = null; // usado se o localStorage estiver bloqueado

  function copiar(obj) { return JSON.parse(JSON.stringify(obj)); }

  function carregar() {
    if (memoria) return memoria;
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) return JSON.parse(bruto);
    } catch (e) { /* segue para a semente */ }
    const dados = copiar(SEMENTE);
    salvar(dados);
    return dados;
  }

  function salvar(dados) {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); memoria = null; }
    catch (e) { memoria = dados; }
  }

  function proximoId(lista) { return lista.reduce((m, x) => Math.max(m, x.id), 0) + 1; }

  // compara sem acento e sem diferenciar maiúsculas
  function normalizar(t) {
    return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /* ---------- consultas ---------- */
  function usuarioPorLogin(login) {
    return carregar().usuarios.find((u) => u.login === login) || null;
  }

  function categorias() {
    return carregar().categorias.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function comCategoria(d, p) {
    const c = d.categorias.find((x) => x.id === p.categoria_id);
    return { ...p, categoria: c ? c.nome : "" };
  }

  function produtos(termo = "") {
    const d = carregar();
    const q = normalizar(termo.trim());
    return d.produtos
      .map((p) => comCategoria(d, p))
      .filter((p) => !q || [p.nome, p.categoria, p.especificacoes].some((c) => normalizar(c).includes(q)))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function produto(id) {
    const d = carregar();
    const p = d.produtos.find((x) => x.id === id);
    return p ? comCategoria(d, p) : null;
  }

  function emAlerta() {
    return produtos().filter((p) => p.quantidade < p.estoque_minimo) // RN02
      .sort((a, b) => (b.estoque_minimo - b.quantidade) - (a.estoque_minimo - a.quantidade) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function resumo() {
    const lista = carregar().produtos;
    return {
      produtos: lista.length,
      unidades: lista.reduce((s, p) => s + p.quantidade, 0),
      valor: lista.reduce((s, p) => s + p.quantidade * p.preco, 0),
      alertas: lista.filter((p) => p.quantidade < p.estoque_minimo).length,
    };
  }

  /* ---------- validação (RNF02) ---------- */
  function validarProduto(entrada) {
    const erros = [];
    const nome = String(entrada.nome || "").trim();
    const especificacoes = String(entrada.especificacoes || "").trim();
    const categoria_id = Number(entrada.categoria_id);
    const preco = Number(String(entrada.preco).trim().replace(",", "."));
    const minimoTxt = String(entrada.estoque_minimo ?? "").trim() || "0";
    const estoque_minimo = Number(minimoTxt);

    if (!nome) erros.push("Informe o nome do produto.");
    if (!carregar().categorias.some((c) => c.id === categoria_id)) erros.push("Escolha uma categoria.");
    if (String(entrada.preco).trim() === "" || !Number.isFinite(preco) || preco < 0)
      erros.push("O preço deve ser um número maior ou igual a zero.");
    if (!/^\d+$/.test(minimoTxt))
      erros.push("O estoque mínimo deve ser um número inteiro maior ou igual a zero.");

    return { erros, dados: { nome, categoria_id, especificacoes, preco, estoque_minimo } };
  }

  /* ---------- CRUD de produtos ---------- */
  function criarProduto(entrada) {
    const { erros, dados } = validarProduto(entrada);
    if (erros.length) return { ok: false, erros };
    const d = carregar();
    // RN03: o saldo só muda por movimentação, então o produto nasce com 0.
    const novo = { id: proximoId(d.produtos), ...dados, quantidade: 0 };
    d.produtos.push(novo);
    salvar(d);
    return { ok: true, produto: novo };
  }

  function atualizarProduto(id, entrada) {
    const { erros, dados } = validarProduto(entrada);
    if (erros.length) return { ok: false, erros };
    const d = carregar();
    const p = d.produtos.find((x) => x.id === id);
    if (!p) return { ok: false, erros: ["Produto não encontrado."] };
    Object.assign(p, dados); // a quantidade fica intacta
    salvar(d);
    return { ok: true, produto: p };
  }

  function excluirProduto(id) {
    const d = carregar();
    const p = d.produtos.find((x) => x.id === id);
    if (!p) return { ok: false, erros: ["Produto não encontrado."] };
    // RF07: produto com movimentações não pode ser excluído.
    const movs = d.movimentacoes.filter((m) => m.produto_id === id).length;
    if (movs) return { ok: false, erros: [`“${p.nome}” tem ${movs} movimentações e não pode ser excluído.`] };
    d.produtos = d.produtos.filter((x) => x.id !== id);
    salvar(d);
    return { ok: true, produto: p };
  }

  function restaurarDadosIniciais() { memoria = null; salvar(copiar(SEMENTE)); }

  return { usuarioPorLogin, categorias, produtos, produto, emAlerta, resumo,
           criarProduto, atualizarProduto, excluirProduto, restaurarDadosIniciais };
})();

if (typeof module !== "undefined") module.exports = DB;
