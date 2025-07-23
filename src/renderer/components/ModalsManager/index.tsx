import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { UniversalWrapper } from '../Modals/UniversalWrapper';

export const ModalsManager = () => {
  const { modalState } = useModalsContext();

  if (!modalState) return;

  if (modalState.type === MODALS.CONFIRM) {
    return (
      <UniversalWrapper>
        <ConfirmModal />
      </UniversalWrapper>
    );
  }
};
