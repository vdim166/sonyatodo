import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { ProjectConstructor } from '../Modals/ProjectConstructor';
import { TabsConstructor } from '../Modals/TabsContructor';
import { confirmModalType } from '../Modals/types/confirmModalType';
import { UniversalWrapper } from '../Modals/UniversalWrapper';
import { WidgetSettingsModal } from '../Modals/WidgetSettingsModal';

export const ModalsManager = () => {
  const { modalState } = useModalsContext();

  if (!modalState) return;

  if (modalState.type === MODALS.CONFIRM) {
    return (
      <UniversalWrapper>
        <ConfirmModal {...(modalState.props as confirmModalType)} />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.TABS_CONSTRUCTOR) {
    return (
      <UniversalWrapper>
        <TabsConstructor />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.PROJECT_CONSTRUCTOR) {
    return (
      <UniversalWrapper>
        <ProjectConstructor />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.WIDGET_SETTINGS) {
    return (
      <UniversalWrapper>
        <WidgetSettingsModal />
      </UniversalWrapper>
    );
  }
};
