import { useState } from 'react';
import './styles.css';
import { useModalsContext } from '../../hooks/useModalsContext';
import { MODALS } from '../../contexts/ModalsContext';

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { openModal } = useModalsContext();

  const tabsContructorHandle = () => {
    openModal({ type: MODALS.TABS_CONSTRUCTOR, props: null });
  };

  const projectConstructorHandle = () => {
    openModal({ type: MODALS.PROJECT_CONSTRUCTOR, props: null });
  };

  const widgetSettingsHandle = () => {
    openModal({ type: MODALS.WIDGET_SETTINGS, props: null });
  };

  return (
    <div className="burger-menu">
      <div
        className="burger-menu-container"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="burger-menu-line"></div>
        <div className="burger-menu-line"></div>
        <div className="burger-menu-line"></div>
      </div>

      {isOpen && (
        <div className="burger-menu-modal">
          <button
            className="burger-menu-modal-option"
            onClick={tabsContructorHandle}
          >
            Tabs constructor
          </button>
          <button
            className="burger-menu-modal-option"
            onClick={projectConstructorHandle}
          >
            Project constructor
          </button>
          <button
            className="burger-menu-modal-option"
            onClick={widgetSettingsHandle}
          >
            Widget settings
          </button>
        </div>
      )}
    </div>
  );
};
