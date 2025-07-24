import { createContext } from 'react';
import { confirmModalType } from '../components/Modals/types/confirmModalType';

export const MODALS = { CONFIRM: 'CONFIRM' } as const;

type OpenModalPropsType = confirmModalType;

export type OpenModalType = {
  type: keyof typeof MODALS;
  props: OpenModalPropsType;
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
