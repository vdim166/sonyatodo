import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { AddImportantDateModal } from '../Modals/AddImportantDateModal';
import { AddLongTermAffairModal } from '../Modals/AddLongTermAffairModal';
import { ChangeTodoDeadline } from '../Modals/ChangeTodoDeadline';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { ImageViewerModal } from '../Modals/ImageViewerModal';
import { ProjectConstructor } from '../Modals/ProjectConstructor';
import { ProjectStatisticsModal } from '../Modals/ProjectStatisticsModal';
import { ScheduleDateChangerModal } from '../Modals/ScheduleDateChangerModal';
import { ScheduleViewerModal } from '../Modals/ScheduleViewerModal';
import { TabsConstructor } from '../Modals/TabsContructor';
import { changeTodoDeadlineType } from '../Modals/types/changeTodoDeadlineType';
import { confirmModalType } from '../Modals/types/confirmModalType';
import { imgViewerType } from '../Modals/types/imgViewerType';
import { scheduleDateChangerType } from '../Modals/types/scheduleDateChangerType';
import { scheduleViewerModalType } from '../Modals/types/scheduleViewerModalType';
import { videoViewerType } from '../Modals/types/videoViewerType';
import { UniversalWrapper } from '../Modals/UniversalWrapper';
import { VideoViewerModal } from '../Modals/VideoViewerModal';
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
  } else if (modalState.type === MODALS.CHANGE_TODO_DEADLINE) {
    return (
      <UniversalWrapper>
        <ChangeTodoDeadline {...(modalState.props as changeTodoDeadlineType)} />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.STATISTICS) {
    return (
      <UniversalWrapper>
        <ProjectStatisticsModal />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.SCHEDULE_VIEWER) {
    return (
      <UniversalWrapper>
        <ScheduleViewerModal
          {...(modalState.props as scheduleViewerModalType)}
        />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.SCHEDULE_DATE_CHANGER) {
    return (
      <UniversalWrapper>
        <ScheduleDateChangerModal
          {...(modalState.props as scheduleDateChangerType)}
        />
      </UniversalWrapper>
    );
  } else if (modalState.type === MODALS.VIDEO_VIEWER) {
    return (
      <UniversalWrapper>
        <VideoViewerModal {...(modalState.props as videoViewerType)} />
      </UniversalWrapper>
    );
  }
};
