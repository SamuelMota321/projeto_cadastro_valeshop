import { Button } from "./button";

interface TemporaryDataTableProps {
  headers: string[];
  data: Record<string, any>[];
  dataKeys: string[];
  onRemoveItem: (index: number) => void; // Nova propriedade para a função de remoção
}

export const TemporaryDataTable = ({ headers, data, dataKeys, onRemoveItem }: TemporaryDataTableProps): JSX.Element => {
  const hasData = data.length > 0;

  return (
    <div className="mt-6">
      {hasData ? (
        <div className="border rounded-lg overflow-hidden shadow-sm">
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
                {/* Cabeçalho da nova coluna de Ações */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {dataKeys.map((key) => (
                     <td key={`${itemIndex}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-sans">
                       {item[key]}
                     </td>
                  ))}
                  {/* Célula com o botão de Remover */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onRemoveItem(itemIndex)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Nenhum dado adicionado ainda.</p>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          variant="secondary"
          className="bg-gray-400 hover:bg-gray-500 text-white"
          disabled={!hasData}
        >
          Registrar e Baixar CSV
        </Button>
      </div>
    </div>
  );
};