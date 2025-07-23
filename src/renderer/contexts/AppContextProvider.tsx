import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../classes/ipcSignals';
import { AppContext, AppContextType } from './AppContext';

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [todos, setTodos] = useState<saveTodoType[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        console.log('loading todos...');

        const data = await ipcSignals.loadData();

        if (data) {
          setTodos(data);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadTodos();
  }, []);

  const value: AppContextType = { todos, setTodos };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
