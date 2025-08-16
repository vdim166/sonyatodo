import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Button } from '../../shared/Button';
import './styles.css';
import { Input } from '../../shared/Input';
import { ipcSignals } from '../../../classes/ipcSignals';
import { TabType } from '../../../contexts/AppContext';

export const TabsConstructor = () => {
  const { tabs, setTabs, currentProjectName } = useAppContext();

  const { closeModal } = useModalsContext();

  const [value, setValue] = useState<string>('');

  const [isAdding, setisAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempClass, setTempClass] = useState(false);

  const [selectedTodos, setSelectedTodos] = useState<TabType[]>([]);
  const [isDragging, setIsDragging] = useState<TabType | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  useLayoutEffect(() => {
    if (isSaving === false && value !== '') {
      const handle = async () => {
        if (!currentProjectName) return;
        const tabs = await ipcSignals.addTab(value, currentProjectName);

        setTabs(tabs.tabs);

        setTempClass(false);
        setisAdding(false);
        setValue('');
      };

      handle();
    }
  }, [isSaving]);

  if (!tabs) return <div>Loading...</div>;

  const saveHandle = async () => {
    if (value.length !== 0) {
      setIsSaving(true);
      setTempClass(true);

      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }

    if (isOrderChanged) {
      try {
        if (!currentProjectName) return;
        const result = await ipcSignals.changeTabsOrder(
          tabs,
          currentProjectName,
        );
        setIsOrderChanged(false);

        setTabs(result);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const deleteHandle = async () => {
    if (!currentProjectName) return;
    try {
      const tabs = await ipcSignals.deleteTabs(
        selectedTodos,
        currentProjectName,
      );

      setTabs(tabs);

      setSelectedTodos([]);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        saveHandle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, isOrderChanged]);

  return (
    <div className="tabs_contructor_main">
      <p className="tabs_title">TABS</p>

      <div className="tabs_contructor_delete">
        <Button disabled={selectedTodos.length === 0} onClick={deleteHandle}>
          Удалить
        </Button>
      </div>
      <div className="tabs_container">
        {isAdding && (
          <div
            className={`new_tab ${tempClass ? 'temp_class' : ''} ${isSaving ? 'saving_animation' : ''}`}
          >
            {value}
          </div>
        )}

        <div className="tabs_container_tabs">
          {isAdding && (
            <div className="tabs_container_option_invisible">
              <p>{value}</p>
            </div>
          )}
          {tabs.map((tab, index) => {
            const isIncludes = selectedTodos.includes(tab);
            return (
              <div
                draggable
                onDragStart={(e) => {
                  setIsDragging(tab);
                }}
                onDragEnd={() => {
                  setIsDragging(null);
                }}
                onDragOver={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
                onDrop={() => {
                  if (isDragging) {
                    setTabs((prev) => {
                      if (!prev) return null;
                      const dragIndex = prev.indexOf(isDragging);
                      if (dragIndex > -1) {
                        prev.splice(dragIndex, 1);
                        prev.splice(index, 0, isDragging);
                      }

                      return prev;
                    });

                    setIsOrderChanged(true);
                  }
                }}
                className={`tabs_container_option ${isIncludes ? 'selected' : ''}`}
                key={tab.name}
                onClick={() => {
                  if (isIncludes) {
                    setSelectedTodos((prev) => {
                      const index = prev.indexOf(tab);
                      if (index > -1) {
                        prev.splice(index, 1);
                      }
                      return [...prev];
                    });
                  } else {
                    setSelectedTodos((prev) => [tab, ...prev]);
                  }
                }}
              >
                <p>{tab.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tabs_contructor_input_container">
        <div>
          <p>Введите имя</p>
          <Input
            value={value}
            onChange={(e) => {
              setisAdding(e.target.value.length > 0);
              setValue(e.target.value);
            }}
            style={{
              maxWidth: '300px',
            }}
          />
        </div>
      </div>

      <div className="tabs_contructor_buttons">
        <Button onClick={closeModal}>Отмена</Button>

        <Button
          onClick={saveHandle}
          disabled={value.length === 0 && !isOrderChanged}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};
