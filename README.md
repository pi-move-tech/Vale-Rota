# Vale Rota

Site de consulta de horários e previsão de atrasos do transporte intermunicipal (Vale do Ribeira).
Feito com **Node.js + Express + EJS + Sequelize + MySQL**, seguindo o mesmo padrão do projeto da aula 09.

## Como instalar

1. Instale o **Node.js** (versão 18 ou superior): https://nodejs.org
2. Ligue o **MySQL** (XAMPP, WAMP, MySQL Workbench...). O padrão do projeto é usuário `root` sem senha.
   Se o seu tiver senha, altere em `config/sequelize-config.js`.
3. Extraia o .rar, abra a pasta no VS Code e, no terminal, rode:

```bash
npm install
npm start
```

4. Abra no navegador: http://localhost:8080

Na primeira execução o projeto **cria sozinho** o banco `vale_rota`, as tabelas e os dados de exemplo
(cidades, rotas, horários e paradas). Não é preciso criar nada manualmente.

## Estrutura

```
index.js                  -> servidor, sessão, conexão e sincronização do banco
config/
  sequelize-config.js     -> dados de conexão com o MySQL
  associations.js         -> relacionamentos entre as tabelas
  seed.js                 -> dados iniciais de exemplo
  helpers.js              -> funções usadas nas views
middleware/auth.js        -> controle de login (conta / visitante)
models/                   -> Usuario, Cidade, Rota, Viagem, Parada, Favorito, Alerta, Relato, Busca
controller/               -> Index (login), Busca, Favorito, Alerta, Perfil
views/                    -> telas .ejs (+ partials: header, navbar, footer)
public/                   -> css/style.css e js/js.js
```

## Relacionamentos

- Cidade 1:N Rota (origem e destino) · Rota 1:N Viagem · Viagem 1:N Parada
- Usuario 1:N Favorito · Alerta · Relato · Busca
- Rota 1:N Favorito/Busca · Viagem 1:N Alerta
- Usuario N:N Cidade (cidades de interesse, tabela `usuario_cidades`)

## Telas e rotas

| Tela | Rota |
|---|---|
| Login / criar conta / visitante | `/`, `/login`, `/cadastrar`, `/visitante`, `/sair` |
| Buscar | `/buscar` |
| Horários | `/horarios?origem=&destino=` |
| Detalhe da viagem | `/rota/:id` |
| Favoritos | `/favoritos` |
| Alertas | `/alertas` |
| Perfil | `/perfil` (dados, notificações, cidades, reportar problema, sobre) |

Observação: visitantes podem buscar horários, mas favoritos, alertas e perfil exigem conta.
