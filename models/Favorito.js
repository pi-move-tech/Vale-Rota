//Model Favorito (rota favorita de um usuário)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Favorito = connection.define("favoritos", {
  observacao: { type: Sequelize.STRING, allowNull: false, defaultValue: "Uso ocasional" },
  //Chaves estrangeiras
  usuario_id: { type: Sequelize.INTEGER, allowNull: false },
  rota_id: { type: Sequelize.INTEGER, allowNull: false },
}, {
  tableName: "favoritos",
  indexes: [{ unique: true, fields: ["usuario_id", "rota_id"] }],
});

export default Favorito;
