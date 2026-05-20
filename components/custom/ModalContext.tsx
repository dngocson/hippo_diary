import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isAnyModalOpen: boolean;
  setIsAnyModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isAnyModalOpen, setIsAnyModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalProvider");
  }
  return context;
}
