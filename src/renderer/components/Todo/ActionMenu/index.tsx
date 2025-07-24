import { ipcSignals } from '../../../classes/ipcSignals';
import { MODALS } from '../../../contexts/ModalsContext';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { SuccessSvg } from '../../../icons/SuccessSvg';
import './styles.css';

type ActionMenuProps = {
  id: string;
};

export const ActionMenu = ({ id }: ActionMenuProps) => {
  const { openModal, closeModal } = useModalsContext();
  const { setTodos } = useAppContext();

  const handleDelete = async () => {
    try {
      const data = await ipcSignals.deleteData(id);
      if (data) {
        setTodos(data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      closeModal();
    }
  };

  const handleDoneJob = async () => {};

  return (
    <div className="todo_action_menu">
      <div className="todo_success" onClick={handleDoneJob}>
        <SuccessSvg />
      </div>
      <div
        className="todo_action_menu_cross"
        onClick={() => {
          openModal({
            type: MODALS.CONFIRM,
            props: {
              question: 'Вы уверены, что хотите удалить?',
              actionName: 'Удалить',
              action: handleDelete,
            },
          });
        }}
      >
        <Cross />
      </div>
    </div>
  );
};
