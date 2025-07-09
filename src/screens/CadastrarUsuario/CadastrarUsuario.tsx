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
import { SpreadsheetInstructions } from "../../components/ui/spreadsheetInstructions";
import { downloadAsCSV, downloadSampleCSV } from "../../lib/utils";
import { companySchema, CompanySchemaType } from "../../lib/schemas/companySchema";
import { userSchema, UserSchemaType } from "../../lib/schemas/userSchema";
import InputMask from "react-input-mask";

export const CadastrarUsuario = (): JSX.Element => {
  const [contractData, setContractData] = useState<Partial<CompanySchemaType>>({});
  const [formData, setFormData] = useState<Partial<UserSchemaType>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [tableData, setTableData] = useState<(UserSchemaType & CompanySchemaType)[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleContractInputChange = (value: string) => {
    setContractData({ numeroContrato: value });
    if (formErrors.numeroContrato) {
      setFormErrors(prev => ({ ...prev, numeroContrato: undefined }));
    }
  };

  const handleUserInputChange = (field: keyof UserSchemaType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetFormAndExitEditing = () => {
    setFormData({});
    setEditingIndex(null);
    setFormErrors(prevErrors => ({ numeroContrato: prevErrors.numeroContrato }));
  };

  const handleRegisterOrUpdateClick = () => {
    const contractResult = companySchema.safeParse(contractData);
    const userResult = userSchema.safeParse(formData);

    if (contractResult.success && userResult.success) {
      setFormErrors({});

      const newEntry = { ...contractResult.data, ...userResult.data };

      if (editingIndex !== null) {
        const updatedData = [...tableData];
        updatedData[editingIndex] = newEntry;
        setTableData(updatedData);
      } else {
        setTableData(prevData => [...prevData, newEntry]);
      }
      resetFormAndExitEditing();

    } else {
      const newErrors: Record<string, string | undefined> = {};
      if (!contractResult.success) {
        contractResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      if (!userResult.success) {
        userResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      setFormErrors(newErrors);
    }
  };

  const handleEditItem = (indexToEdit: number) => {
    const item = tableData[indexToEdit];
    setContractData({ numeroContrato: item.numeroContrato });
    setFormData({
      cpf: item.cpf, nome: item.nome, telefone: item.telefone,
      email: item.email, nascimento: item.nascimento, nomeMae: item.nomeMae,
    });
    setEditingIndex(indexToEdit);
    setFormErrors({});
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setTableData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };


  const handleDataLoadedFromFile = (data: any[]) => {
    setSuccessMessages([]);
    setErrorMessages([]);
    const contractResult = companySchema.safeParse(contractData);
    if (!contractResult.success) {
      setFormErrors({ numeroContrato: contractResult.error.issues[0].message });
      alert("Por favor, preencha o N° do contrato antes de fazer o upload do arquivo.");
      return;
    }
    const validContractData = contractResult.data;

    const newErrorMessages: string[] = [];
    const validRows: (UserSchemaType & CompanySchemaType)[] = [];

    const headerMapping = {
      cpf: "CPF", nome: "Nome Completo", telefone: "DDD/Telefone",
      email: "E-mail do Beneficiário", nascimento: "Data de Nascimento", nomeMae: "Nome da Mãe"
    };

    data.forEach((row, index) => {
      const rowData = {
        cpf: row[headerMapping.cpf], nome: row[headerMapping.nome], telefone: row[headerMapping.telefone],
        email: row[headerMapping.email], nascimento: row[headerMapping.nascimento], nomeMae: row[headerMapping.nomeMae]
      };
      const userResult = userSchema.safeParse(rowData);

      if (userResult.success) {
        validRows.push({ ...validContractData, ...userResult.data });
      } else {
        const errorDetails = userResult.error.issues.map(issue => issue.message).join('; ');
        newErrorMessages.push(`Linha ${index + 2}: ${errorDetails}`); // +2 para pular o cabeçalho do arquivo
      }
    });

    if (validRows.length > 0) {
      setTableData(prevData => [...prevData, ...validRows]);
      setSuccessMessages([`Total de ${validRows.length} registros válidos foram importados.`]);
    }
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
    } else if (data.length > 0 && validRows.length === 0) {
      setErrorMessages(['Nenhum dado válido foi encontrado no arquivo. Verifique o formato e o conteúdo das colunas.']);
    } else if (data.length === 0) {
      setErrorMessages(['O arquivo parece estar vazio ou não contém dados para importar.']);
    }
  };


  const handleDownloadSample = () => {
    const sampleData: string[][] = [
      ["", "PLANILHA PARA CADASTRO DOS DADOS"],
      [],
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

  const handleDownload = () => {
    setErrorMessages([]);
    setSuccessMessages([]);
    const contractResult = companySchema.safeParse(contractData);
    if (!contractResult.success) {
      setFormErrors({ numeroContrato: contractResult.error.issues[0].message });
      alert("Por favor, preencha o N° do contrato antes de baixar.");
      return;
    }
    if (tableData.length === 0) {
      alert("Não há dados na tabela para baixar.");
      return;
    }

    const filename = `${contractResult.data.numeroContrato}_Cadastrar_Usuario`;
    const dataToDownload = tableData.map(item => ({
      "CPF": item.cpf,
      "Nome Completo": item.nome,
      "DDD/Telefone": item.telefone,
      "E-mail do Beneficiário": item.email,
      "Data de Nascimento": item.nascimento,
      "Nome da Mãe": item.nomeMae,
    }));
    downloadAsCSV(dataToDownload, filename);
  };

  const expectedHeadersForUpload = ["CPF", "Nome Completo", "DDD/Telefone", "E-mail do Beneficiário", "Data de Nascimento", "Nome da Mãe"];
  const cadastroUsuarioInstructions = [
    { field: "CPF", rule: "Deve conter 11 dígitos", example: "Exemplo: 12345678900 ou 123.456.789-00" },
    { field: "Nome Completo", rule: "Escreva o nome completo, sem abreviações ou caracteres especiais.", example: "Exemplo: Joao da Silva Santos" },
    { field: "DDD/Telefone", rule: "Informe o DDD junto com o número de celular, sem espaços ou parênteses.", example: "Exemplo: 61990909090 ou (61) 99090-9090" },
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


                  <div className="grid grid-cols-1  gap-4 mb-4">
                    <div>
                      <RequiredLabel>N° do contrato:</RequiredLabel>
                      <InputMask
                        mask="999.999.999999.99/99"
                        value={contractData.numeroContrato || ""}
                        onChange={e => handleContractInputChange(e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                      >
                        {(inputProps) => <Input {...inputProps} type="text" placeholder="000.000.000000.00/00" />}
                      </InputMask>
                      {formErrors.numeroContrato && <p className="text-red-500 text-xs mt-1">{formErrors.numeroContrato == "Required" ? "Campo obrigatório" : formErrors.numeroContrato}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <RequiredLabel>CPF:</RequiredLabel>
                      <InputMask
                        mask="999.999.999-99"
                        value={formData.cpf || ""}
                        onChange={e => handleUserInputChange('cpf', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                      >
                        {(inputProps) => <Input {...inputProps} type="text" placeholder="000.000.000-00" />}
                      </InputMask>
                      {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf == "Required" ? "Campo obrigatório" : formErrors.cpf}</p>}
                    </div>

                    <div className="col-span-2">
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input
                        value={formData.nome || ""}
                        onChange={e => handleUserInputChange('nome', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="João da Silva Santos" />
                      {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome == "Required" ? "Campo obrigatório" : formErrors.nome}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>DDD/Telefone:</RequiredLabel>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={formData.telefone || ""}
                        onChange={e => handleUserInputChange('telefone', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                      >
                        {(inputProps) => <Input {...inputProps} type="text" placeholder="(00) 00000-0000" />}
                      </InputMask>
                      {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone == "Required" ? "Campo obrigatório" : formErrors.telefone}</p>}
                    </div>

                    <div className="col-span-2">
                      <RequiredLabel>E-mail do Beneficiário:</RequiredLabel>
                      <Input
                        value={formData.email || ""}
                        onChange={e => handleUserInputChange('email', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="exemplo@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email == "Required" ? "Campo obrigatório" : formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Data de Nascimento:</RequiredLabel>
                      <Input
                        type="date"
                        value={formData.nascimento || ""}
                        onChange={e => handleUserInputChange('nascimento', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                      />
                      {formErrors.nascimento && <p className="text-red-500 text-xs mt-1">{formErrors.nascimento == "Required" ? "Campo obrigatório" : formErrors.nascimento}</p>}
                    </div>

                    <div className="col-span-2">
                      <RequiredLabel>Nome da mãe:</RequiredLabel>
                      <Input
                        value={formData.nomeMae || ""}
                        onChange={e => handleUserInputChange('nomeMae', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="Maria da Silva Santos"
                      />
                      {formErrors.nomeMae && <p className="text-red-500 text-xs mt-1">{formErrors.nomeMae == "Required" ? "Campo obrigatório" : formErrors.nomeMae}</p>}
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