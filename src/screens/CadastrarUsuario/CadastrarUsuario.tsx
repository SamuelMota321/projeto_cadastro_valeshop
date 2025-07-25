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
import { companySchema } from "../../lib/schemas/companySchema";
import { userSchema } from "../../lib/schemas/userSchema";
import InputMask from "react-input-mask";
import { useFormAndTable } from "../../hooks/useFormAndTable";

const pageConfigs = {
  headerMapping: {
    cpf: "CPF", nome: "Nome Completo", telefone: "DDD/Telefone",
    email: "E-mail do Beneficiário", nascimento: "Data de Nascimento", nomeMae: "Nome da Mãe"
  },
  sampleDataGenerator: () => [
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
  ],
  fileNamePrefix: "Alterar_Usuario",
  instructions: [
    { field: "CPF", rule: "Deve conter 11 dígitos", example: "Exemplo: 12345678900 ou 123.456.789-00" },
    { field: "Nome Completo", rule: "Escreva o nome completo, sem abreviações ou caracteres especiais.", example: "Exemplo: Joao da Silva Santos" },
    { field: "DDD/Telefone", rule: "Informe o DDD junto com o número de celular, sem espaços ou parênteses.", example: "Exemplo: 61990909090 ou (61) 99090-9090" },
    { field: "E-mail do Beneficiário", rule: "Utilize um formato de e-mail válido.", example: "Exemplo: exemplo@email.com" },
    { field: "Data de Nascimento", rule: "Siga o formato DD/MM/AAAA.", example: "Exemplo: 01/08/1990" },
    { field: "Nome da Mãe", rule: "Escreva o nome completo da mãe, sem abreviações.", example: "Exemplo: Maria da Silva Santos" }
  ]
};

export const CadastrarUsuario = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: userSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    fileName: pageConfigs.fileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);
  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "CPF do benefíciário", "Nome completo do funcionário",
    "Informe o DDD e nº telefone celular", "Informe o e-mail do beneficiário",
    "Data de nascimento do beneficiário", "Nome completo da mãe do funcionário"
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
                <form onSubmit={(e) => e.preventDefault()} className="flex-1 px-8 py-6 min-w-0">
                  <h1 className="text-3xl font-normal text-center text-black mb-8 font-sans">Cadastrar Usuário</h1>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <RequiredLabel>N° do contrato:</RequiredLabel>
                      <InputMask
                        mask="999.999.9999.99-99"
                        value={states.companyData.numeroContrato || ""}
                        onChange={e => handlers.handleCompanyInputChange('numeroContrato', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="000.000.0000.00-00"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.numeroContrato && <p className="text-red-500 text-xs mt-1">{states.formErrors.numeroContrato === "Required" ? "Campo Obrigatório" : states.formErrors.numeroContrato}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <RequiredLabel>CPF:</RequiredLabel>
                      <InputMask
                        mask="999.999.999-99"
                        value={states.formData.cpf || ""}
                        onChange={e => handlers.handleDataInputChange('cpf', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="000.000.000-00"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.cpf && <p className="text-red-500 text-xs mt-1">{states.formErrors.cpf === "Required" ? "Campo Obrigatório" : states.formErrors.cpf}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input value={states.formData.nome || ""} onChange={e => handlers.handleDataInputChange('nome', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="João da Silva Santos" />
                      {states.formErrors.nome && <p className="text-red-500 text-xs mt-1">{states.formErrors.nome === "Required" ? "Campo Obrigatório" : states.formErrors.nome}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>DDD/Telefone:</RequiredLabel>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={states.formData.telefone || ""}
                        onChange={e => handlers.handleDataInputChange('telefone', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="(00) 00000-0000"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.telefone && <p className="text-red-500 text-xs mt-1">{states.formErrors.telefone === "Required" ? "Campo Obrigatório" : states.formErrors.telefone}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>E-mail do Beneficiário:</RequiredLabel>
                      <Input value={states.formData.email || ""} onChange={e => handlers.handleDataInputChange('email', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="exemplo@email.com" />
                      {states.formErrors.email && <p className="text-red-500 text-xs mt-1">{states.formErrors.email === "Required" ? "Campo Obrigatório" : states.formErrors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Data de Nascimento:</RequiredLabel>
                      <InputMask
                        mask="99/99/9999"
                        value={states.formData.nascimento || ""}
                        onChange={e => handlers.handleDataInputChange('nascimento', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="00/00/0000"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.nascimento && <p className="text-red-500 text-xs mt-1">{states.formErrors.nascimento === "Required" ? "Campo Obrigatório" : states.formErrors.nascimento}</p>}
                    </div>
                    <div className="col-span-2">
                      <RequiredLabel>Nome da mãe:</RequiredLabel>
                      <Input value={states.formData.nomeMae || ""} onChange={e => handlers.handleDataInputChange('nomeMae', e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Maria da Silva Santos" />
                      {states.formErrors.nomeMae && <p className="text-red-500 text-xs mt-1">{states.formErrors.nomeMae === "Required" ? "Campo Obrigatório" : states.formErrors.nomeMae}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mb-6">
                    {states.editingIndex !== null && (
                      <Button onClick={handlers.resetFormAndExitEditing} variant="outline" className="px-8 py-2 rounded-full font-normal text-base">Cancelar</Button>
                    )}
                    <Button type="submit" onClick={handlers.handleRegisterOrUpdateClick} className="px-8 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-base">
                      {states.editingIndex !== null ? "Salvar Alterações" : "Registrar"}
                    </Button>
                  </div>

                  <AlertBox variant="error" title="Erros na Importação" messages={states.errorMessages} onClose={() => handlers.setErrorMessages([])} />
                  <AlertBox variant="success" title="Importação Concluída" messages={states.successMessages} onClose={() => handlers.setSuccessMessages([])} />

                  <div className="mb-6">
                    <FileUpload
                      expectedHeaders={expectedHeadersForUpload}
                      instructionalKeywords={cardStatusInstructionKeywords} // <-- PASSE A PROPRIEDADE
                      onDataLoaded={handlers.handleDataLoadedFromFile}
                      onError={(errorMessage) => handlers.setErrorMessages([errorMessage])}
                    />
                  </div>
                  <SpreadsheetInstructions
                    instructions={pageConfigs.instructions}
                    onDownloadSample={handlers.handleDownloadSample}
                  />
                  <TemporaryDataTable
                    headers={["CPF", "Nome", "Telefone", "E-mail", "Nascimento", "Nome da Mãe"]}
                    data={states.tableData}
                    dataKeys={["cpf", "nome", "telefone", "email", "nascimento", "nomeMae"]}
                    onRemoveItem={handlers.handleRemoveItem}
                    onEditItem={handlers.handleEditItem}
                    onSubmit={handlers.handleSubmit}
                  />
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};