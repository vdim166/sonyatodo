import { createContext } from 'react';
import { saveTodoType } from '../classes/ipcSignals';
import { editModalState } from '../components/shared/types/editModalState';

export type TabType = {
  name: string;
};

export type AppContextType = {
  todos: saveTodoType[] | null;
  setTodos: React.Dispatch<React.SetStateAction<saveTodoType[] | null>>;
  tabs: TabType[] | null;
  setTabs: React.Dispatch<React.SetStateAction<TabType[] | null>>;
  currentTab: string | null;
  setCurrentTab: React.Dispatch<React.SetStateAction<string | null>>;
  currentProjectName: string | null;
  setCurrentProjectName: React.Dispatch<React.SetStateAction<string | null>>;
  projects: string[] | null;
  setProjects: React.Dispatch<React.SetStateAction<string[] | null>>;
  showEditModal: editModalState | null;
  setShowEditModal: React.Dispatch<React.SetStateAction<editModalState | null>>;
};

const init: AppContextType = {
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
  showEditModal: null,
  setShowEditModal: () => {},
};

export const AppContext = createContext<AppContextType>(init);
