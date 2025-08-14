import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../classes/ipcSignals';
import { AppContext, AppContextType } from './AppContext';

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [todos, setTodos] = useState<saveTodoType[] | null>(null);
  const [tabs, setTabs] = useState<string[] | null>(null);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const [currentProjectName, setCurrentProjectName] = useState<string | null>(
    null,
  );

  const [projects, setProjects] = useState<string[] | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        console.log('loading todos...');

        const data = await ipcSignals.loadData();

        if (data) {
          setTodos(data.todos);
          setTabs(data.tabs);

          if (data.tabs.length > 0) {
            setCurrentTab(data.tabs[0]);
          }

          setCurrentProjectName('main');
        }
      } catch (error) {
        console.log('error', error);
      }
    };

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

    loadTodos();
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log('currentProjectName', currentProjectName);

    const loadTodos = async () => {
      try {
        setTodos(null);
        setTabs(null);
        console.log('loading todos...');
        if (!currentProjectName) return;

        const data = await ipcSignals.loadData(currentProjectName);

        if (data) {
          setTodos(data.todos);
          setTabs(data.tabs);

          if (data.tabs.length > 0) {
            setCurrentTab(data.tabs[0]);
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
