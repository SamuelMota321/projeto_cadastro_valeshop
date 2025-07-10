import { Card } from './card';
import { Button } from './button';



interface modalProps {
  isOpen: boolean;
  onSim: () => void;
  onNao: () => void;
}

export const modal: React.FC<modalProps> = ({ isOpen, onSim, onNao }) => {
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
            className="px-10 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm"
          >
            Não
          </Button>
          <Button
            onClick={onSim}
            className="px-10 py-2 bg-gradient-to-r from-[#004075] to-[#00569E] hover:from-[#003060] hover:to-[#004080] text-white rounded-full font-normal text-sm"
          >
            Sim
          </Button>
        </div>
      </Card>
    </div>
  );
};
