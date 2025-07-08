import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Nav } from "../../components/ui/nav";
import { Header } from "../../components/ui/header";
import { TemporaryDataTable } from "../../components/ui/temporaryDataTable";
import { FileUpload } from "../../components/ui/fileUpload";
import { AlertBox } from "../../components/ui/alertBox";
import { RequiredLabel } from "../../components/ui/requiredLabel";
import { SpreadsheetInstructions } from "../../components/ui/SpreadsheetInstructions";
import { downloadAsCSV, downloadSampleCSV } from "../../lib/utils";
import { userSchema, UserSchemaType } from "../../lib/schemas/userSchema";
import { ZodIssue } from "zod";

export const CadastrarUsuario = (): JSX.Element => {
  // Estados para os dados da empresa
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");

  // Estado unificado para os dados do formulário do usuário
  const [formData, setFormData] = useState<Partial<UserSchemaType>>({});

  // Estado para armazenar os erros de validação do formulário manual
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  // Estados para a tabela, edição e alertas de feedback
  const [tableData, setTableData] = useState<UserSchemaType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Atualiza o estado do formulário e limpa o erro do campo correspondente
  const handleInputChange = (field: keyof UserSchemaType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Limpa o formulário e sai do modo de edição
  const resetFormAndExitEditing = () => {
    setFormData({});
    setEditingIndex(null);
    setFormErrors({});
  };

  // Valida e adiciona/atualiza um registro do formulário manual
  const handleRegisterOrUpdateClick = () => {
    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string | undefined> = {};
      result.error.issues.forEach(issue => {
        errors[issue.path[0]] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    const newEntry = result.data;

    if (editingIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editingIndex] = newEntry;
      setTableData(updatedData);
    } else {
      setTableData(prevData => [...prevData, newEntry]);
    }
    resetFormAndExitEditing();
  };

  // Carrega um item da tabela no formulário para edição
  const handleEditItem = (indexToEdit: number) => {
    setFormData(tableData[indexToEdit]);
    setEditingIndex(indexToEdit);
    setFormErrors({});
  };

  // Remove um item da tabela
  const handleRemoveItem = (indexToRemove: number) => {
    setTableData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };

  // Processa e valida os dados de um arquivo carregado
  const handleDataLoadedFromFile = (data: any[]) => {
    setSuccessMessages([]);
    setErrorMessages([]);

    const newErrorMessages: string[] = [];
    const validRows: UserSchemaType[] = [];

    const headerMapping = {
      cpf: "CPF", nome: "Nome Completo", telefone: "DDD/Telefone",
      email: "E-mail do Beneficiário", nascimento: "Data de Nascimento", nomeMae: "Nome da Mãe"
    };

    data.forEach((row, index) => {
      const rowData = {
        cpf: row[headerMapping.cpf], nome: row[headerMapping.nome], telefone: row[headerMapping.telefone],
        email: row[headerMapping.email], nascimento: row[headerMapping.nascimento], nomeMae: row[headerMapping.nomeMae]
      };

      const result = userSchema.safeParse(rowData);

      if (result.success) {
        validRows.push(result.data);
      } else {
        result.error.issues.forEach((issue: ZodIssue) => {
          const fieldName = Object.keys(headerMapping).find(key => key === issue.path[0]);
          const friendlyFieldName = fieldName ? headerMapping[fieldName as keyof typeof headerMapping] : issue.path[0];
          newErrorMessages.push(`Linha ${index + 2}: Coluna '${friendlyFieldName}' - ${issue.message}`);
        });
      }
    });

    if (validRows.length > 0) {
      setTableData(prevData => [...prevData, ...validRows]);
      setSuccessMessages([`Total de ${validRows.length} registros válidos foram importados.`]);
    }
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
    }
  };

  // Gera e baixa a planilha de exemplo
  const handleDownloadSample = () => {
    const sampleData: string[][] = [
      ["CNPJ:", cnpj],
      ["RAZÃO SOCIAL:", razaoSocial],
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

  // Gera e baixa os dados da tabela
  const handleDownload = () => {
    if (!razaoSocial || !cnpj) {
      alert("Por favor, preencha a Razão Social e o CNPJ da empresa antes de baixar.");
      return;
    }
    const dataToDownload = tableData.map(item => ({
      "CNPJ": cnpj, "Razão Social": razaoSocial, "CPF": item.cpf,
      "Nome Completo": item.nome, "DDD/Telefone": item.telefone,
      "E-mail do Beneficiário": item.email, "Data de Nascimento": item.nascimento, "Nome da Mãe": item.nomeMae,
    }));
    downloadAsCSV(dataToDownload, 'cadastro_usuarios_preenchido');
  };

  const expectedHeadersForUpload = ["CPF", "Nome Completo", "DDD/Telefone", "E-mail do Beneficiário", "Data de Nascimento", "Nome da Mãe"];

  const cadastroUsuarioInstructions = [
    { field: "CPF", rule: "Deve conter 11 dígitos, sem pontos ou traços.", example: "Exemplo: 12345678900" },
    { field: "Nome Completo", rule: "Escreva o nome completo, sem abreviações ou caracteres especiais.", example: "Exemplo: Joao da Silva Santos" },
    { field: "DDD/Telefone", rule: "Informe o DDD junto com o número de celular, sem espaços ou parênteses.", example: "Exemplo: 61990909090" },
    { field: "E-mail do Beneficiário", rule: "Utilize um formato de e-mail válido.", example: "Exemplo: exemplo@email.com" },
    { field: "Data de Nascimento", rule: "Siga o formato DD/MM/AAAA.", example: "Exemplo: 01/08/1990" },
    { field: "Nome da Mãe", rule: "Escreva o nome completo da mãe, sem abreviações.", example: "Exemplo: Maria da Silva Santos" }
  ];

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
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">Cadastrar Usuário</h1>

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
                      <Input value={formData.cpf || ""} onChange={e => handleInputChange('cpf', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="12345678900" />
                      {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input value={formData.nome || ""} onChange={e => handleInputChange('nome', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="João da Silva Santos" />
                      {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>DDD/Telefone:</RequiredLabel>
                      <Input value={formData.telefone || ""} onChange={e => handleInputChange('telefone', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="61990909090" />
                      {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>E-mail do Beneficiário:</RequiredLabel>
                      <Input value={formData.email || ""} onChange={e => handleInputChange('email', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="exemplo@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Data de Nascimento:</RequiredLabel>
                      <Input value={formData.nascimento || ""} onChange={e => handleInputChange('nascimento', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="01/08/1990" />
                      {formErrors.nascimento && <p className="text-red-500 text-xs mt-1">{formErrors.nascimento}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome da mãe:</RequiredLabel>
                      <Input value={formData.nomeMae || ""} onChange={e => handleInputChange('nomeMae', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Maria da Silva Santos" />
                      {formErrors.nomeMae && <p className="text-red-500 text-xs mt-1">{formErrors.nomeMae}</p>}
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

                  
                  <AlertBox variant="error" title="Erros na Importação" messages={errorMessages} onClose={() => setErrorMessages([])} />
                  <AlertBox variant="success" title="Importação Concluída" messages={successMessages} onClose={() => setSuccessMessages([])} />

                  <div className="mb-6">
                    <FileUpload
                      expectedHeaders={expectedHeadersForUpload}
                      onDataLoaded={handleDataLoadedFromFile}
                      onError={(errorMessage) => setErrorMessages([errorMessage])}
                    />
                  </div>

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