import { ipcSignals } from '../../../classes/ipcSignals';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';
import { MODALS } from '../../../contexts/ModalsContext';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { useNotificationManager } from '../../../hooks/useNotificationManager';
import { Cross } from '../../../icons/Cross';
import { Pencil } from '../../../icons/Pencil';
import { SendTodoComponent } from '../SendTodoComponent';
import './styles.css';

type ActionMenuProps = {
  id: string;
  openEditModal: () => void;
};

export const ActionMenu = ({ id, openEditModal }: ActionMenuProps) => {
  const { openModal, closeModal } = useModalsContext();
  const { currentProjectName, currentTab } = useAppContext();

  const { addNotification } = useNotificationManager();

  const handleDelete = async () => {
    try {
      if (!currentProjectName) return;
      const data = await ipcSignals.deleteData(
        id,
        currentTab || 'TODO',
        currentProjectName,
      );

      if (data) {
        window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
        addNotification('Задача удалена');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      closeModal();
    }
  };

  const handleSendTodo = (tab: string) => async () => {
    try {
      if (!currentProjectName) return;
      const data = await ipcSignals.moveTo(
        id,
        tab,
        currentTab || 'TODO',
        currentProjectName,
      );

      if (data) {
        window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
        addNotification(`Задача передвинута в ${tab}`);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="todo_action_menu">
      <div className="todo_action_edit" onClick={openEditModal}>
        <Pencil />
      </div>
      <SendTodoComponent handleSendTodo={handleSendTodo} />
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
