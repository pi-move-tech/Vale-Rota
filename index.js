// Importando o Express
import express from "express";
// Importando a sessão (login) e o driver do MySQL
import session from "express-session";
import mysql from "mysql2/promise";
//importando arquivo de conexão do sequelize
import connection, { dbConfig } from "./config/sequelize-config.js";
// Iniciando o Express
const app = express();

//importando as rotas (controllers)
import indexController from "./controller/IndexController.js";
import buscaController from "./controller/BuscaController.js";
import favoritoController from "./controller/FavoritoController.js";
import alertaController from "./controller/AlertaController.js";
import perfilController from "./controller/PerfilController.js";

//importando os models (necessário para o sync criar as tabelas)
import "./models/Usuario.js";
import "./models/Cidade.js";
import "./models/Rota.js";
import "./models/Viagem.js";
import "./models/Parada.js";
import "./models/Favorito.js";
import "./models/Alerta.js";
import "./models/Relato.js";
import "./models/Busca.js";

//importando as ASSOCIAÇÕES, os dados iniciais, os helpers e o middleware
import defineAssociations from "./config/associations.js";
import seed from "./config/seed.js";
import * as helpers from "./config/helpers.js";
import { injetarSessao } from "./middleware/auth.js";

//CONFIGURAÇÕES DO EXPRESS
//Configurando o express para permitir dados através de formulários
app.use(express.urlencoded({ extended: false }));
// Define o EJS como Renderizador de páginas
app.set("view engine", "ejs");
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static("public"));
//Configurando a sessão (guarda quem está logado)
app.use(session({ secret: "vale-rota-segredo", resave: false, saveUninitialized: false }));
app.use(injetarSessao);
//Funções disponíveis em todas as views como "h"
app.locals.h = helpers;

//Criando o banco de dados se ele não existir
//(usa uma conexão sem "database" porque o banco ainda pode não existir)
async function iniciar() {
  try {
    const temp = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.username,
      password: dbConfig.password,
    });
    await temp.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await temp.end();
    console.log(`O banco de dados ${dbConfig.database} está criado!`);

    //REALIZANDO A CONEXÃO COM O BANCO DE DADOS
    await connection.authenticate();
    console.log("Conexão com o banco de dados realizada com sucesso!");

    //Aplicando as ASSOCIAÇÕES e sincronizando os Models
    defineAssociations();
    await connection.sync({ force: false });
    console.log("Tabelas e relacionamentos sincronizados com sucesso!");

    //Inserindo cidades, rotas e horários de exemplo
    await seed();
  } catch (error) {
    console.log(`Ocorreu um erro ao preparar o banco de dados. Erro: ${error}`);
    console.log("Verifique se o MySQL está ligado e se usuário/senha em config/sequelize-config.js estão corretos.");
    process.exit(1);
  }
}
await iniciar();

//iniciando as rotas
app.use("/", indexController);
app.use("/", buscaController);
app.use("/", favoritoController);
app.use("/", alertaController);
app.use("/", perfilController);

//Evita que um erro de banco derrube o servidor
process.on("unhandledRejection", (erro) => console.log(`Erro não tratado: ${erro}`));

// INICIA O SERVIDOR NA PORTA 8080
const port = 8080;
app.listen(port, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro!");
  } else {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`);
  }
});
