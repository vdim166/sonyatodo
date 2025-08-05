import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../classes/ipcSignals';
import { AppContext, AppContextType } from './AppContext';

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [todos, setTodos] = useState<saveTodoType[] | null>(null);
  const [tabs, setTabs] = useState<string[] | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        console.log('loading todos...');

        const data = await ipcSignals.loadData();

        if (data) {
          setTodos(data.todos);
          setTabs(data.tabs);

          if (data.tabs.length > 0) {
            setCurrentPage(data.tabs[0]);
          }
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
    currentPage,
    setCurrentPage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
