import { createContext, useState } from "react";
import { InstructionsModal } from "../components/ui/modal";

interface InstructionsModalContextType {
  showInstructionsModal: (filename: string) => void;
}
export const InstructionsModalContext = createContext<InstructionsModalContextType | undefined>(undefined);


export const InstructionsModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filename, setFilename] = useState('');

  const showInstructionsModal = (name: string) => {
    setFilename(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <InstructionsModalContext.Provider value={{ showInstructionsModal }}>
      {children}
      <InstructionsModal isOpen={isModalOpen} onClose={closeModal} filename={filename} />
    </InstructionsModalContext.Provider>
  );
};