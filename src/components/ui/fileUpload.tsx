import { useCallback } from 'react';
import { useDropzone, FileError } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  expectedHeaders: string[];
  onDataLoaded: (data: any[]) => void;
  onError: (message: string) => void;
}

export const FileUpload = ({ expectedHeaders, onDataLoaded, onError }: FileUploadProps) => {
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
        if (!binaryStr) { onError("Não foi possível ler o arquivo."); return; }

        let rows: any[][] = [];
        if (file.name.endsWith('.csv')) {
          const result = Papa.parse<any[]>(binaryStr as string, { 
            header: false, 
            skipEmptyLines: false, // Don't skip empty lines to maintain row indexing
            delimiter: ';' // Use semicolon as delimiter for CSV
          });
          rows = result.data;
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        }

        // Find the header row - look for the row with CPF, Nome Completo, etc.
        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row && row.length > 0) {
            const rowString = row.map(cell => String(cell).trim()).join(' ');
            // Look for the specific header row
            if (rowString.includes('CPF') && 
                rowString.includes('Nome Completo') && 
                rowString.includes('E-mail do Beneficiário') &&
                !rowString.includes('OBRIGATÓRIO') &&
                !rowString.includes('Exemplo:')) {
              headerRowIndex = i;
              break;
            }
              headerRowIndex = i;
              break;
          }
        }

        if (headerRowIndex === -1) {
          onError('Não foi possível encontrar o cabeçalho na planilha.');
          return;
        }

        const headers = rows[headerRowIndex].map(h => String(h).trim());
        let dataStartIndex = headerRowIndex + 1;

        // Skip instruction rows after headers
        while (dataStartIndex < rows.length) {
          const currentRow = rows[dataStartIndex];
          if (!currentRow) {
            dataStartIndex++;
            continue;
          }
          
          const rowText = currentRow.map(cell => String(cell || '').trim()).join(' ');
          
          // Skip if row contains instruction keywords
          if (rowText.includes('OBRIGATÓRIO') ||
              rowText.includes('Exemplo:') ||
              rowText.includes('CPF do benefíciário') ||
              rowText.includes('Nome completo do funcionário') ||
              rowText.includes('Informe o DDD') ||
              rowText.includes('Data de nascimento do beneficiário') ||
              rowText.includes('(11 dígitos)') ||
              rowText.includes('(sem caracteres)') ||
              rowText.includes('(Formato DD/MM/AAAA)') ||
              currentRow.every(cell => !cell || String(cell).trim() === '')) {
            dataStartIndex++;
        }

        const dataRows = rows.slice(dataStartIndex);

        // Filter out empty rows and instruction rows from data
        const cleanDataRows = dataRows.filter(row => {
          if (!row || row.length === 0) return false;
          
          const rowText = row.map(cell => String(cell || '').trim()).join(' ');
          
          // Skip if it's still an instruction row
          if (rowText.includes('Exemplo:') ||
              rowText.includes('OBRIGATÓRIO') ||
              rowText.includes('CPF do benefíciário') ||
              rowText.includes('Nome completo do funcionário')) {
            return false;
          }
          
          // Keep if it has actual data (at least one non-empty cell)
          return row.some(cell => cell && String(cell).trim() !== '');
        });

        const processedData = cleanDataRows.map(row => {
          const rowData: Record<string, any> = {};
          headers.forEach((header, index) => {
            if (header && row[index] !== undefined) {
              rowData[String(header)] = String(row[index] || '').trim();
            }
          });
          return rowData;
        }).filter(row => {
          // Final filter: ensure the row has meaningful data
          return Object.values(row).some(val => val && String(val).trim() !== '' && !String(val).includes('Exemplo:'));
        });

        if (processedData.length === 0) {
          onError('Nenhum dado válido foi encontrado no arquivo. Verifique se há dados após as linhas de instrução.');
          return;
        }

        onDataLoaded(processedData);

      } catch (error) {
        console.error("File Processing Error:", error);
        onError("Ocorreu um erro inesperado ao processar o arquivo.");
      }
    };

    reader.onerror = () => { onError("Falha ao ler o arquivo."); };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8'); // Read CSV as text with UTF-8 encoding
    } else {
      reader.readAsBinaryString(file); // Read Excel as binary
    }
  }, [expectedHeaders, onDataLoaded, onError]);

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