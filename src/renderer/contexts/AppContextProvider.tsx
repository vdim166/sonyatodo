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

    loadTodos();
  }, []);

  const value: AppContextType = {
    todos,
    setTodos,
    tabs,
    setTabs,
    currentTab,
    setCurrentTab,
    currentProjectName,
    setCurrentProjectName,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
