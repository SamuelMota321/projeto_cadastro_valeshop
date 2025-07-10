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
import { alterCardStatusSchema } from "../../lib/schemas/alterCardStatusSchema";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const pageConfigs = {
  headerMapping: {
    cpf: "CPF",
    nome: "Nome Completo",
    movimentacao: "Tipo de Movimentação"
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA ALTERAÇÃO DE STATUS DO CARTÃO"],
    [],
    ["CPF", "Nome Completo", "Tipo de Movimentação"],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "CPF do benefíciário\n(11 dígitos)\nExemplo: 12345678900",
      "Nome completo do funcionário\nExemplo: Joao da Silva Santos",
      "Informe o tipo de movimentação: Ativar, Cancelar, Inativar, Bloquear"
    ]
  ],
  downloadFileNamePrefix: "Alterar_Status_Cartao",
  instructions: [
    { field: "CPF", rule: "Deve conter 11 dígitos", example: "Exemplo: 12345678900 ou 123.456.789-00" },
    { field: "Nome Completo", rule: "Nome completo, sem abreviações.", example: "Exemplo: Joao da Silva Santos" },
    { field: "Tipo de Movimentação", rule: "Ativar, Cancelar, Inativar ou Bloquear.", example: "Exemplo: Ativar" }
  ]
};

export const AlterarStatusCartao = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: alterCardStatusSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    downloadFileName: pageConfigs.downloadFileNamePrefix,
  });

  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "CPF do benefíciário", "Nome completo do funcionário",
    "Informe o tipo de movimentação"
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
                <div className="flex-1 px-8 py-6 min-w-0">
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">
                    Alterar status do cartão
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
                      {states.formErrors.numeroContrato && <p className="text-red-500 text-xs mt-1">{states.formErrors.numeroContrato === "Required" ? "Campo Obrigatório" : states.formErrors.numeroContrato}</p>}
                    </div>
                  </div>

                  <div className="gap-4 mb-4">
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <RequiredLabel>Nome Completo:</RequiredLabel>
                      <Input
                        value={states.formData.nome || ""}
                        onChange={e => handlers.handleDataInputChange('nome', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="João da Silva Santos"
                      />
                      {states.formErrors.nome && <p className="text-red-500 text-xs mt-1">{states.formErrors.nome === "Required" ? "Campo Obrigatório" : states.formErrors.nome}</p>}
                    </div>

                    <div>
                      <RequiredLabel>Tipo de Movimentação:</RequiredLabel>
                      <Select
                        value={states.formData.movimentacao || ""}
                        onValueChange={value => handlers.handleDataInputChange('movimentacao', value)}
                      >
                        <SelectTrigger
                          className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativar">Ativar</SelectItem>
                          <SelectItem value="Cancelar">Cancelar</SelectItem>
                          <SelectItem value="Inativar">Inativar</SelectItem>
                          <SelectItem value="Bloquear">Bloquear</SelectItem>
                        </SelectContent>
                      </Select>
                      {states.formErrors.movimentacao && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.movimentacao === "Required"
                            ? "Campo Obrigatório"
                            : states.formErrors.movimentacao}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">

                  </div>

                  <div className="flex justify-end space-x-4 mb-6">
                    {states.editingIndex !== null && (
                      <Button onClick={handlers.resetFormAndExitEditing} variant="outline" className="px-8 py-2 rounded-full font-normal text-sm">Cancelar</Button>
                    )}
                    <Button onClick={handlers.handleRegisterOrUpdateClick} className="px-8 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm">
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
                    headers={["CPF", "Nome Completo", "Tipo de Movimentação"]}
                    data={states.tableData}
                    dataKeys={["cpf", "nome", "movimentacao"]}
                    onRemoveItem={handlers.handleRemoveItem}
                    onEditItem={handlers.handleEditItem}
                    onDownloadClick={handlers.handleDownload}
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