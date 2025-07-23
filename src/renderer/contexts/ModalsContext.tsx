import { createContext } from 'react';

export const MODALS = { CONFIRM: 'CONFIRM' } as const;

export type OpenModalType = {
  type: keyof typeof MODALS;
  props: any;
};

export type ModalsContextType = {
  openModal: (props: OpenModalType) => void;
  closeModal: () => void;
  modalState: OpenModalType | null;
};

const init: ModalsContextType = {
  openModal: () => {},
  closeModal: () => {},
  modalState: null,
};

export const ModalsContext = createContext<ModalsContextType>(init);
