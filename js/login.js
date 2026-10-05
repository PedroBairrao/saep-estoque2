if (Auth.usuario()) location.replace("index.html");

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;

  if (!login.trim() || !senha) {
    mostrarAviso("erro", "Informe login e senha.");
    return;
  }
  if (await Auth.entrar(login, senha)) {
    location.href = "index.html";
  } else {
    mostrarAviso("erro", "Login ou senha incorretos.");
    document.getElementById("senha").value = "";
    document.getElementById("senha").focus();
  }
});
