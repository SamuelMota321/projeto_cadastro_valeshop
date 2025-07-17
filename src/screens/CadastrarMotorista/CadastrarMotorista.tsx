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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { driverSchema } from "../../lib/schemas/driverSchema";


const pageConfigs = {
  headerMapping: {
    matricula: "Matrícula",
    nome: "Nome Completo",
    cpf: "CPF",
    validadeCnh: "Data de Validade CNH",
    numeroCnh: "Número CNH",
    categoriaCnh: "Categoria CNH",
  },
  sampleDataGenerator: () => [
    ["", "PLANILHA PARA CADASTRO DE MOTORISTA"],
    [],
    ["Matrícula", "Nome Completo", "CPF", "Data de Validade CNH", "Número CNH", "Categoria CNH"],
    ["OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO", "OBRIGATÓRIO"],
    [
      "Matrícula do motorista (11 dígitos)\nExemplo: 12345678900",
      "Nome completo do motorista\nExemplo: João da Silva",
      "CPF do motorista (11 dígitos)\nExemplo: 12345678900",
      "Data de validade da CNH (DD/MM/AAAA)\nExemplo: 01/01/2030",
      "Número da CNH (11 dígitos)\nExemplo: 12345678900",
      "Categoria da CNH\nExemplo: B"
    ]
  ],
  fileNamePrefix: "Cadastrar_Motorista",
  instructions: [
    { field: "Matrícula", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678900" },
    { field: "Nome Completo", rule: "Nome completo, sem abreviações.", example: "Exemplo: João da Silva" },
    { field: "CPF", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678900" },
    { field: "Data de Validade CNH", rule: "Formato DD/MM/AAAA.", example: "Exemplo: 01/01/2030" },
    { field: "Número CNH", rule: "Deve conter 11 dígitos.", example: "Exemplo: 12345678900" },
    { field: "Categoria CNH", rule: "Selecione uma das opções.", example: "Exemplo: B" }
  ]
};

export const CadastrarMotorista = (): JSX.Element => {
  const { states, handlers } = useFormAndTable({
    dataSchema: driverSchema,
    companySchema,
    headerMapping: pageConfigs.headerMapping,
    sampleDataGenerator: pageConfigs.sampleDataGenerator,
    fileName: pageConfigs.fileNamePrefix,
  });

  const expectedHeadersForUpload = Object.values(pageConfigs.headerMapping);
  const cardStatusInstructionKeywords = [
    "OBRIGATÓRIO", "Exemplo:", "Matrícula do motorista (11 dígitos)",
    "Nome completo do motorista", "CPF do motorista (11 dígitos)",
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
                    Cadastro de Motorista
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
                      <RequiredLabel>Matrícula:</RequiredLabel>
                      <Input
                        value={states.formData.matricula || ""}
                        onChange={e => handlers.handleDataInputChange('matricula', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="00987654321"
                        maxLength={11}
                      />
                      {states.formErrors.matricula && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.matricula === "Required" ? "Campo Obrigatório" : states.formErrors.matricula}
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
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <RequiredLabel>Data de Validade CNH:</RequiredLabel>
                      <InputMask
                        mask="99/99/9999"
                        value={states.formData.validadeCnh || ""}
                        onChange={e => handlers.handleDataInputChange('validadeCnh', e.target.value)}
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
                      {states.formErrors.validadeCnh && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.validadeCnh === "Required" ? "Campo Obrigatório" : states.formErrors.validadeCnh}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Número CNH:</RequiredLabel>
                      <Input
                        value={states.formData.numeroCnh || ""}
                        onChange={e => handlers.handleDataInputChange('numeroCnh', e.target.value)}
                        className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        placeholder="00987654321"
                        maxLength={11}
                      />
                      {states.formErrors.numeroCnh && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.numeroCnh === "Required" ? "Campo Obrigatório" : states.formErrors.numeroCnh}
                        </p>
                      )}
                    </div>
                    <div>
                      <RequiredLabel>Categoria CNH:</RequiredLabel>
                      <Select
                        value={states.formData.categoriaCnh || ""}
                        onValueChange={value => handlers.handleDataInputChange('categoriaCnh', value)}
                      >
                        <SelectTrigger
                          className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACC">ACC</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                      </Select>
                      {states.formErrors.categoriaCnh && (
                        <p className="text-red-500 text-xs mt-1">
                          {states.formErrors.categoriaCnh === "Required" ? "Campo Obrigatório" : states.formErrors.categoriaCnh}
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
                    headers={[
                      "Matrícula",
                      "Nome Completo",
                      "CPF",
                      "Data de Validade CNH",
                      "Número CNH",
                      "Categoria CNH"
                    ]}
                    data={states.tableData}
                    dataKeys={["matricula", "nome", "cpf", "validadeCnh", "numeroCnh", "categoriaCnh"]}
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