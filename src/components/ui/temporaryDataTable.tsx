import { useState } from "react";
import { Button } from "./button";

interface TemporaryDataTableProps {
  headers: string[];
  data: Record<string, any>[];
  dataKeys: string[];
  onRemoveItem: (index: number) => void;
  onEditItem: (index: number) => void;
  onSubmit: () => void;
}

export const TemporaryDataTable = ({ headers, data, dataKeys, onRemoveItem, onEditItem, onSubmit }: TemporaryDataTableProps): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const hasData = data.length > 0;

  // Lógica da Paginação
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-6">
      {hasData ? (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item, itemIndex) => {
                  // Ajusta o índice para corresponder ao array de dados original
                  const originalIndex = indexOfFirstItem + itemIndex;
                  return (
                    <tr key={originalIndex}>
                      {dataKeys.map((key) => (
                        <td key={`${originalIndex}-${key}`} className="px-6 py-4 whitespace-nowrap text-base text-gray-800 font-sans">
                          {item[key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium space-x-4">
                        <button
                          onClick={() => {
                            onEditItem(originalIndex)
                            window.scrollTo({ top: 0, behavior: "smooth" }) 
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onRemoveItem(originalIndex)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Controles da Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-sm text-gray-700">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, data.length)} de {data.length} registros
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                <span className="text-sm px-2 text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-base text-gray-500">Nenhum dado adicionado ainda.</p>
        </div>
      )}

      {/* Botão de Envio */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={onSubmit}
          className="bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={!hasData}
        >
          Enviar Dados
        </Button>
      </div>
    </div>
  );
};