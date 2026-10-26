//Model Busca (histórico de buscas, usado em "Rotas Frequentes")
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Busca = connection.define("buscas", {
  //Chaves estrangeiras
  usuario_id: { type: Sequelize.INTEGER, allowNull: false },
  rota_id: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: "buscas" });

export default Busca;
