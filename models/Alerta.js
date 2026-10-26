//Model Alerta (aviso configurado por um usuário para uma viagem)
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Alerta = connection.define("alertas", {
  //tipos separados por vírgula. Ex: "Atraso,Cancelamento"
  tipos: { type: Sequelize.STRING, allowNull: false },
  //Chaves estrangeiras
  usuario_id: { type: Sequelize.INTEGER, allowNull: false },
  viagem_id: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: "alertas" });

export default Alerta;
