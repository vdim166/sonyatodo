import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../classes/ipcSignals';
import { AppContext, AppContextType, TabType } from './AppContext';

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [todos, setTodos] = useState<saveTodoType[] | null>(null);
  const [tabs, setTabs] = useState<TabType[] | null>(null);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const [currentProjectName, setCurrentProjectName] = useState<string | null>(
    'main',
  );

  const [projects, setProjects] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ipcSignals.fetchProjects();

        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setTodos(null);
        setTabs(null);
        if (!currentProjectName) return;

        const data = await ipcSignals.loadData(currentProjectName);

        if (data) {
          setTodos(data.todos);
          setTabs(data.tabs);

          if (data.tabs.length > 0) {
            setCurrentTab(data.tabs[0].name);
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadTodos();
  }, [currentProjectName]);

  const value: AppContextType = {
    todos,
    setTodos,
    tabs,
    setTabs,
    currentTab,
    setCurrentTab,
    currentProjectName,
    setCurrentProjectName,
    projects,
    setProjects,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
