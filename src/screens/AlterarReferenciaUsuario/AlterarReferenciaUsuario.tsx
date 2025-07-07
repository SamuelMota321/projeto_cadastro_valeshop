import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Nav } from "../../components/ui/nav";
import { Header } from "../../components/ui/header";
import { TemporaryDataTable } from "../../components/ui/temporaryDataTable";

type TableData = {
  cpf: string;
  departamento: string;
};

export const AlterarReferencia = (): JSX.Element => {
  const [cpf, setCpf] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetFormAndExitEditing = () => {
    setCpf("");
    setDepartamento("");
    setEditingIndex(null);
  };
  
  const handleRegisterOrUpdateClick = () => {
    if (!cpf || !departamento) {
      alert("Por favor, preencha os campos CPF e Departamento.");
      return;
    }
    const newEntry: TableData = { cpf, departamento };
    
    if (editingIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editingIndex] = newEntry;
      setTableData(updatedData);
    } else {
      setTableData(prevData => [...prevData, newEntry]);
    }
    resetFormAndExitEditing();
  };

  const handleEditItem = (indexToEdit: number) => {
    const item = tableData[indexToEdit];
    setCpf(item.cpf);
    setDepartamento(item.departamento);
    setEditingIndex(indexToEdit);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setTableData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-[1300px]">
          <Card className="bg-white rounded-[20px] shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <Nav />
                <div className="flex-1 px-8 py-6">
                  <h1 className="text-2xl font-normal text-center text-black mb-8 font-sans">
                    Alterar Referência
                  </h1>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-normal text-black mb-1 font-sans">Razão Social:</label>
                      <Input className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Nome da empresa" />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-black mb-1 font-sans">N° do cnpj:</label>
                      <Input className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Digite o seu cnpj" />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-black mb-1 font-sans">N° do contrato:</label>
                      <Input className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Digite o seu contrato" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-normal text-black mb-1 font-sans">CPF:</label>
                      <Input value={cpf} onChange={e => setCpf(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Exemplo: 12345678900" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-normal text-black mb-1 font-sans">Nome do Departamento:</label>
                      <Input value={departamento} onChange={e => setDepartamento(e.target.value)} className="h-10 bg-[#F5F5F5] border-none rounded-md text-sm" placeholder="Exemplo: RECURSOS HUMANOS" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> </svg>
                      </div>
                      <p className="text-base text-black mb-1 font-normal font-sans">Arraste seu arquivo com mais de 1000 funcionários ou clique para selecionar</p>
                      <p className="text-sm text-gray-500 font-sans">Formatos aceitos: CSV (.csv) ou XLSX (.xlsx)</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    {editingIndex !== null && (
                      <Button onClick={resetFormAndExitEditing} variant="outline" className="px-8 py-2 rounded-full font-normal text-sm">
                        Cancelar
                      </Button>
                    )}
                    <Button onClick={handleRegisterOrUpdateClick} className="px-8 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm transition-all font-sans">
                      {editingIndex !== null ? "Salvar Alterações" : "Registrar"}
                    </Button>
                  </div>
                  <TemporaryDataTable
                    headers={["CPF", "Departamento"]}
                    data={tableData}
                    dataKeys={["cpf", "departamento"]}
                    onRemoveItem={handleRemoveItem}
                    onEditItem={handleEditItem}
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