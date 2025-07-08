import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Nav } from "../../components/ui/nav";
import { Header } from "../../components/ui/header";
import { TemporaryDataTable } from "../../components/ui/temporaryDataTable";
import { FileUpload } from "../../components/ui/fileUpload";
import { downloadAsCSV, downloadSampleCSV } from "../../lib/utils";
import { AlertBox } from "../../components/ui/alertBox";
import { RequiredLabel } from "../../components/ui/requiredLabel";
import { SpreadsheetInstructions } from "../../components/ui/SpreadsheetInstructions";

// Define a estrutura dos dados para a tabela e o formulário
type TableData = {
  cpf: string;
  nome: string;
  telefone: string;
  email: string;
  nascimento: string;
  nomeMae: string;
};

export const CadastrarUsuario = (): JSX.Element => {
  // Estados para os campos de dados da empresa
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");

  // Novos estados para controlar as mensagens de alerta
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  // Estados para os campos de dados do usuário
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [nomeMae, setNomeMae] = useState("");

  // Estados para a tabela e controle de edição
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const cadastroUsuarioInstructions = [
    {
      field: "CPF",
      rule: "Deve conter 11 dígitos, sem pontos ou traços.",
      example: "Exemplo: 12345678900",
    },
    {
      field: "Nome Completo",
      rule: "Escreva o nome completo do funcionário, sem abreviações ou caracteres especiais.",
      example: "Exemplo: Joao da Silva Santos",
    },
    {
      field: "DDD/Telefone",
      rule: "Informe o DDD junto com o número de celular, sem espaços ou parênteses.",
      example: "Exemplo: 61990909090",
    },
    {
      field: "E-mail do Beneficiário",
      rule: "Utilize um formato de e-mail válido.",
      example: "Exemplo: exemplo@email.com",
    },
    {
      field: "Data de Nascimento",
      rule: "Siga o formato DD/MM/AAAA.",
      example: "Exemplo: 01/08/1990",
    },
    {
      field: "Nome da Mãe",
      rule: "Escreva o nome completo da mãe do funcionário, sem abreviações.",
      example: "Exemplo: Maria da Silva Santos",
    },
  ];
  // Limpa os campos do formulário do usuário e sai do modo de edição
  const resetFormAndExitEditing = () => {
    setCpf(""); setNome(""); setTelefone(""); setEmail(""); setNascimento(""); setNomeMae("");
    setEditingIndex(null);
  };

  // Adiciona um novo registro ou atualiza um existente
  const handleRegisterOrUpdateClick = () => {
    if (!cpf || !nome || !telefone || !email || !nascimento || !nomeMae) {
      alert("Por favor, preencha todos os campos do usuário.");
      return;
    }
    const newEntry: TableData = { cpf, nome, telefone, email, nascimento, nomeMae };

    if (editingIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editingIndex] = newEntry;
      setTableData(updatedData);
    } else {
      setTableData(prevData => [...prevData, newEntry]);
    }
    resetFormAndExitEditing();
  };

  // Prepara o formulário para editar um item da tabela
  const handleEditItem = (indexToEdit: number) => {
    const item = tableData[indexToEdit];
    setCpf(item.cpf);
    setNome(item.nome);
    setTelefone(item.telefone);
    setEmail(item.email);
    setNascimento(item.nascimento);
    setNomeMae(item.nomeMae);
    setEditingIndex(indexToEdit);
  };

  // Remove um item da tabela
  const handleRemoveItem = (indexToRemove: number) => {
    setTableData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };

  // Processa os dados recebidos do componente de upload
  const handleDataLoadedFromFile = (data: any[]) => {
    setSuccessMessages([]);
    setErrorMessages([]);
    const validRows: TableData[] = [];
    const newSuccessMessages: string[] = [];
    const newErrorMessages: string[] = [];

    // Mapeamento dos campos obrigatórios e seus nomes amigáveis
    const requiredFields = {
      "CPF": "CPF",
      "Nome Completo": "Nome Completo",
      "DDD/Telefone": "DDD/Telefone",
      "E-mail do Beneficiário": "E-mail do Beneficiário",
      "Data de Nascimento": "Data de Nascimento",
      "Nome da Mãe": "Nome da Mãe"
    };

    data.forEach((row, index) => {
      const missingFields = [];
      for (const field in requiredFields) {
        if (!row[field] || String(row[field]).trim() === "") {
          missingFields.push(requiredFields[field as keyof typeof requiredFields]);
        }
      }

      if (missingFields.length > 0) {
        newErrorMessages.push(`Linha ${index + 2}: Campo(s) obrigatório(s) faltando - ${missingFields.join(', ')}.`);
      } else {
        const newRow = {
          cpf: row["CPF"],
          nome: row["Nome Completo"],
          telefone: row["DDD/Telefone"],
          email: row["E-mail do Beneficiário"],
          nascimento: row["Data de Nascimento"],
          nomeMae: row["Nome da Mãe"],
        };
        validRows.push(newRow);
        newSuccessMessages.push(`Registro da linha ${index + 2} (CPF: ${newRow.cpf}) adicionado à lista.`);
      }
    });

    if (validRows.length > 0) {
      setTableData(prevData => [...prevData, ...validRows]);
    }
    // Atualiza os estados de alerta para renderizar as caixas
    setSuccessMessages(newSuccessMessages);
    setErrorMessages(newErrorMessages);
  };

  const handleDownload = () => {
    if (!razaoSocial || !cnpj) {
      alert("Por favor, preencha a Razão Social e o CNPJ da empresa antes de baixar.");
      return;
    }

    const dataToDownload = tableData.map(item => ({
      "CNPJ": cnpj,
      "Razão Social": razaoSocial,
      "CPF": item.cpf,
      "Nome Completo": item.nome,
      "DDD/Telefone": item.telefone,
      "E-mail do Beneficiário": item.email,
      "Data de Nascimento": item.nascimento,
      "Nome da Mãe": item.nomeMae,
    }));
    downloadAsCSV(dataToDownload, 'cadastro_usuarios');
  };

  const handleDownloadSample = () => {
    // Define a estrutura e o conteúdo da planilha de exemplo
    const sampleData: string[][] = [
      ["CNPJ:", ""],
      ["RAZÃO SOCIAL:", ""],
      ["CPF", "Nome Completo", "DDD/Telefone", "E-mail do Beneficiário", "Data de Nascimento", "Nome da Mãe"],
      ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
      [
        "CPF do benefíciário\n(11 dígitos)\nExemplo: 12345678900",
        "Nome completo do funcionário\n(sem caracteres)\nExemplo: Joao da Silva Santos",
        "Informe o DDD e nº telefone celular\nExemplo: 61990909090",
        "Informe o e-mail do beneficiário\nExemplo: exemplo@email.com",
        "Data de nascimento do beneficiário\n(Formato DD/MM/AAAA)\nExemplo: 01/08/1990",
        "Nome completo da mãe do funcionário\nExemplo: Maria da Silva Santos"
      ]
    ];
    downloadSampleCSV(sampleData, "exemplo_cadastro_usuario");
  };

  const expectedHeadersForUpload = ["CPF", "Nome Completo", "DDD/Telefone", "E-mail do Beneficiário", "Data de Nascimento", "Nome da Mãe"];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-[1300px]">
          <Card className="bg-white rounded-[20px] shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <Nav />
                <div className="flex-1 px-8 py-6 min-w-0">
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">
                    Cadastrar Usuário
                  </h1>
                  {/* Formulário com os asteriscos */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <RequiredLabel>Razão Social:</RequiredLabel>
                      <Input value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Nome da empresa" />
                    </div>
                    <div>
                      <RequiredLabel>N° do CNPJ:</RequiredLabel>
                      <Input value={cnpj} onChange={e => setCnpj(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Digite o CNPJ" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <RequiredLabel>CPF:</RequiredLabel>
                      <Input value={cpf} onChange={e => setCpf(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="12345678900" />
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input value={nome} onChange={e => setNome(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="João da Silva Santos" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>DDD/Telefone:</RequiredLabel>
                      <Input value={telefone} onChange={e => setTelefone(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="61990909090" />
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>E-mail do Beneficiário:</RequiredLabel>
                      <Input value={email} onChange={e => setEmail(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="exemplo@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Data de Nascimento:</RequiredLabel>
                      <Input value={nascimento} onChange={e => setNascimento(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="01/08/1990" />
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome da mãe:</RequiredLabel>
                      <Input value={nomeMae} onChange={e => setNomeMae(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Maria da Silva Santos" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mb-6">
                    {editingIndex !== null && (
                      <Button onClick={resetFormAndExitEditing} variant="outline" className="px-8 py-2 rounded-full font-normal text-sm">Cancelar</Button>
                    )}
                    <Button onClick={handleRegisterOrUpdateClick} className="px-8 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm">
                      {editingIndex !== null ? "Salvar Alterações" : "Registrar"}
                    </Button>
                  </div>

                  <div className="mb-6">
                    <FileUpload
                      expectedHeaders={expectedHeadersForUpload}
                      onDataLoaded={handleDataLoadedFromFile}
                      onError={(errorMessage) => alert(errorMessage)}
                    />
                  </div>

                  {/* Renderização condicional dos alertas */}
                  <AlertBox
                    variant="error"
                    title="Erros na Importação"
                    messages={errorMessages}
                    onClose={() => setErrorMessages([])}
                  />
                  <AlertBox
                    variant="success"
                    title="Registros Adicionados com Sucesso"
                    messages={successMessages}
                    onClose={() => setSuccessMessages([])}
                  />
                  <SpreadsheetInstructions
                    instructions={cadastroUsuarioInstructions}
                    onDownloadSample={handleDownloadSample}
                  />



                  <TemporaryDataTable
                    headers={["CPF", "Nome", "Telefone", "E-mail", "Nascimento", "Nome da Mãe"]}
                    data={tableData}
                    dataKeys={["cpf", "nome", "telefone", "email", "nascimento", "nomeMae"]}
                    onRemoveItem={handleRemoveItem}
                    onEditItem={handleEditItem}
                    onDownloadClick={handleDownload}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};