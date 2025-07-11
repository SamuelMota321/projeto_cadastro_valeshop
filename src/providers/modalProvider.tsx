import { createContext, useState } from "react";
import { DownloadModal } from "../components/ui/modal";

interface DownloadModalContextType {
  showDownloadModal: (filename: string) => void;
}
export const DownloadModalContext = createContext<DownloadModalContextType | undefined>(undefined);


export const DownloadModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filename, setFilename] = useState('');

  const showDownloadModal = (name: string) => {
    setFilename(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <DownloadModalContext.Provider value={{ showDownloadModal }}>
      {children}
      <DownloadModal isOpen={isModalOpen} onClose={closeModal} filename={filename} />
    </DownloadModalContext.Provider>
  );
};