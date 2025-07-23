import { MODALS } from '../../../contexts/ModalsContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import './styles.css';

export const ActionMenu = () => {
  const { openModal } = useModalsContext();

  return (
    <div className="todo_action_menu">
      <div
        className="todo_action_menu_cross"
        onClick={() => {
          openModal({
            type: MODALS.CONFIRM,
            props: null,
          });
        }}
      >
        <Cross />
      </div>
    </div>
  );
};
