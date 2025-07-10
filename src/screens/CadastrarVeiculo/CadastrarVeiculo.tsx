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
import { vehicleSchema } from "../../lib/schemas/vehicleSchema";

const pageConfigs = {
  headerMapping: {
    renavam: "Renavam",
    placa: "Placa",
    chassi: "Chassi",
    anoFabricacao: "Ano de Fabricação",
    modeloId: "ID do Modelo do Veículo"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA CADASTRO DE VEÍCULO"],
    [],
    ["Renavam", "Placa", "Chassi", "Ano de Fabricação", "ID do Modelo do Veículo"],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "Renavam do veículo (11 dígitos)\nExemplo: 12345678901",
      "Placa do veículo\nExemplo: ABC-1234 ou AB1C234",
      "Chassi do veículo (17 caracteres) Deve seguir o seguinte formato: 1 Número, 9 Letras ou números e 6 Números.\nExemplo: 9BWZZZ377VT004251",
      "Ano de fabricação (4 dígitos)\nExemplo: 2020",
      "ID do modelo do veículo (3 dígitos)\nExemplo: 123"
    ]
  ],
  downloadFileNamePrefix: "Cadastrar_Veiculo",
  instructions: [
    { field: "Renavam", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678901" },
    { field: "Placa", rule: "Formato LLL-NNNN ou LLLNLNN.", example: "Exemplo: ABC-1234 ou AB1C234" },
    { field: "Chassi", rule: "Deve seguir o seguinte formato: 1 Número, 9 Letras ou números e 6 Números.", example: "Exemplo: 9BWZZZ377VT004251" },
    { field: "Ano de Fabricação", rule: "Deve conter 4 dígitos.", example: "Exemplo: 2020" },
    { field: "ID do Modelo do Veículo", rule: "Deve conter 3 dígitos.", example: "Exemplo: 123" }
  ]
};

export const CadastrarVeiculo = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: vehicleSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    downloadFileName: pageConfigs.downloadFileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);
  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "Renavam do veículo", "Placa do veículo", "Chassi do veículo",
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
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">
                    Cadastro de Veículo
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
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Renavam:</RequiredLabel>
                      <InputMask
                        mask="99999999999"
                        value={states.formData.renavam || ""}
                        onChange={e => handlers.handleDataInputChange('renavam', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="12345678901"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.renavam && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.renavam === "Required" ? "Campo Obrigatório" : states.formErrors.renavam}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Placa:</RequiredLabel>
                      <Input
                        value={states.formData.placa || ""}
                        onChange={e => handlers.handleDataInputChange('placa', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm uppercase"
                        placeholder="ABC-1234 ou AB1C234"
                        maxLength={7}
                      />
                      {states.formErrors.placa && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.placa === "Required" ? "Campo Obrigatório" : states.formErrors.placa}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Chassi:</RequiredLabel>
                      <Input
                        value={states.formData.chassi || ""}
                        onChange={e => handlers.handleDataInputChange('chassi', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm uppercase"
                        placeholder="9BWZZZ377VT004251"
                        maxLength={17}
                      />
                      {states.formErrors.chassi && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.chassi === "Required" ? "Campo Obrigatório" : states.formErrors.chassi}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Ano de Fabricação:</RequiredLabel>
                      <InputMask
                        mask="9999"
                        value={states.formData.anoFabricacao || ""}
                        onChange={e => handlers.handleDataInputChange('anoFabricacao', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="2020"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.anoFabricacao && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.anoFabricacao === "Required" ? "Campo Obrigatório" : states.formErrors.anoFabricacao}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>ID do Modelo do Veículo:</RequiredLabel>
                      <InputMask
                        mask="999"
                        value={states.formData.modeloId || ""}
                        onChange={e => handlers.handleDataInputChange('modeloId', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            type="text"
                            placeholder="123"
                            className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                          />
                        )}
                      </InputMask>
                      {states.formErrors.modeloId && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.modeloId === "Required" ? "Campo Obrigatório" : states.formErrors.modeloId}
                        </p>
                      )}
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
                    headers={[
                      "Renavam",
                      "Placa",
                      "Chassi",
                      "Ano de Fabricação",
                      "ID do Modelo do Veículo"
                    ]}
                    data={states.tableData}
                    dataKeys={["renavam", "placa", "chassi", "anoFabricacao", "modeloId"]}
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