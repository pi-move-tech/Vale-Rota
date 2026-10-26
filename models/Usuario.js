//Model Usuario
import connection from "../config/sequelize-config.js";
import Sequelize from "sequelize";

const Usuario = connection.define("usuarios", {
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  senha: { type: Sequelize.STRING, allowNull: false },
  tipo: { type: Sequelize.STRING, allowNull: false, defaultValue: "Estudante - Registro SP" },
  notificacoes: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: "usuarios" });

export default Usuario;
