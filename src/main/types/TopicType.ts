import { saveTodoType } from '../../renderer/classes/ipcSignals';

export type TopicType = {
  name: string;
  todos: saveTodoType[];
};
