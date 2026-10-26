//Model Viagem (um horário de ônibus de uma rota)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Viagem = connection.define("viagens", {
  horario: { type: Sequelize.STRING(5), allowNull: false },
  empresa: { type: Sequelize.STRING, allowNull: false },
  linha: { type: Sequelize.STRING, allowNull: false },
  duracao: { type: Sequelize.INTEGER, allowNull: false },
  //atraso previsto em minutos (0 = no horário)
  atraso: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  //Chave estrangeira
  rota_id: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: "viagens" });

export default Viagem;
