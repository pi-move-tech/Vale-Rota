//importando o express
import express from "express";
//importando a biblioteca que criptografa senhas
import bcrypt from "bcryptjs";
//importando o model
import Usuario from "../models/Usuario.js";
const rota = express.Router();

// ROTA PRINCIPAL (tela de login)
rota.get("/", function (req, res) {
  if (req.session.usuario) return res.redirect("/buscar");
  res.render("login");
});

//ROTA DE LOGIN
rota.post("/login", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const senha = req.body.senha || "";
  try {
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return res.render("login", { erro: "E-mail ou senha incorretos." });
    }
    req.session.usuario = { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, visitante: false };
    res.redirect("/buscar");
  } catch (error) {
    console.log(`Ocorreu um erro ao fazer login. Erro: ${error}`);
    res.render("login", { erro: "Erro ao fazer login. Tente novamente." });
  }
});

//ROTA DE CRIAÇÃO DE CONTA
rota.post("/cadastrar", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const senha = req.body.senha || "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.render("login", { erro: "Informe um e-mail válido." });
  if (senha.length < 4) return res.render("login", { erro: "A senha precisa ter ao menos 4 caracteres." });
  try {
    const existe = await Usuario.findOne({ where: { email: email } });
    if (existe) return res.render("login", { erro: "Este e-mail já está cadastrado. Clique em Entrar." });
    //criptografando a senha antes de gravar no banco
    const hash = bcrypt.hashSync(senha, 10);
    const usuario = await Usuario.create({ nome: email.split("@")[0], email: email, senha: hash });
    req.session.usuario = { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo, visitante: false };
    res.redirect("/buscar?msg=" + encodeURIComponent("Conta criada com sucesso!"));
  } catch (error) {
    console.log(`Ocorreu um erro ao criar a conta. Erro: ${error}`);
    res.render("login", { erro: "Erro ao criar a conta. Tente novamente." });
  }
});

//ROTA DE ENTRAR COMO VISITANTE
rota.get("/visitante", (req, res) => {
  req.session.usuario = { nome: "Visitante", tipo: "Visitante", visitante: true };
  res.redirect("/buscar");
});

//ROTA DE SAIR DA CONTA
rota.get("/sair", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

export default rota;
