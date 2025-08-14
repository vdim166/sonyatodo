import { createContext } from 'react';
import { saveTodoType } from '../classes/ipcSignals';

export type AppContextType = {
  todos: saveTodoType[] | null;
  setTodos: React.Dispatch<React.SetStateAction<saveTodoType[] | null>>;
  tabs: string[] | null;
  setTabs: React.Dispatch<React.SetStateAction<string[] | null>>;
  currentTab: string | null;
  setCurrentTab: React.Dispatch<React.SetStateAction<string | null>>;
  currentProjectName: string | null;
  setCurrentProjectName: React.Dispatch<React.SetStateAction<string | null>>;
  projects: string[] | null;
  setProjects: React.Dispatch<React.SetStateAction<string[] | null>>;
};

const init = {
  todos: null,
  setTodos: () => {},
  tabs: null,
  setTabs: () => {},
  currentTab: null,
  setCurrentTab: () => {},
  currentProjectName: null,
  setCurrentProjectName: () => {},
  projects: null,
  setProjects: () => {},
};

export const AppContext = createContext<AppContextType>(init);
