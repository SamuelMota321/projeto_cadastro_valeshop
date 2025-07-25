# Coleta e registro de dados ValeShop

Este projeto é uma aplicação web construída com React e Vite, utilizando Tailwind CSS para estilização e Zod para validação de esquemas de dados. Ele serve como uma ferramenta de "Coleta de Dados" para diversas operações de cadastro e alteração relacionadas a cartões, usuários, veículos e motoristas.

## Visão Geral do Projeto
O objetivo principal do "Projeto Cadastro ValeShop" é fornecer uma interface amigável para a inserção e gestão de dados, com a capacidade de importar informações via planilhas (.csv ou .xlsx) e enviá-las para uma API, além de gerar planilhas de exemplo para facilitar o preenchimento.

### Tecnologias Utilizadas
O projeto é construído com as seguintes tecnologias principais:

  - Frontend Framework: React
  - Build Tool: Vite
  - Estilização: Tailwind CSS
  - Validação de Dados: Zod
  - Requisições HTTP: Axios
  - Componentes UI: Radix UI (usado em Select e Slot)
  - Manipulação de Arquivos CSV/XLSX: PapaParse e XLSX
  - Máscaras de Input: React Input Mask
  - Roteamento: React Router DOM
  - Ícones: Lucide React

## Primeiros Passos
Para configurar e executar o projeto localmente, siga as instruções abaixo:

### Pré-requisitos
Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (gerenciador de pacotes do Node.js) instalados em sua máquina.

### Instalação
1. Clone o repositório:

```Bash

git clone https://github.com/samuelmota321/projeto_cadastro_valeshop.git
cd projeto_cadastro_valeshop
``` 
2. Instale as dependências:

```Bash

npm install
``` 
### Execução
1. Modo de Desenvolvimento:
Para iniciar o servidor de desenvolvimento e ver o projeto em ação, execute:

```Bash
npm run dev
``` 
O aplicativo estará disponível em http://localhost:5173/.

2. Build para Produção:
Para criar uma versão otimizada do projeto para produção, execute:

```Bash
npm run build
``` 
Os arquivos compilados serão gerados na pasta dist/.

## Estrutura do Projeto
A estrutura do diretório `src` é organizada da seguinte forma:

`src/
├── App.tsx             # Componente principal da aplicação e configuração de rotas
├── components/         # Componentes reutilizáveis da UI (botões, cards, inputs, etc.)
│   └── ui/             # Componentes de interface de usuário genéricos
│       ├── alertBox.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── fileUpload.tsx
│       ├── header.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── nav.tsx
│       ├── requiredLabel.tsx
│       ├── select.tsx
│       ├── spreadsheetInstructions.tsx
│       └── temporaryDataTable.tsx
├── hooks/              # Hooks personalizados para lógica reutilizável
│   └── useFormAndTable.ts  # Lógica principal para formulários e tabelas
├── imgs/               # Imagens e assets estáticos
│   └── logo_valeShop.png
├── lib/                # Funções de utilidade e esquemas de dados
│   ├── api.ts          # Configuração da instância do Axios para chamadas API
│   ├── fileHeaderMaps.ts # Mapeamento de cabeçalhos de arquivo para campos de esquema
│   ├── schemas/        # Definições de esquemas de validação Zod
│   │   ├── alterCardStatusSchema.ts
│   │   ├── alterMatriculaSchema.ts
│   │   ├── alterReference.ts
│   │   ├── bankDataSchema.ts
│   │   ├── basicFunctions.ts
│   │   ├── cardDebitSchema.ts
│   │   ├── cardSchema.ts
│   │   ├── companySchema.ts
│   │   ├── driverSchema.ts
│   │   ├── newCardNewUser.ts
│   │   ├── newReferenceSchema.ts
│   │   ├── userSchema.ts
│   │   └── vehicleSchema.ts
│   └── utils.ts        # Funções utilitárias (e.g., download de CSV, junção de classes CSS)
├── providers/          # Provedores de contexto para a aplicação
│   └── modalProvider.tsx # Provedor para gerenciar a visibilidade de modais
├── screens/            # Páginas/Telas principais da aplicação
│   ├── AlterarMatricula/
│   ├── AlterarReferenciaUsuario/
│   ├── AlterarStatusCartao/
│   ├── CadastrarAlterarDadosBancarios/
│   ├── CadastrarMotorista/
│   ├── CadastrarUsuario/
│   ├── CadastrarVeiculo/
│   ├── CadastroCartao/
│   ├── CreditoCartao/
│   ├── EstornoDebito/
│   ├── NovoCadastroReferencia/
│   └── NovoCartaoNovoUsuario/
└── vite-env.d.ts       # Declarações de tipo para o ambiente Vite`


## Funcionalidades Principais
O projeto é centrado em um conjunto de funcionalidades de cadastro e alteração, cada uma com sua própria tela dedicada. Todas as telas seguem um padrão de design e funcionalidade, impulsionado pelo hook `useFormAndTable`.

### Hook `useFormAndTable`
Este hook customizado (`src/hooks/useFormAndTable.ts`) é o coração da lógica de formulários e tabelas em toda a aplicação. Ele abstrai:

 - *Gerenciamento de Estado*: Lida com os dados do formulário, dados da empresa (contrato), dados da tabela, erros de validação e mensagens de sucesso/erro.
 - *Validação*: Integra-se com esquemas Zod para validar os dados inseridos manualmente ou importados de arquivos.
 - *Importação de Arquivos*: Processa arquivos CSV e XLSX, validando cabeçalhos e dados contra os esquemas definidos.
 - *Exportação de Arquivos*: Gera arquivos CSV de exemplo para cada tipo de cadastro, com instruções de preenchimento.
 - *Manipulação da Tabela*: Adiciona, edita e remove itens da tabela temporária.
 - *Submissão de Dados*: Envia os dados processados para a API configurada.

### Schemas de Dados (`src/lib/schemas/`)
Cada tipo de cadastro ou alteração possui um esquema Zod correspondente, que define a estrutura, os tipos de dados e as regras de validação para cada campo. Alguns dos esquemas incluem:

 - `alterCardStatusSchema`: Valida dados para alteração de status de cartão (CPF, nome, tipo de movimentação).
 - `userSchema`: Valida dados de usuário (CPF, nome, telefone, email, nascimento, nome da mãe).
 - `bankDataSchema`: Valida dados bancários (banco, agência, dígito da agência, conta, dígito da conta).
 - `driverSchema`: Valida dados de motorista (matrícula, nome, CPF, validade da CNH, número da CNH, categoria da CNH).
 - `vehicleSchema`: Valida dados de veículo (Renavam, placa, chassi, ano de fabricação, ID do modelo).
 - `cardSchema`: Valida dados para crédito de cartão (CPF, nome, valor de crédito, departamento).
 - `creditDebitSchema`: Valida dados para estorno de débito (CPF, nome, valor de débito).
 - `newReferenceSchema`: Valida dados para novo cadastro de referência (departamento).
 - `newCardNewUser`: Valida dados para novo cartão e novo usuário (CPF, matrícula, departamento).
 - `companySchema`: Valida o número do contrato, que é um campo comum em todas as operações.

As funções auxiliares em `basicFunctions.ts` (como `onlyNumbers`, `capitalizeName`, `nameRegex`, `dateRegex`) são usadas para transformações e validações básicas nos esquemas.

### Mapeamento de Cabeçalhos (`src/lib/fileHeaderMaps.ts`)
Este arquivo define como os cabeçalhos das planilhas de upload se correlacionam com os campos dos esquemas de dados, garantindo que os dados sejam interpretados corretamente.

### Componentes de UI (`src/components/ui/`)
O projeto utiliza uma variedade de componentes de UI padronizados, construídos com Tailwind CSS e Radix UI, incluindo:

 - `Button`: Botões com diferentes variantes e tamanhos.
 - `Card`: Componentes de cartão para agrupar conteúdo.
 - `Input`: Campos de entrada de texto, frequentemente usados com react-input-mask para formatação.
 - `Select`: Menus suspensos para seleção de opções.
 - `FileUpload`: Componente para arrastar e soltar ou selecionar arquivos para upload.
 - `TemporaryDataTable`: Tabela para exibir e gerenciar dados temporariamente antes da submissão.
 - `AlertBox`: Componente para exibir mensagens de sucesso ou erro.
 - `SpreadsheetInstructions`: Componente que exibe instruções detalhadas sobre como preencher as planilhas, incluindo exemplos e regras de validação.

### Telas da Aplicação (`src/screens/`)
Cada tela representa uma funcionalidade específica e utiliza o hook `useFormAndTable` com configurações personalizadas (`pageConfigs`) para definir os mapeamentos de cabeçalho, geradores de dados de exemplo, prefixos de nome de arquivo e instruções específicas.

Exemplos de telas e suas funcionalidades:

 - `Alterar Status do Cartão:` Gerencia o status dos cartões (ativar, cancelar, inativar, bloquear) com base em CPF e nome completo.
 - `Cadastrar Usuário:` Permite o cadastro de novos usuários com informações detalhadas (CPF, nome, telefone, e-mail, data de nascimento, nome da mãe).
 - `Alterar Referência do Usuário:` Atualiza o departamento de um usuário existente.
 - `Cadastrar/Alterar Dados Bancários:` Permite o registro ou atualização de dados bancários de usuários.
 - `Novo Cadastro de Referência:` Cadastra um novo departamento/referência.
 - `Cadastro Motorista:` Registra dados de motoristas, incluindo matrícula, CNH e categoria.
 - `Cadastro Veículo:` Cadastra informações de veículos como Renavam, placa, chassi e ano de fabricação.
 - `Crédito de Valores para Cartão:` Adiciona saldo a cartões existentes.
 - `Cadastro de Cartão:` Realiza o cadastro de um novo cartão, associando-o a um usuário e creditando um valor inicial.
 - `Estorno de Débito:` Realiza o estorno de valores em cartões.
 - `Novo Usuário e Novo Crédito:` Permite o cadastro de um novo usuário e simultaneamente adiciona um novo crédito a ele.

### Integração com a API
O projeto envia os dados processados para uma API externa utilizando a instância configurada em `src/lib/api.ts`. A URL base da API é carregada a partir de uma variável de ambiente (`VITE_CHAVE_API_AUTOMATE`). Em caso de sucesso, um modal de instruções é exibido, e em caso de erro, uma mensagem de alerta é mostrada ao usuário.

Configuração do Ambiente
Variáveis de ambiente podem ser configuradas no arquivo `.env` na raiz do projeto (não incluído no controle de versão por padrão via .gitignore):

```Bash
VITE_CHAVE_API_AUTOMATE=sua_chave_de_api_aqui
```