import { useModalsContext } from '../../../hooks/useModalsContext';
import { Button } from '../../shared/Button';
import { confirmModalType } from '../types/confirmModalType';
import './styles.css';

export const ConfirmModal = ({
  question,
  actionName,
  action,
}: confirmModalType) => {
  const { closeModal } = useModalsContext();

  return (
    <div className="confirm_modal">
      <p>{question}</p>
      <div className="confirm_buttons">
        <Button onClick={closeModal}>Отмена</Button>
        <Button onClick={action}>{actionName || 'Подтвердить'}</Button>
      </div>
    </div>
  );
};
