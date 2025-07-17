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
import { newCardNewUser } from "../../lib/schemas/newCardNewUser";


const pageConfigs = {
  headerMapping: {
    cpf: "CPF",
    matricula: "Matrícula",
    departamento: "Departamento"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA ESTORNO DE DÉBITO PARA CARTÃO"],
    [],
    ["CPF", "Matrícula", "Departamento",],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OPCIONAL"],
    [
      "CPF do beneficiário (11 dígitos)\nExemplo: 12345678900",
      "Matrícula do beneficiário\nExemplo: 123456",
      "Departamento do beneficiário\nExemplo: Vendas"
    ]
  ],
  fileNamePrefix: "Novo_Cartao_Novo_Usuario",
  instructions: [
    { field: "CPF", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678900" },
    { field: "Matrícula", rule: "Matrícula do beneficiário, sem abreviações.", example: "Exemplo: 123456" },
    { field: "Departamento", rule: "Departamento do beneficiário, sem abreviações.", example: "Exemplo: Vendas" },
  ]
};

export const NovoCartaoNovoUsuario = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: newCardNewUser,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    fileName: pageConfigs.fileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);
  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "CPF do beneficiário", "Matrícula do beneficiário", "OPCIONAL"
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-[1300px]">
          <Card className="bg-white  / ded-[20px] shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <Nav />
                <form onSubmit={(e) => e.preventDefault()} className="flex-1 px-8 py-6 min-w-0">
                  <h1 className="text-3xl font-normal text-center text-black mb-8 font-sans">
                    Estorno de Débito para Cartão
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
                  <div className="grid grid-cols-2 gap-4 mb-8">
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
                      {states.formErrors.cpf && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.cpf === "Required" ? "Campo Obrigatório" : states.formErrors.cpf}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Matrícula:</RequiredLabel>
                      <Input
                        value={states.formData.matricula || ""}
                        onChange={e => handlers.handleDataInputChange('matricula', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="João da Silva"
                      />
                      {states.formErrors.matricula && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.matricula === "Required" ? "Campo Obrigatório" : states.formErrors.matricula}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                      <label className="block text-base font-medium mb-1">Departamento (Opcional):</label>
                      <Input
                        value={states.formData.departamento || ""}
                        onChange={e => handlers.handleDataInputChange('departamento', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="Recursos Humanos"
                      />
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
                    headers={["CPF", "Matrícula", "Departamento"]}
                    data={states.tableData}
                    dataKeys={["cpf", "matricula", "departamento"]}
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