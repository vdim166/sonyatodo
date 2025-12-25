import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../classes/ipcSignals';
import { AppContext, AppContextType, TabType } from './AppContext';
import { DISPATCH_EVENTS } from '../consts/dispatchEvents';
import { editModalState } from '../components/shared/types/editModalState';

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

  const [showEditModal, setShowEditModal] = useState<editModalState | null>(
    null,
  );

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
        // setTodos(null);
        setTabs(null);
        if (!currentProjectName) return;

        const data = await ipcSignals.loadData(currentProjectName);

        if (data) {
          const findTopic = data.allTopics.find(
            (topic) => topic.name === (currentTab || 'TODO'),
          );

          if (findTopic) {
            setTodos(structuredClone(findTopic.todos));
          }

          setTabs(data.tabs);

          if (!currentTab)
            if (data.tabs.length > 0) {
              setCurrentTab(data.tabs[0].name);
            }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadTodos();

    window.addEventListener(DISPATCH_EVENTS.FETCH_TODOS, loadTodos);

    return () => {
      window.removeEventListener(DISPATCH_EVENTS.FETCH_TODOS, loadTodos);
    };
  }, [currentProjectName, currentTab]);

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
    showEditModal,
    setShowEditModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
