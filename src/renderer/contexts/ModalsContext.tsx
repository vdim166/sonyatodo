import { createContext } from 'react';
import { confirmModalType } from '../components/Modals/types/confirmModalType';
import { imgViewerType } from '../components/Modals/types/imgViewerType';
import { changeTodoDeadlineType } from '../components/Modals/types/changeTodoDeadlineType';
import { scheduleViewerModalType } from '../components/Modals/types/scheduleViewerModalType';
import { scheduleDateChangerType } from '../components/Modals/types/scheduleDateChangerType';
import { videoViewerType } from '../components/Modals/types/videoViewerType';

export const MODALS = {
  CONFIRM: 'CONFIRM',
  TABS_CONSTRUCTOR: 'TABS_CONSTRUCTOR',
  PROJECT_CONSTRUCTOR: 'PROJECT_CONSTRUCTOR',
  WIDGET_SETTINGS: 'WIDGET_SETTINGS',
  ADD_IMPORTANT_DATE: 'ADD_IMPORTANT_DATE',
  IMG_VIEWER: 'IMG_VIEWER',
  ADD_LONG_TERM_AFFAIR: 'ADD_LONG_TERM_AFFAIR',
  CHANGE_TODO_DEADLINE: 'CHANGE_TODO_DEADLINE',
  STATISTICS: 'STATISTICS',
  SCHEDULE_VIEWER: 'SCHEDULE_VIEWER',
  SCHEDULE_DATE_CHANGER: 'SCHEDULE_DATE_CHANGER',
  VIDEO_VIEWER: 'VIDEO_VIEWER',
} as const;

type OpenModalPropsType =
  | confirmModalType
  | imgViewerType
  | changeTodoDeadlineType
  | scheduleViewerModalType
  | scheduleDateChangerType
  | videoViewerType;

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
