import React from "react";
import { ClipboardCopy } from 'lucide-react';
import { Card } from "./card";
import { Button } from "./button";







// Modal para controle de fluxo de cadastro de cartão
interface modalProps {
  isOpen: boolean;
  onSim: () => void;
  onNao: () => void;
}

export const FlowModal: React.FC<modalProps> = ({ isOpen, onSim, onNao }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-sans">
          Já possui cartão?
        </h2>
        <div className="flex justify-center space-x-6">
          <Button
            onClick={onNao}
            className="px-10 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-base"
          >
            Não
          </Button>
          <Button
            onClick={onSim}
            className="px-10 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-base"
          >
            Sim
          </Button>
        </div>
      </Card>
    </div>
  );
};


interface DownloadCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
}

const EMAIL = "administrativo@valeshop.com.br";

export const DownloadModal: React.FC<DownloadCompleteModalProps> = ({ isOpen, onClose, filename,  }) => {
  if (!isOpen) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-left font-sans">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Download Concluído!</h2>
            <p className="text-sm text-gray-500">Arquivo CSV gerado com sucesso</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold text-gray-800">Próximos passos:</h3>
          <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 space-y-2">
            <li>
              Localize o arquivo baixado:
              <br />
              <strong className="text-blue-600 font-normal break-all">{filename}</strong>
            </li>
            <li>Envie o arquivo para o e-mail administrativo</li>
          </ol>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-gray-500">E-mail de destino:</label>
          <div className="flex items-center justify-between mt-1 p-2 pl-3 bg-gray-50 rounded-md border">
            <span className="text-sm text-gray-900">{EMAIL}</span>
            <button onClick={() => handleCopy(EMAIL)} title="Copiar e-mail" className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-200 transition-colors">
              <ClipboardCopy size={16} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm">
            Entendi
          </Button>
        </div>
      </Card>
    </div>
  );
};
