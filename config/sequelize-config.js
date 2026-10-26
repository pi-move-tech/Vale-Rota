//Arquivo com os dados de conexão com o banco
//importando o sequelize
import Sequelize from "sequelize";

//Dados de conexão (altere aqui se o seu MySQL tiver senha)
export const dbConfig = {
  host: "localhost",
  username: "root",
  password: "",
  database: "vale_rota",
};

const connection = new Sequelize({
  dialect: "mysql",
  host: dbConfig.host,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  timezone: "-03:00",
  logging: false,
});

//Exportando o módulo
export default connection;
