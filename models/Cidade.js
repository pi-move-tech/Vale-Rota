//Model Cidade
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Cidade = connection.define("cidades", {
  nome: { type: Sequelize.STRING, allowNull: false, unique: true },
}, { tableName: "cidades" });

export default Cidade;
