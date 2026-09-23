# Vale-Rota
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
