import { Button } from "./button";

interface TemporaryDataTableProps {
  headers: string[];
  data: Record<string, any>[];
  dataKeys: string[];
  onRemoveItem: (index: number) => void;
  onEditItem: (index: number) => void;
  onDownloadClick: () => void;
}

export const TemporaryDataTable = ({ headers, data, dataKeys, onRemoveItem, onEditItem, onDownloadClick }: TemporaryDataTableProps): JSX.Element => {
  const hasData = data.length > 0;

  return (
    <div className="mt-6">
      {hasData ? (
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
              {data.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {dataKeys.map((key) => (
                    <td key={`${itemIndex}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-sans">
                      {item[key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => {
                        onEditItem(itemIndex)
                        window.scrollTo({ top: 0, behavior: "smooth" }) 
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Editar
                    </button>
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
          onClick={onDownloadClick}
          variant="secondary"
          className="bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={!hasData}
        >
          Baixar CSV
        </Button>
      </div>
    </div>
  );
};