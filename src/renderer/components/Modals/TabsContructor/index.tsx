import { useLayoutEffect, useState } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Button } from '../../shared/Button';
import './styles.css';
import { Input } from '../../shared/Input';
import { ipcSignals } from '../../../classes/ipcSignals';

export const TabsContructor = () => {
  const { tabs, setTabs, currentProjectName } = useAppContext();

  const { closeModal } = useModalsContext();

  const [value, setValue] = useState<string>('');

  const [isAdding, setisAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [tempClass, setTempClass] = useState(false);

  useLayoutEffect(() => {
    if (isSaving === false && value !== '') {
      const handle = async () => {
        if (!currentProjectName) return;
        await ipcSignals.addTab(value, currentProjectName);

        setTabs((prev) => {
          if (!prev) return null;
          return [value, ...prev];
        });

        setTempClass(false);
        setisAdding(false);
        setValue('');
      };

      handle();
    }
  }, [isSaving]);

  const saveHandle = () => {
    setIsSaving(true);
    setTempClass(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  if (!tabs) return <div>Loading...</div>;
  return (
    <div className="tabs_contructor_main">
      <p className="tabs_title">TABS</p>
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
          {tabs.map((tab) => {
            return (
              <div className="tabs_container_option">
                <p>{tab}</p>
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

        <Button onClick={saveHandle}>Сохранить</Button>
      </div>
    </div>
  );
};
