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
import InputMask from "react-input-mask";
import { useFormAndTable } from "../../hooks/useFormAndTable";
import { bankDataSchema } from "../../lib/schemas/bankDataSchema";

const pageConfigs = {
  headerMapping: {
    banco: "N° do Banco",
    agencia: "N° da Agência",
    digitoAgencia: "Dígito da Agência",
    conta: "N° da Conta",
    digitoConta: "Dígito da Conta"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA CADASTRO/ALTERAÇÃO DE DADOS BANCÁRIOS"],
    [],
    ["N° do Banco", "N° da Agência", "Dígito da Agência", "N° da Conta", "Dígito da Conta"],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "Código do banco (3 dígitos)\nExemplo: 001",
      "Número da agência (4 dígitos)\nExemplo: 1234",
      "Dígito da agência (1 dígito)\nExemplo: 5",
      "Número da conta (9 dígitos)\nExemplo: 123456789",
      "Dígito da conta (1 dígito)\nExemplo: 0"
    ]
  ],
  fileNamePrefix: "Alterar_Usuario",
  instructions: [
    { field: "N° do Banco", rule: "Deve conter 3 dígitos.", example: "Exemplo: 001" },
    { field: "N° da Agência", rule: "Deve conter 4 dígitos.", example: "Exemplo: 1234" },
    { field: "Dígito da Agência", rule: "Deve conter 1 dígito.", example: "Exemplo: 5" },
    { field: "N° da Conta", rule: "Deve conter 9 dígitos.", example: "Exemplo: 123456789" },
    { field: "Dígito da Conta", rule: "Deve conter 1 dígito.", example: "Exemplo: 0" }
  ]
};

export const CadastrarAlterarDadosBancarios = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: bankDataSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    fileName: pageConfigs.fileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);

  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "Código do banco", "Número da agência", "Número da conta"
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
                  <h1 className="text-3xl font-normal text-center text-black mb-8 font-sans">
                    Cadastrar/Alterar Dados Bancários
                  </h1>
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
                      {states.formErrors.numeroContrato && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.numeroContrato === "Required" ? "Campo Obrigatório" : states.formErrors.numeroContrato}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 mb-8">
                    <div>
                      <RequiredLabel>N° do Banco:</RequiredLabel>
                      <Input
                        value={states.formData.banco || ""}
                        onChange={e => handlers.handleDataInputChange('banco', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="000"
                        maxLength={3}
                      />
                      {states.formErrors.banco && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.banco === "Required" ? "Campo Obrigatório" : states.formErrors.banco}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>N° da Agência:</RequiredLabel>
                      <Input
                        value={states.formData.agencia || ""}
                        onChange={e => handlers.handleDataInputChange('agencia', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="0000"
                        maxLength={4}
                      />
                      {states.formErrors.agencia && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.agencia === "Required" ? "Campo Obrigatório" : states.formErrors.agencia}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Dígito da Agência:</RequiredLabel>
                      <Input
                        value={states.formData.digitoAgencia || ""}
                        onChange={e => handlers.handleDataInputChange('digitoAgencia', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="0"
                        maxLength={1}
                      />
                      {states.formErrors.digitoAgencia && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.digitoAgencia === "Required" ? "Campo Obrigatório" : states.formErrors.digitoAgencia}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>N° da Conta:</RequiredLabel>
                      <Input
                        value={states.formData.conta || ""}
                        onChange={e => handlers.handleDataInputChange('conta', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="000000000"
                        maxLength={9}
                      />
                      {states.formErrors.conta && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.conta === "Required" ? "Campo Obrigatório" : states.formErrors.conta}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Dígito da Conta:</RequiredLabel>
                      <Input
                        value={states.formData.digitoConta || ""}
                        onChange={e => handlers.handleDataInputChange('digitoConta', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="0"
                        maxLength={1}
                      />
                      {states.formErrors.digitoConta && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.digitoConta === "Required" ? "Campo Obrigatório" : states.formErrors.digitoConta}
                        </p>
                      )}
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
                      instructionalKeywords={cardStatusInstructionKeywords}
                      onDataLoaded={handlers.handleDataLoadedFromFile}
                      onError={(errorMessage) => handlers.setErrorMessages([errorMessage])}
                    />
                  </div>
                  <SpreadsheetInstructions
                    instructions={pageConfigs.instructions}
                    onDownloadSample={handlers.handleDownloadSample}
                  />
                  <TemporaryDataTable
                    headers={["N° do Banco", "N° da Agência", "Dígito da Agência", "N° da Conta", "Dígito da Conta"]}
                    data={states.tableData}
                    dataKeys={["banco", "agencia", "digitoAgencia", "conta", "digitoConta"]}
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