//nesse arquivo serão definidos os relacionamentos entre tabelas
import Usuario from "../models/Usuario.js";
import Cidade from "../models/Cidade.js";
import Rota from "../models/Rota.js";
import Viagem from "../models/Viagem.js";
import Parada from "../models/Parada.js";
import Favorito from "../models/Favorito.js";
import Alerta from "../models/Alerta.js";
import Relato from "../models/Relato.js";
import Busca from "../models/Busca.js";

const defineAssociations = () => {
  //Uma cidade é origem/destino de MUITAS rotas | Uma rota pertence a UMA origem e UM destino
  Cidade.hasMany(Rota, { as: "rotasDeOrigem", foreignKey: "origem_id" });
  Cidade.hasMany(Rota, { as: "rotasDeDestino", foreignKey: "destino_id" });
  Rota.belongsTo(Cidade, { as: "origem", foreignKey: "origem_id" });
  Rota.belongsTo(Cidade, { as: "destino", foreignKey: "destino_id" });

  //Uma rota possui MUITAS viagens
  Rota.hasMany(Viagem, { as: "viagens", foreignKey: "rota_id" });
  Viagem.belongsTo(Rota, { as: "rota", foreignKey: "rota_id" });

  //Uma viagem possui MUITAS paradas
  Viagem.hasMany(Parada, { as: "paradas", foreignKey: "viagem_id" });
  Parada.belongsTo(Viagem, { as: "viagem", foreignKey: "viagem_id" });

  //Um usuário possui MUITOS favoritos | um favorito aponta para UMA rota
  Usuario.hasMany(Favorito, { as: "favoritos", foreignKey: "usuario_id" });
  Favorito.belongsTo(Usuario, { as: "usuario", foreignKey: "usuario_id" });
  Rota.hasMany(Favorito, { as: "favoritos", foreignKey: "rota_id" });
  Favorito.belongsTo(Rota, { as: "rota", foreignKey: "rota_id" });

  //Um usuário possui MUITOS alertas | um alerta aponta para UMA viagem
  Usuario.hasMany(Alerta, { as: "alertas", foreignKey: "usuario_id" });
  Alerta.belongsTo(Usuario, { as: "usuario", foreignKey: "usuario_id" });
  Viagem.hasMany(Alerta, { as: "alertas", foreignKey: "viagem_id" });
  Alerta.belongsTo(Viagem, { as: "viagem", foreignKey: "viagem_id" });

  //Um usuário possui MUITOS relatos
  Usuario.hasMany(Relato, { as: "relatos", foreignKey: "usuario_id" });
  Relato.belongsTo(Usuario, { as: "usuario", foreignKey: "usuario_id" });

  //Um usuário possui MUITAS buscas | uma busca aponta para UMA rota
  Usuario.hasMany(Busca, { as: "buscas", foreignKey: "usuario_id" });
  Busca.belongsTo(Usuario, { as: "usuario", foreignKey: "usuario_id" });
  Busca.belongsTo(Rota, { as: "rota", foreignKey: "rota_id" });

  //MUITOS usuários têm MUITAS cidades de interesse (N:N) -> tabela usuario_cidades
  Usuario.belongsToMany(Cidade, { as: "cidadesInteresse", through: "usuario_cidades", foreignKey: "usuario_id", otherKey: "cidade_id" });
  Cidade.belongsToMany(Usuario, { as: "interessados", through: "usuario_cidades", foreignKey: "cidade_id", otherKey: "usuario_id" });
};

//exportando o módulo
export default defineAssociations;
