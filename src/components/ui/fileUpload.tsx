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
          const result = Papa.parse<any[]>(binaryStr as string, { header: false, skipEmptyLines: true });
          rows = result.data;
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        }

        const headerRowIndex = rows.findIndex(row =>
          expectedHeaders.every(header => (row.map(cell => String(cell).trim())).includes(header))
        );

        if (headerRowIndex === -1) {
          onError(`Cabeçalho não encontrado. Verifique se a planilha contém a linha com: ${expectedHeaders.join(', ')}`);
          return;
        }

        const headers = rows[headerRowIndex].map(h => String(h).trim());
        let dataStartIndex = headerRowIndex + 1;

        if (rows[dataStartIndex] && rows[dataStartIndex].some(cell => String(cell).toUpperCase().includes("OBRIGATÓRIO"))) {
          dataStartIndex++; // Pula a linha de obrigatoriedade se existir
        }

        const dataRows = rows.slice(dataStartIndex);

        const processedData = dataRows.map(row => {
          const rowData: Record<string, any> = {};
          headers.forEach((header, index) => {
            if (header) {
              rowData[String(header)] = row[index];
            }
          });
          return rowData;
        }).filter(row => Object.values(row).some(val => val));

        onDataLoaded(processedData);

      } catch (error) {
        console.error("File Processing Error:", error);
        onError("Ocorreu um erro inesperado ao processar o arquivo.");
      }
    };

    reader.onerror = () => { onError("Falha ao ler o arquivo."); };
    reader.readAsBinaryString(file);
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