import { saveTodoType } from '../../../classes/ipcSignals';

export type editModalState = {
  id: string;
  currentTopic: string;

  original?: saveTodoType;
};
