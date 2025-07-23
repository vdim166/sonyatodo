import { useModalsContext } from '../../../hooks/useModalsContext';
import { Button } from '../../shared/Button';
import './styles.css';

export const ConfirmModal = () => {
  const { closeModal } = useModalsContext();

  return (
    <div className="confirm_modal">
      <p>Удалить?</p>
      <div className="confirm_buttons">
        <Button onClick={closeModal}>Отмена</Button>
        <Button>Удалить</Button>
      </div>
    </div>
  );
};
