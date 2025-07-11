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
import { creditDebitSchema } from "../../lib/schemas/cardDebitSchema";


const pageConfigs = {
  headerMapping: {
    cpf: "CPF",
    nome: "Nome Completo",
    valorCredito: "Valor de Crédito"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA ESTORNO DE DÉBITO PARA CARTÃO"],
    [],
    ["CPF", "Nome Completo", "Valor de Crédito",],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "CPF do beneficiário (11 dígitos)\nExemplo: 12345678900",
      "Nome completo do beneficiário\nExemplo: João da Silva",
      "Valor de crédito (número)\nExemplo: 1000,00"
    ]
  ],
  downloadFileNamePrefix: "estorno_debito_cartao",
  instructions: [
    { field: "CPF", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678900" },
    { field: "Nome Completo", rule: "Nome completo, sem abreviações.", example: "Exemplo: João da Silva" },
    { field: "Valor de Crédito", rule: "Deve ser um número positivo. O uso de 'R$' é opcional. As casas decimais podem ser separados com  '.' (PONTO) ou ',' (VÍRGULA).", example: "Exemplos: R$ 1000,00 / 1000 / 1000.00 / 1000,00" },
  ]
};

export const EstornoDebito = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: creditDebitSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    downloadFileName: pageConfigs.downloadFileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);
  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "CPF do beneficiário", "Nome completo do beneficiário", "OPCIONAL"
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
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">
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
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input
                        value={states.formData.nome || ""}
                        onChange={e => handlers.handleDataInputChange('nome', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="João da Silva"
                      />
                      {states.formErrors.nome && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.nome === "Required" ? "Campo Obrigatório" : states.formErrors.nome}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium mb-1">Valor do Crédito:</label>
                      <Input
                        type="number"
                        value={states.formData.valorCredito || ""}
                        onChange={e => handlers.handleDataInputChange('valorCredito', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="1000,00"
                      />
                      {states.formErrors.valorCredito && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.valorCredito === "Required" ? "Campo Obrigatório" : states.formErrors.valorCredito}
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
                    headers={["CPF", "Nome Completo", "Valor do Crédito", "Departamento"]}
                    data={states.tableData}
                    dataKeys={["cpf", "nome", "valorCredito", "departamento"]}
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