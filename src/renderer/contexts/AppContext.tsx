import { createContext } from 'react';
import { saveTodoType } from '../classes/ipcSignals';

export type AppContextType = {
  todos: saveTodoType[];
  setTodos: React.Dispatch<React.SetStateAction<saveTodoType[]>>;
};

const init = {
  todos: [],
  setTodos: () => {},
};

export const AppContext = createContext<AppContextType>(init);
