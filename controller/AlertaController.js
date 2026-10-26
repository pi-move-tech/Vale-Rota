//importando o express
import express from "express";
//importando os models
import Cidade from "../models/Cidade.js";
import Rota from "../models/Rota.js";
import Viagem from "../models/Viagem.js";
import Alerta from "../models/Alerta.js";
import { exigirConta } from "../middleware/auth.js";
const rota = express.Router();

const TIPOS = ["Atraso", "Cancelamento", "Embarque"];

// ROTA ALERTAS (abas: novo alerta / alertas ativos)
rota.get("/alertas", exigirConta, async (req, res) => {
  const aba = req.query.aba === "ativos" ? "ativos" : "novo";
  try {
    const cidades = await Cidade.findAll({ order: [["nome", "ASC"]] });
    const alertas = await Alerta.findAll({
      where: { usuario_id: req.session.usuario.id },
      include: [{ model: Viagem, as: "viagem", include: [{ model: Rota, as: "rota", include: [{ model: Cidade, as: "origem" }, { model: Cidade, as: "destino" }] }] }],
      order: [["id", "DESC"]],
    });
    //viagem pré-selecionada (quando vem da tela da viagem)
    let selecionada = null;
    if (req.query.viagem) selecionada = await Viagem.findByPk(req.query.viagem, { include: [{ model: Rota, as: "rota" }] });
    res.render("alertas", { aba, cidades, alertas, selecionada, tipos: TIPOS });
  } catch (error) {
    console.log(`Ocorreu um erro ao listar os alertas. Erro: ${error}`);
    res.status(500).send("Erro ao listar os alertas.");
  }
});

//ROTA DE CADASTRO DE ALERTA
rota.post("/alertas/salvar", exigirConta, async (req, res) => {
  //checkboxes marcados chegam como texto (1) ou lista (vários)
  const tipos = [].concat(req.body.tipos || []).filter((t) => TIPOS.includes(t));
  const voltar = (texto) => res.redirect("/alertas?erro=" + encodeURIComponent(texto));
  if (!req.body.viagem_id) return voltar("Escolha uma viagem.");
  if (!tipos.length) return voltar("Escolha ao menos um tipo de aviso.");
  try {
    await Alerta.create({ usuario_id: req.session.usuario.id, viagem_id: req.body.viagem_id, tipos: tipos.join(",") });
    res.redirect("/alertas?aba=ativos&msg=" + encodeURIComponent("Alerta salvo!"));
  } catch (error) {
    console.log(`Ocorreu um erro ao salvar o alerta. Erro: ${error}`);
    voltar("Erro ao salvar o alerta.");
  }
});

//ROTA PARA EXCLUIR UM ALERTA
rota.get("/alertas/excluir/:id", exigirConta, async (req, res) => {
  try {
    await Alerta.destroy({ where: { id: req.params.id, usuario_id: req.session.usuario.id } });
    res.redirect("/alertas?aba=ativos");
  } catch (error) {
    console.log(`Ocorreu um erro ao excluir o alerta. Erro: ${error}`);
    res.redirect("/alertas?aba=ativos");
  }
});

export default rota;
