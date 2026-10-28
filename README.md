# Vale Rota

Sistema Inteligente de Transporte Público Intermunicipal
<br>
<hr>
<br>

## Descrição
Aplicativo web responsivo que centraliza horários e rotas intermunicipais, com previsão de atraso baseada em dados históricos de viagens e alertas personalizados para estudantes e trabalhadores.
<br>
<hr>
<br>

## Banco de Dados
### Diagrama ER do nosso sistema

```mermaid
erDiagram
    Empresas {
        VARCHAR(14) cnpj_empresa PK
        VARCHAR(100) nome_empresa
        VARCHAR(15) telefone_empresa
        VARCHAR(255) endereco_empresa
    }

    Onibus {
        INT id_onibus PK
        VARCHAR(7) placa_onibus
        VARCHAR(20) numero_onibus
        VARCHAR(17) chassi_onibus
        VARCHAR(14) cnpj_empresa FK
    }

    Usuarios {
        INT id_usuario PK
        VARCHAR(100) nome_usuario
        VARCHAR(100) email_usuario
        VARCHAR(255) senha_usuario
        VARCHAR(15) telefone_usuario
    }

    Rotas {
        INT id_rota PK
        VARCHAR(100) nome_rota
        DECIMAL(5_2) distancia_rota
        TIME horario_rota
        DATE data_rota
    }

    Alertas {
        INT id_alerta PK
        VARCHAR(20) status_alerta
        TIME horario_alerta
        DATE data_alerta
        INT id_usuario FK
        INT id_rota FK
    }

    Pontos_parada {
        INT id_parada PK
        VARCHAR(100) nome_parada
        VARCHAR(255) localizacao_parada
    }

    Favoritos {
        INT id_favorito PK
        INT id_usuario FK
        INT id_rota FK
    }

    Rotas_Paradas {
        INT id_rota PK, FK
        INT id_parada PK, FK
        INT ordem_parada
    }

    Onibus_Rotas {
        INT id_onibus_rota PK
        INT id_onibus FK
        INT id_rota FK
    }

    %% Relacionamentos
    Empresas ||--o{ Onibus : "possui"
    Usuarios ||--o{ Alertas : "recebe"
    Rotas ||--o{ Alertas : "gera"
    Usuarios ||--o{ Favoritos : "favorita"
    Rotas ||--o{ Favoritos : "eh_favoritada"
    Rotas ||--o{ Rotas_Paradas : "contem"
    Pontos_parada ||--o{ Rotas_Paradas : "pertence_a"
    Onibus ||--o{ Onibus_Rotas : "atua_em"
    Rotas ||--o{ Onibus_Rotas : "recebe"
```
<br>
<hr>
<br>

## Figma
https://www.figma.com/design/8dnbi4e3bP7HmgR3Ew6EHA/Design-PI?node-id=0-1&p=f&t=x6sdGn7aUDPXajC9-0
<br>
<hr>
<br>

## Diagrama de casos de uso

<br>
<hr>
<br>

```mermaid
flowchart TB
    subgraph sistema["Sistema de Gestão de Rotas"]
        direction LR

        subgraph grupoUsuario["Usuário"]
            direction TB
            usuario@{ shape: person, label: "Usuário" }
            criarConta(["Criar conta"])
            visualizarRotas(["Visualizar rotas"])
            favoritarRota(["Favoritar rota"])
            acompanharOnibus(["Acompanhar ônibus"])
            tempoAtraso(["Visualizar tempo esperado de atraso"])
            receberNotificacoes(["Receber notificações"])
            usuario --- criarConta
            usuario --- visualizarRotas
            usuario --- favoritarRota
            usuario --- acompanharOnibus
            usuario --- tempoAtraso
            usuario --- receberNotificacoes
        end

        subgraph grupoMotorista["Motorista"]
            direction TB
            motorista@{ shape: person, label: "Motorista" }
            dirigirOnibus(["Dirigir ônibus"])
            reportarAtraso(["Reportar atraso"])
            iniciarEncerrar(["Iniciar e encerrar rota"])
            motorista --- dirigirOnibus
            motorista --- reportarAtraso
            motorista --- iniciarEncerrar
        end

        subgraph grupoEmpresa["Empresa de ônibus"]
            direction TB
            empresa@{ shape: person, label: "Empresa de ônibus" }
            fornecerHorarios(["Fornecer horários"])
            fornecerOnibus(["Fornecer ônibus"])
            acompanharTempoReal(["Acompanhar em tempo real"])
            alterarRotas(["Alterar rotas"])
            empresa --- fornecerHorarios
            empresa --- fornecerOnibus
            empresa --- acompanharTempoReal
            empresa --- alterarRotas
        end

        subgraph grupoAdmin["Administrador"]
            direction TB
            administrador@{ shape: person, label: "Administrador" }
            gerenciarRotas(["Gerenciar rotas"])
            atualizarSistema(["Atualizar sistema"])
            monitorar(["Monitorar"])
            suporte(["Suporte"])
            administrador --- gerenciarRotas
            administrador --- atualizarSistema
            administrador --- monitorar
            administrador --- suporte
        end

        subgraph grupoServicos["Serviços do sistema"]
            direction TB
            rastreamento(["Rastreamento"])
            enviarNotificacoes(["Enviar notificações"])
            gerarRelatorios(["Gerar relatórios"])
        end
    end

    atualizarSistema -. "estende" .-> fornecerHorarios
    acompanharTempoReal -. "estende" .-> monitorar
    monitorar -. "inclui" .-> rastreamento
    enviarNotificacoes -. "estende" .-> receberNotificacoes
    rastreamento -. "inclui" .-> receberNotificacoes

    classDef ator fill:#f0f9ff,stroke:#38bdf8,color:#0c4a6e
    classDef caso fill:#f5f3ff,stroke:#a78bfa,color:#3b0764
    classDef servico fill:#f0fdfa,stroke:#2dd4bf,color:#134e4a

    class usuario,motorista,empresa,administrador ator
    class criarConta,visualizarRotas,favoritarRota,acompanharOnibus,tempoAtraso,receberNotificacoes,dirigirOnibus,reportarAtraso,iniciarEncerrar,fornecerHorarios,fornecerOnibus,acompanharTempoReal,alterarRotas,gerenciarRotas,atualizarSistema,monitorar,suporte caso
    class rastreamento,enviarNotificacoes,gerarRelatorios servico
```


<br>
<hr>
<br>

## Diagrama de Classes
<br>
<hr>
<br>

```mermaid
classDiagram
    direction TB

    class Usuario {
        +int id
        +string nome
        +string email
        +string senha
        +string tipo
        +string cidade
        +cadastrar()
        +atualizarPerfil()
        +definirCidadesInteresse()
    }

    class Favorito {
        +int id
        +string nome
        +int usuarioId
        +int rotaId
        +salvarRota()
        +remover()
    }

    class Alerta {
        +int id
        +int usuarioId
        +int viagemId
        +string tipo
        +int limiteAtraso
        +boolean ativo
        +ativar()
        +desativar()
    }

    class Reporte {
        +int id
        +int usuarioId
        +int viagemId
        +string tipo
        +string descricao
        +datetime data
        +enviarReporte()
        +visualizar()
    }

    class Empresa {
        +int id
        +string nome
        +string telefone
        +cadastrar()
        +atualizarDados()
    }

    class Linha {
        +int id
        +string numero
        +string origem
        +string destino
        +string duracaoEstimada
        +int empresaId
        +buscarHorarios()
        +exibirRota()
    }

    class Rota {
        +int id
        +string origem
        +string destino
        +float distancia
        +calcularDistancia()
        +listarLinhas()
    }

    class Horario {
        +int id
        +int linhaId
        +time horaSaida
        +time horaChegada
        +date data
        +estaDisponivel()
        +formatarHorario()
    }

    class Parada {
        +int id
        +string nome
        +string cidade
        +time horarioPrevisto
        +int ordem
        +exibirInformacoes()
        +atualizarHorario()
    }

    class Viagem {
        +int id
        +int linhaId
        +int horarioId
        +string status
        +int atraso
        +datetime horaReal
        +atualizarStatus()
        +calcularAtraso()
    }

    Usuario "1" --> "0..*" Favorito : cria
    Usuario "1" --> "0..*" Alerta : realiza
    Usuario "1" --> "0..*" Reporte : configura
    Alerta "0..*" --> "1" Viagem : monitora
    Reporte "0..*" --> "1" Viagem : refere-se
    Empresa "1" --> "0..*" Linha : opera
    Linha "1" --> "0..*" Horario : possui
    Linha "1" --> "0..*" Rota : possui
    Viagem "1" --> "1..*" Horario : possui
    Rota "1" --> "0..*" Parada : faz parte
```
    
<br>
<hr>
<br>

## Diagrama de Objetos

<br>
<hr>
<br>

```mermaid
flowchart TB
    subgraph usuarios["Usuários"]
        U1["<b>usuario1 (Usuario)</b><br/><br/>id: 1<br/>nome: João Silva<br/>email: joao@email.com<br/>tipo: Estudante<br/>cidade: Registro"]
        U2["<b>usuario2 (Usuario)</b><br/><br/>id: 2<br/>nome: Maria Oliveira<br/>email: maria@email.com<br/>tipo: Trabalhador<br/>cidade: Cajati"]
    end

    subgraph operacao["Operação de transporte"]
        E1["<b>empresa1 (Empresa)</b><br/><br/>id: 1<br/>nome: Expresso Vale<br/>telefone: (13) 3821-0000"]
        L1["<b>linha1 (Linha)</b><br/><br/>id: 1<br/>numero: 101<br/>origem: Registro<br/>destino: Cajati<br/>duracaoEstimada: 1h20<br/>empresaId: 1"]
        H1["<b>horario1 (Horario)</b><br/><br/>id: 1<br/>linhaId: 1<br/>horaSaida: 07:15<br/>horaChegada: 08:35<br/>data: 03/10/2026"]
        R1["<b>rota1 (Rota)</b><br/><br/>id: 1<br/>origem: Registro<br/>destino: Cajati<br/>distancia: 70.5"]
        V1["<b>viagem1 (Viagem)</b><br/><br/>id: 1<br/>linhaId: 1<br/>horarioId: 1<br/>status: Atrasada<br/>atraso: 15<br/>horaReal: 07:30"]
        P1["<b>parada1 (Parada)</b><br/><br/>id: 1<br/>nome: Terminal de Registro<br/>cidade: Registro<br/>horarioPrevisto: 07:15<br/>ordem: 1"]
    end

    subgraph notificacoes["Favoritos, alertas e reportes"]
        F1["<b>favorito1 (Favorito)</b><br/><br/>id: 1<br/>nome: Ida para faculdade<br/>usuarioId: 1<br/>rotaId: 1"]
        A1["<b>alerta1 (Alerta)</b><br/><br/>id: 1<br/>usuarioId: 1<br/>viagemId: 1<br/>tipo: Atraso<br/>limiteAtraso: 15<br/>ativo: true"]
        RP1["<b>reporte1 (Reporte)</b><br/><br/>id: 1<br/>usuarioId: 1<br/>viagemId: 1<br/>tipo: Atraso<br/>descricao: Ônibus chegou 20 minutos atrasado.<br/>data: 03/10/2026"]
    end

    U1 -.-> F1
    U1 -.-> A1
    U1 -.-> RP1
    E1 -.-> L1
    L1 -.-> H1
    L1 -.-> R1
    H1 -.-> V1
    R1 -.-> P1
    V1 -.-> A1
    V1 -.-> RP1

    classDef usuario fill:#f0fdf4,stroke:#4ade80,color:#14532d
    classDef transporte fill:#f0f9ff,stroke:#38bdf8,color:#0c4a6e
    classDef notificacao fill:#f5f3ff,stroke:#a78bfa,color:#4c1d95

    class U1,U2 usuario
    class E1,L1,H1,R1,V1,P1 transporte
    class F1,A1,RP1 notificacao
```
<br>
<hr>
<br>

## Diagrama de sequência de fluxo
```mermaid
sequenceDiagram
    autonumber
    participant Voce as Você (no celular ou PC)
    participant Sistema as Site Vale Rota (o sistema)
    participant BD as Banco de dados (onde os dados ficam)

    Note over Voce, BD: 1 · Procurar horários (achar a viagem que você quer)

    Voce->Sistema: Você escolhe origem e destino e clica em Buscar viagens
    Sistema->Sistema: Confere se você entrou
    Sistema->BD: Procura a rota escolhida
    BD-->Sistema: Rota encontrada
    Sistema->BD: Anota sua busca no histórico
    Sistema->BD: Pede os horários dessa rota
    BD-->Sistema: Lista de horários
    Sistema-->Voce: Mostra os horários, com a cor que indica se vai atrasar

    Note over Voce, BD: 2 · Ver os detalhes (mapa, paradas e atraso esperado)

    Voce->Sistema: Você toca em um horário
    Sistema->BD: Pede a viagem e as paradas
    BD-->Sistema: Viagem e paradas
    Sistema->BD: Vê se a rota é favorita
    BD-->Sistema: Sim ou não
    Sistema-->Voce: Mostra o mapa, as paradas e quanto atraso é esperado

    Note over Voce, BD: 3 · Favoritar a rota (guardar para achar rápido depois)

    Voce->Sistema: Você toca em Favoritar esta rota
    Sistema->Sistema: Confere se você tem conta
    Sistema->BD: Vê se a rota já é favorita
    BD-->Sistema: Ainda não
    Sistema->BD: Guarda a rota nos favoritos
    BD-->Sistema: Favorito guardado
    Sistema-->Voce: Volta para a tela e mostra a estrela de favorita

    Note over Voce, BD: 4 · Criar um aviso (ser avisado se o ônibus atrasar)

    Voce->Sistema: Você escolhe o tipo de aviso e clica em Salvar alerta
    Sistema->BD: Guarda o seu alerta
    BD-->Sistema: Alerta guardado
    Sistema-->Voce: Mostra a sua lista de alertas
```

<br>
<hr>
<br>

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
