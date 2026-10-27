//Popula o banco com dados de demonstração (só roda se o banco estiver vazio)
import Cidade from "../models/Cidade.js";
import Rota from "../models/Rota.js";
import Viagem from "../models/Viagem.js";
import Parada from "../models/Parada.js";

const NOMES = ["Registro", "Cajati", "Jacupiranga", "Pariquera-Açu", "Iguape", "Sete Barras"];
const HORARIOS = ["07:15", "09:30", "11:45", "14:20"];
const ATRASOS = [0, 15, 0, 30];
const EMPRESAS = [
  { nome: "Valle Sul", linha: "203", duracao: 45 },
 { nome: "Princesa dos Campos", linha: "108", duracao: 50 },
];

export default async function seed() {
  if ((await Cidade.count()) > 0) return;
  console.log("Populando o banco com dados de demonstração...");

  await Cidade.bulkCreate(NOMES.map((nome) => ({ nome })));
  const cidades = await Cidade.findAll({ order: [["nome", "ASC"]] });

  for (const o of cidades) {
    for (const d of cidades) {
      if (o.id === d.id) continue;
      const rota = await Rota.create({ origem_id: o.id, destino_id: d.id });
      //cidades que ficam "no meio do caminho"
      const meio = cidades.filter((c) => c.id !== o.id && c.id !== d.id).slice(0, 2);

      for (let i = 0; i < HORARIOS.length; i++) {
        const emp = EMPRESAS[i % 2];
        const viagem = await Viagem.create({
          horario: HORARIOS[i], empresa: emp.nome, linha: emp.linha,
          duracao: emp.duracao, atraso: ATRASOS[i], rota_id: rota.id,
        });
        await Parada.bulkCreate([
          { nome: `${o.nome} - Terminal`, minutos: 0, ordem: 1, viagem_id: viagem.id },
          { nome: `${meio[0].nome} - Centro`, minutos: Math.round(emp.duracao * 0.62), ordem: 2, viagem_id: viagem.id },
          { nome: `${meio[1].nome} - Rodoviária`, minutos: Math.round(emp.duracao * 0.78), ordem: 3, viagem_id: viagem.id },
          { nome: `${d.nome} - Terminal`, minutos: emp.duracao, ordem: 4, viagem_id: viagem.id },
        ]);
      }
    }
  }
  console.log("Dados de demonstração criados!");
}
