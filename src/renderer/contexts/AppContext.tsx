import { createContext } from 'react';
import { saveTodoType } from '../classes/ipcSignals';

export type AppContextType = {
  todos: saveTodoType[] | null;
  setTodos: React.Dispatch<React.SetStateAction<saveTodoType[] | null>>;
  tabs: string[] | null;
  setTabs: React.Dispatch<React.SetStateAction<string[] | null>>;
  currentPage: string | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<string | null>>;
};

const init = {
  todos: null,
  setTodos: () => {},
  tabs: null,
  setTabs: () => {},
  currentPage: null,
  setCurrentPage: () => {},
};

export const AppContext = createContext<AppContextType>(init);
