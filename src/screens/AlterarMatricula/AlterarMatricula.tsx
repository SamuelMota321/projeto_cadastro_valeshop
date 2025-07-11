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
import { alterMatriculaSchema } from "../../lib/schemas/alterMatriculaSchema";

const pageConfigs = {
  headerMapping: {
    matriculaAntiga: "Matrícula Antiga",
    matriculaNova: "Matrícula Nova"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA ALTERAÇÃO DE MATRÍCULA"],
    [],
    ["Matrícula Antiga", "Matrícula Nova"],
    ["OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "Matrícula antiga do funcionário\n(11 dígitos)\nExemplo: 12345678900",
      "Nova matrícula do funcionário\n(11 dígitos)\nExemplo: 00987654321"
    ]
  ],
  downloadFileNamePrefix: "Alterar_Matricula",
  instructions: [
    { field: "Matrícula Antiga", rule: "Deve conter 11 dígitos", example: "Exemplo: 12345678900" },
    { field: "Matrícula Nova", rule: "Deve conter 11 dígitos", example: "Exemplo: 00987654321" }
  ]
};

export const AlterarMatricula = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: alterMatriculaSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    downloadFileName: pageConfigs.downloadFileNamePrefix,
  });

  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "Matrícula antiga do funcionário", "Nova matrícula do funcionário"
  ];
  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);

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
                    Alteração de Matrícula
                  </h1>
                  <div className="mb-6">
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <RequiredLabel>Matrícula Antiga:</RequiredLabel>
                      <Input
                        value={states.formData.matriculaAntiga || ""}
                        onChange={e => handlers.handleDataInputChange('matriculaAntiga', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="12345678900"
                        maxLength={11}
                      />
                      {states.formErrors.matriculaAntiga && <p className="text-red-500 text-xs mt-1">{states.formErrors.matriculaAntiga === "Required" ? "Campo Obrigatório" : states.formErrors.matriculaAntiga}</p>}
                    </div>
                    <div>
                      <RequiredLabel>Matrícula Nova:</RequiredLabel>
                      <Input
                        value={states.formData.matriculaNova || ""}
                        onChange={e => handlers.handleDataInputChange('matriculaNova', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="00987654321"
                        maxLength={11}
                      />
                      {states.formErrors.matriculaNova && <p className="text-red-500 text-xs mt-1">{states.formErrors.matriculaNova === "Required" ? "Campo Obrigatório" : states.formErrors.matriculaNova}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mb-6">
                    {states.editingIndex !== null && (
                      <Button onClick={handlers.resetFormAndExitEditing} variant="outline" className="px-8 py-2 rounded-full font-normal text-sm">Cancelar</Button>
                    )}
                    <Button type="submit" onClick={handlers.handleRegisterOrUpdateClick} className="px-8 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm">
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
                    headers={["Matrícula Antiga", "Matrícula Nova"]}
                    data={states.tableData}
                    dataKeys={["matriculaAntiga", "matriculaNova"]}
                    onRemoveItem={handlers.handleRemoveItem}
                    onEditItem={handlers.handleEditItem}
                    onDownloadClick={handlers.handleDownload}
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