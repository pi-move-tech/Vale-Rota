//importando o express
import express from "express";
//importando os models
import Usuario from "../models/Usuario.js";
import Cidade from "../models/Cidade.js";
import Relato from "../models/Relato.js";
import { exigirConta, exigirLogin } from "../middleware/auth.js";
const rota = express.Router();

const msg = (texto) => "msg=" + encodeURIComponent(texto);

// ROTA PERFIL (menu)
rota.get("/perfil", exigirLogin, (req, res) => {
  res.render("perfil");
});

//ROTA MEUS DADOS (formulário + gravação)
rota.get("/perfil/dados", exigirConta, async (req, res) => {
  const u = await Usuario.findByPk(req.session.usuario.id);
  res.render("perfilDados", { dados: u });
});
rota.post("/perfil/dados", exigirConta, async (req, res) => {
  const nome = (req.body.nome || "").trim() || "Usuário";
  try {
    await Usuario.update({ nome: nome, tipo: req.body.tipo }, { where: { id: req.session.usuario.id } });
    //atualizando também o que está guardado na sessão
    req.session.usuario.nome = nome;
    req.session.usuario.tipo = req.body.tipo;
    res.redirect("/perfil?" + msg("Dados salvos!"));
  } catch (error) {
    console.log(`Ocorreu um erro ao alterar os dados. Erro: ${error}`);
    res.redirect("/perfil/dados?erro=" + encodeURIComponent("Erro ao salvar os dados."));
  }
});

//ROTA NOTIFICAÇÕES
rota.get("/perfil/notificacoes", exigirConta, async (req, res) => {
  const u = await Usuario.findByPk(req.session.usuario.id);
  res.render("notificacoes", { ativas: u.notificacoes });
});
rota.post("/perfil/notificacoes", exigirConta, async (req, res) => {
  await Usuario.update({ notificacoes: req.body.notificacoes === "on" }, { where: { id: req.session.usuario.id } });
  res.redirect("/perfil?" + msg("Preferência salva!"));
});

//ROTA CIDADES DE INTERESSE (relacionamento N:N)
rota.get("/perfil/cidades", exigirConta, async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuario.id);
  const cidades = await Cidade.findAll({ order: [["nome", "ASC"]] });
  const minhas = (await usuario.getCidadesInteresse()).map((c) => c.id);
  res.render("cidades", { cidades, minhas });
});
rota.post("/perfil/cidades", exigirConta, async (req, res) => {
  const ids = [].concat(req.body.cidades || []).map(Number);
  const usuario = await Usuario.findByPk(req.session.usuario.id);
  //setCidadesInteresse troca todas as ligações do usuário de uma vez
  await usuario.setCidadesInteresse(ids);
  res.redirect("/perfil?" + msg("Cidades de interesse salvas!"));
});

//ROTA REPORTAR PROBLEMA
rota.get("/perfil/relatar", exigirConta, async (req, res) => {
  const relatos = await Relato.findAll({ where: { usuario_id: req.session.usuario.id }, order: [["id", "DESC"]] });
  res.render("relatar", { relatos });
});
rota.post("/perfil/relatar", exigirConta, async (req, res) => {
  const descricao = (req.body.descricao || "").trim();
  if (!descricao) return res.redirect("/perfil/relatar?erro=" + encodeURIComponent("Descreva o problema."));
  await Relato.create({ linha: req.body.linha, descricao: descricao, usuario_id: req.session.usuario.id });
  res.redirect("/perfil/relatar?" + msg("Problema reportado. Obrigado!"));
});

//ROTA SOBRE
rota.get("/perfil/sobre", exigirLogin, (req, res) => {
  res.render("sobre");
});

export default rota;
