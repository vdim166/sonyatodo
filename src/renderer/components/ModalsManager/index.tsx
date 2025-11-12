import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { AddImportantDateModal } from '../Modals/AddImportantDateModal';
import { AddLongTermAffairModal } from '../Modals/AddLongTermAffairModal';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { ImageViewerModal } from '../Modals/ImageViewerModal';
import { ProjectConstructor } from '../Modals/ProjectConstructor';
import { TabsConstructor } from '../Modals/TabsContructor';
import { confirmModalType } from '../Modals/types/confirmModalType';
import { imgViewerType } from '../Modals/types/imgViewerType';
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
  } else if (modalState.type === MODALS.ADD_IMPORTANT_DATE) {
    return (
      <UniversalWrapper>
        <AddImportantDateModal />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.IMG_VIEWER) {
    return (
      <UniversalWrapper>
        <ImageViewerModal {...(modalState.props as imgViewerType)} />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.ADD_LONG_TERM_AFFAIR) {
    return (
      <UniversalWrapper>
        <AddLongTermAffairModal />
      </UniversalWrapper>
    );
  }
};
