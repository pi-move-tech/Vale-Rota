//Model Relato (problema reportado em uma linha)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Relato = connection.define("relatos", {
  linha: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.TEXT, allowNull: false },
  //Chave estrangeira
  usuario_id: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: "relatos" });

export default Relato;
