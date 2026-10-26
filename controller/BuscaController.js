//importando o express
import express from "express";
import Sequelize from "sequelize";
//importando os models
import Cidade from "../models/Cidade.js";
import Rota from "../models/Rota.js";
import Viagem from "../models/Viagem.js";
import Parada from "../models/Parada.js";
import Favorito from "../models/Favorito.js";
import Busca from "../models/Busca.js";
import { exigirLogin } from "../middleware/auth.js";
import { hojeISO } from "../config/helpers.js";
const rota = express.Router();

//trazendo origem e destino junto com a rota (join)
const incluirCidades = [
  { model: Cidade, as: "origem" },
  { model: Cidade, as: "destino" },
];

// ROTA BUSCAR (tela inicial depois do login)
rota.get("/buscar", exigirLogin, async (req, res) => {
  try {
    const cidades = await Cidade.findAll({ order: [["nome", "ASC"]] });
    const u = req.session.usuario;
    const frequentes = [];
    if (!u.visitante) {
      //Equivalente ao SELECT rota_id, COUNT(*) ... GROUP BY rota_id
      const grupos = await Busca.findAll({
        where: { usuario_id: u.id },
        attributes: ["rota_id", [Sequelize.fn("COUNT", "*"), "total"]],
        group: ["rota_id"],
        order: [[Sequelize.literal("total"), "DESC"]],
        limit: 2,
        raw: true,
      });
      for (const g of grupos) {
        const r = await Rota.findByPk(g.rota_id, { include: incluirCidades });
        frequentes.push({ rota: r, total: g.total });
      }
    }
    res.render("buscar", { cidades, frequentes, hoje: hojeISO() });
  } catch (error) {
    console.log(`Ocorreu um erro ao abrir a busca. Erro: ${error}`);
    res.status(500).send("Erro ao abrir a busca.");
  }
});

// ROTA HORÁRIOS (resultado da busca)
rota.get("/horarios", exigirLogin, async (req, res) => {
  const { origem, destino, periodo = "", empresa = "", data = hojeISO() } = req.query;
  const voltar = (texto) => res.redirect("/buscar?erro=" + encodeURIComponent(texto));
  if (!origem || !destino) return voltar("Escolha origem e destino.");
  if (origem === destino) return voltar("Origem e destino devem ser diferentes.");
  try {
    const r = await Rota.findOne({
      where: { origem_id: origem, destino_id: destino },
      include: incluirCidades,
    });
    if (!r) return voltar("Rota não encontrada.");

    //guardando a busca para a lista de "Rotas Frequentes"
    const u = req.session.usuario;
    if (!u.visitante && !empresa) await Busca.create({ usuario_id: u.id, rota_id: r.id });

    const todas = await Viagem.findAll({ where: { rota_id: r.id }, order: [["horario", "ASC"]] });
    const empresas = [...new Set(todas.map((v) => v.empresa))];
    const viagens = todas.filter((v) => {
      if (periodo === "manha" && v.horario >= "12:00") return false;
      if (periodo === "tarde" && v.horario < "12:00") return false;
      if (empresa && v.empresa !== empresa) return false;
      return true;
    });
    res.render("horarios", { rota: r, viagens, empresas, periodo, empresa, data });
  } catch (error) {
    console.log(`Ocorreu um erro ao listar os horários. Erro: ${error}`);
    voltar("Erro ao buscar horários.");
  }
});

// ROTA DETALHE DA VIAGEM (mapa, previsão de atraso e paradas)
rota.get("/rota/:id", exigirLogin, async (req, res) => {
  try {
    const viagem = await Viagem.findByPk(req.params.id, {
      include: [
        { model: Rota, as: "rota", include: incluirCidades },
        { model: Parada, as: "paradas" },
      ],
      order: [[{ model: Parada, as: "paradas" }, "ordem", "ASC"]],
    });
    if (!viagem) return res.redirect("/buscar?erro=" + encodeURIComponent("Viagem não encontrada."));

    const u = req.session.usuario;
    let favorito = null;
    if (!u.visitante) favorito = await Favorito.findOne({ where: { usuario_id: u.id, rota_id: viagem.rota_id } });
    res.render("rota", { viagem, favorito });
  } catch (error) {
    console.log(`Ocorreu um erro ao abrir a viagem. Erro: ${error}`);
    res.status(500).send("Erro ao abrir a viagem.");
  }
});

// API (JSON) usada pelo JavaScript da tela de alertas
rota.get("/api/viagens", exigirLogin, async (req, res) => {
  try {
    const r = await Rota.findOne({ where: { origem_id: req.query.origem, destino_id: req.query.destino } });
    if (!r) return res.json([]);
    const viagens = await Viagem.findAll({ where: { rota_id: r.id }, order: [["horario", "ASC"]] });
    res.json(viagens.map((v) => ({ id: v.id, horario: v.horario, linha: v.linha, empresa: v.empresa })));
  } catch (error) {
    res.status(500).json([]);
  }
});

export default rota;
