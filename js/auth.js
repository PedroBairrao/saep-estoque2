/* Autenticação (RF01, RF02, RF13). A sessão fica no sessionStorage:
   fecha a aba, encerra a sessão. */
const Auth = (() => {
  const CHAVE = "estoque_sessao";

  // Hash SHA-256 de "login:senha". Senha nunca fica em texto puro (RNF04).
  async function hash(login, senha) {
    const bytes = new TextEncoder().encode(`${login}:${senha}`);
    const resumo = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(resumo)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function entrar(login, senha) {
    const usuario = DB.usuarioPorLogin(login.trim());
    if (!usuario) return false;
    if ((await hash(usuario.login, senha)) !== usuario.senha_hash) return false;
    sessionStorage.setItem(CHAVE, JSON.stringify({ id: usuario.id, nome: usuario.nome }));
    return true;
  }

  function usuario() {
    try { return JSON.parse(sessionStorage.getItem(CHAVE)); } catch (e) { return null; }
  }

  // Chame no topo de toda página protegida (RF02).
  function exigirLogin() {
    if (!usuario()) {
      location.replace("login.html");
      throw new Error("Sessão não iniciada");
    }
  }

  function sair() {
    sessionStorage.removeItem(CHAVE);
    location.href = "login.html";
  }

  return { entrar, usuario, exigirLogin, sair };
})();
