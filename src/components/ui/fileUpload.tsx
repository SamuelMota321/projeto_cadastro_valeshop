import { useCallback } from 'react';
import { useDropzone, FileError } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
interface FileUploadProps {
  expectedHeaders: string[];
  instructionalKeywords: string[];
  onDataLoaded: (data: any[]) => void;
  onError: (message: string) => void;
}

export const FileUpload = ({ expectedHeaders, instructionalKeywords, onDataLoaded, onError }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((err: FileError) => {
          if (err.code === "file-invalid-type") {
            onError("Formato de arquivo inválido. Apenas arquivos .csv e .xlsx são aceitos.");
          } else {
            onError(`Erro no arquivo: ${err.message}`);
          }
        });
      });
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        if (!binaryStr) {
          onError("Não foi possível ler o arquivo.");
          return;
        }

        let rows: any[][] = [];
        if (file.name.endsWith('.csv')) {
          const result = Papa.parse<any[]>(binaryStr as string, {
            header: false,
            skipEmptyLines: false, 
            delimiter: ';',
          });
          rows = result.data;
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        }


        const isInstructionalRow = (row: any[]): boolean => {
          if (!instructionalKeywords || instructionalKeywords.length === 0 || !Array.isArray(row)) {
            return false;
          }
          const rowText = row.map(cell => String(cell || '').trim()).join(' ').toLowerCase();
          if (rowText.length === 0) return false;
          // Retorna true se qualquer palavra-chave de instrução for encontrada na linha
          return instructionalKeywords.some(keyword => rowText.includes(keyword.toLowerCase()));
        };

        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row && Array.isArray(row)) {
            const trimmedRow = row.map(cell => String(cell || '').trim());
            const isHeaderRow = expectedHeaders.every(header => trimmedRow.includes(header));
            if (isHeaderRow && !isInstructionalRow(row)) {
              headerRowIndex = i;
              break;
            }
          }
        }

        if (headerRowIndex === -1) {
          onError(`Cabeçalho não encontrado. Verifique se a planilha contém as colunas: ${expectedHeaders.join(', ')}.`);
          return;
        }

        const headers = rows[headerRowIndex].map(h => String(h).trim());
        const dataRows = rows.slice(headerRowIndex + 1);

        const cleanDataRows = dataRows.filter(row => {
          if (!row || !Array.isArray(row) || row.length === 0) return false;
          if (isInstructionalRow(row)) return false;
          // Mantém a linha apenas se ela tiver pelo menos uma célula com conteúdo
          return row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
        });

        const processedData = cleanDataRows.map(row => {
          const rowData: Record<string, any> = {};
          headers.forEach((header, index) => {
            if (header) { // Apenas adiciona a propriedade se o cabeçalho existir
              rowData[header] = String(row[index] || '').trim();
            }
          });
          return rowData;
        });


        if (processedData.length === 0) {
          onError('Nenhum dado válido foi encontrado no arquivo. Verifique se há dados após a linha de cabeçalho.');
          return;
        }

        onDataLoaded(processedData);

      } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        onError("Ocorreu um erro inesperado ao processar o arquivo.");
      }
    };

    reader.onerror = () => { onError("Falha ao ler o arquivo."); };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsBinaryString(file);
    }
  }, [expectedHeaders, instructionalKeywords, onDataLoaded, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      {isDragActive ? (
        <p className="text-base text-blue-600 font-semibold mb-1 font-sans">Solte o arquivo aqui...</p>
      ) : (
        <p className="text-base text-black mb-1 font-normal font-sans">
          Arraste seu arquivo ou clique para selecionar
        </p>
      )}
      <p className="text-sm text-gray-500 font-sans">
        Formatos aceitos: CSV (.csv) ou XLSX (.xlsx)
      </p>
    </div>
  );
};