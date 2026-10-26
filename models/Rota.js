//Model Rota (origem -> destino)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Rota = connection.define("rotas", {
  //Chaves estrangeiras (ambas apontam para a tabela cidades)
  origem_id: { type: Sequelize.INTEGER, allowNull: false },
  destino_id: { type: Sequelize.INTEGER, allowNull: false },
}, {
  tableName: "rotas",
  indexes: [{ unique: true, fields: ["origem_id", "destino_id"] }],
});

export default Rota;
