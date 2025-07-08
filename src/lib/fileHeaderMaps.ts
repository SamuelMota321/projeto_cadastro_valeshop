export type PageType = 'cadastrarUsuario' | 'alterarReferencia' | 'alterarDadosBancarios';

export const headerMaps: Record<PageType, Record<string, string>> = {
  cadastrarUsuario: {
    cpf: "CPF",
    nome: "Nome Completo",
    telefone: "DDD/Telefone",
    email: "E-mail do Beneficiário",
    nascimento: "Data de Nascimento",
    nomeMae: "Nome da Mãe",
  },
  alterarReferencia: {
    cpf: "CPF",
    departamento: "Nome do Departamento",
  },
  alterarDadosBancarios: {
    cpf: "CPF",
    banco: "N° do Banco",
    agencia: "N° da agência",
    digitoAgencia: "Digito da agência",
    conta: "N° da conta",
    digitoConta: "Digito da conta",
  },
};