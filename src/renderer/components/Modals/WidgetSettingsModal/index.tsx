import { useEffect, useState } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import './styles.css';
import { ipcSignals } from '../../../classes/ipcSignals';

export const WidgetSettingsModal = () => {
  const { closeModal } = useModalsContext();

  const [autoStartWidget, setAutoStartWidget] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await ipcSignals.getWidgetSettings();

        setAutoStartWidget(settings.autoStart);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSettings();
  }, []);

  if (isLoading) {
    return;
  }

  const handleAutoStartWidget = async (state: boolean) => {
    try {
      await ipcSignals.setAutoStartWidget(state);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="widget_settings_modal_main">
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>
      <p className="widget_settings_title">Настройки</p>

      <div className="widget_settings_container">
        <div className="widget_settings_row">
          <div className="widget_settings_option">
            <input
              type="checkbox"
              checked={autoStartWidget}
              onChange={(e) => {
                setAutoStartWidget(e.target.checked);
                handleAutoStartWidget(e.target.checked);
              }}
            />
            <p>Включить виджет на автозапуске</p>
          </div>
        </div>
      </div>
    </div>
  );
};
