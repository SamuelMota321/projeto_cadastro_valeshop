import { Lightbulb } from "lucide-react";
import { Button } from "./button"; 
interface Instruction {
  field: string;
  rule: string;
  example: string;
}

interface SpreadsheetInstructionsProps {
  instructions: Instruction[];
  onDownloadSample: () => void; 
}

export const SpreadsheetInstructions = ({ instructions, onDownloadSample }: SpreadsheetInstructionsProps): JSX.Element => {
  return (
    <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">Como preencher a planilha</h3>
        </div>
        <Button
          variant="outline"
          onClick={onDownloadSample}
        >
          Baixar Planilha Exemplo
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Siga as instruções abaixo para garantir que sua planilha seja importada corretamente:
      </p>
      <ul className="space-y-3">
        {instructions.map((item, index) => (
          <li key={index} className="text-sm">
            <strong className="text-gray-700 font-medium">{item.field}:</strong>
            <span className="text-gray-600 ml-1">{item.rule}</span>
            <em className="block text-gray-500">{item.example}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};