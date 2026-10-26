//importando o express
import express from "express";
//importando os models
import Cidade from "../models/Cidade.js";
import Rota from "../models/Rota.js";
import Viagem from "../models/Viagem.js";
import Favorito from "../models/Favorito.js";
import Alerta from "../models/Alerta.js";
import { exigirConta } from "../middleware/auth.js";
const rota = express.Router();

// ROTA FAVORITOS
rota.get("/favoritos", exigirConta, async (req, res) => {
  const usuarioId = req.session.usuario.id;
  try {
    const [favoritos, cidades, alertas] = await Promise.all([
      Favorito.findAll({
        where: { usuario_id: usuarioId },
        include: [{ model: Rota, as: "rota", include: [{ model: Cidade, as: "origem" }, { model: Cidade, as: "destino" }] }],
      }),
      Cidade.findAll({ order: [["nome", "ASC"]] }),
      Alerta.findAll({ where: { usuario_id: usuarioId }, include: [{ model: Viagem, as: "viagem" }] }),
    ]);
    //contando quantos alertas ativos existem em cada rota favorita
    const total = {};
    alertas.forEach((a) => { total[a.viagem.rota_id] = (total[a.viagem.rota_id] || 0) + 1; });
    res.render("favoritos", { favoritos, cidades, total });
  } catch (error) {
    console.log(`Ocorreu um erro ao listar os favoritos. Erro: ${error}`);
    res.status(500).send("Erro ao listar os favoritos.");
  }
});

//ROTA DE CADASTRO DE FAVORITO
rota.post("/favoritos/adicionar", exigirConta, async (req, res) => {
  const { origem, destino, observacao } = req.body;
  const voltar = (texto) => res.redirect("/favoritos?erro=" + encodeURIComponent(texto));
  if (!origem || !destino || origem === destino) return voltar("Origem e destino devem ser diferentes.");
  try {
    const r = await Rota.findOne({ where: { origem_id: origem, destino_id: destino } });
    if (!r) return voltar("Rota não encontrada.");
    //findOrCreate evita favoritos repetidos
    await Favorito.findOrCreate({
      where: { usuario_id: req.session.usuario.id, rota_id: r.id },
      defaults: { observacao: (observacao || "").trim() || "Uso ocasional" },
    });
    res.redirect("/favoritos?msg=" + encodeURIComponent("Rota favoritada!"));
  } catch (error) {
    console.log(`Ocorreu um erro ao favoritar. Erro: ${error}`);
    voltar("Erro ao favoritar a rota.");
  }
});

//ROTA QUE FAVORITA/DESFAVORITA (botão na tela da viagem)
rota.get("/favoritos/alternar/:rotaId", exigirConta, async (req, res) => {
  const where = { usuario_id: req.session.usuario.id, rota_id: req.params.rotaId };
  try {
    const existe = await Favorito.findOne({ where });
    if (existe) await existe.destroy();
    else await Favorito.create(where);
    res.redirect(req.get("Referer") || "/favoritos");
  } catch (error) {
    console.log(`Ocorreu um erro ao alternar o favorito. Erro: ${error}`);
    res.redirect("/favoritos");
  }
});

//ROTA PARA EXCLUIR UM FAVORITO
rota.get("/favoritos/excluir/:id", exigirConta, async (req, res) => {
  try {
    //o usuario_id no where impede apagar favorito de outra pessoa
    await Favorito.destroy({ where: { id: req.params.id, usuario_id: req.session.usuario.id } });
    res.redirect("/favoritos");
  } catch (error) {
    console.log(`Ocorreu um erro ao excluir o favorito. Erro: ${error}`);
    res.redirect("/favoritos");
  }
});

export default rota;
