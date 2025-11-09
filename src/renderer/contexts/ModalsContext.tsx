import { createContext } from 'react';
import { confirmModalType } from '../components/Modals/types/confirmModalType';

export const MODALS = {
  CONFIRM: 'CONFIRM',
  TABS_CONSTRUCTOR: 'TABS_CONSTRUCTOR',
  PROJECT_CONSTRUCTOR: 'PROJECT_CONSTRUCTOR',
  WIDGET_SETTINGS: 'WIDGET_SETTINGS',
  ADD_IMPORTANT_DATE: 'ADD_IMPORTANT_DATE',
} as const;

type OpenModalPropsType = confirmModalType;

export type OpenModalType = {
  type: keyof typeof MODALS;
  props: OpenModalPropsType | null;
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
