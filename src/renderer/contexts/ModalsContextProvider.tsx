import { useState } from 'react';
import {
  ModalsContext,
  ModalsContextType,
  OpenModalType,
} from './ModalsContext';

type ModalsContextProviderProps = {
  children: React.ReactNode;
};

export const ModalsContextProvider = ({
  children,
}: ModalsContextProviderProps) => {
  const [modalState, setModalState] = useState<OpenModalType | null>(null);

  const openModal = (props: OpenModalType) => {
    setModalState(props);
  };
  const closeModal = () => {
    setModalState(null);
  };

  const value: ModalsContextType = {
    openModal,
    closeModal,
    modalState,
  };

  return (
    <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
  );
};
