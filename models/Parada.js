//Model Parada (paradas de uma viagem)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Parada = connection.define("paradas", {
  nome: { type: Sequelize.STRING, allowNull: false },
  //minutos após a partida
  minutos: { type: Sequelize.INTEGER, allowNull: false },
  ordem: { type: Sequelize.INTEGER, allowNull: false },
  //Chave estrangeira
  viagem_id: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: "paradas" });

export default Parada;
