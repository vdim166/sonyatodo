import { ipcSignals, saveTodoType } from '../../../classes/ipcSignals';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';
import { MODALS } from '../../../contexts/ModalsContext';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { useNotificationManager } from '../../../hooks/useNotificationManager';
import { ClosedEye } from '../../../icons/ClosedEye';
import { Cross } from '../../../icons/Cross';
import { OpenEye } from '../../../icons/OpenEye';
import { Pencil } from '../../../icons/Pencil';
import { SendTodoComponent } from '../SendTodoComponent';
import './styles.css';

type ActionMenuProps = {
  todo: saveTodoType;
  openEditModal?: () => void;
  showHidden?: boolean;
};

export const ActionMenu = ({
  todo,
  openEditModal,
  showHidden = false,
}: ActionMenuProps) => {
  const { openModal, closeModal } = useModalsContext();
  const { currentProjectName, setShowEditModal } = useAppContext();

  const { addNotification } = useNotificationManager();

  const handleDelete = async () => {
    try {
      if (!currentProjectName) return;
      const data = await ipcSignals.deleteData(
        todo.id,
        todo.currentTopic,
        currentProjectName,
      );

      if (data) {
        setShowEditModal(null);
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
        todo.id,
        tab,
        todo.currentTopic,
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

  const handleVisibility = async () => {
    try {
      let newHidden: boolean;

      if (todo.hidden === undefined) {
        newHidden = true;
      } else {
        newHidden = !todo.hidden;
      }

      await ipcSignals.changeTodo(
        { ...todo, hidden: newHidden },
        currentProjectName || 'main',
      );

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="todo_action_menu">
      {showHidden && (
        <div className="todo_action_invisible" onClick={handleVisibility}>
          {todo.hidden ? <OpenEye /> : <ClosedEye />}
        </div>
      )}

      {openEditModal && (
        <div className="todo_action_edit" onClick={openEditModal}>
          <Pencil />
        </div>
      )}
      <SendTodoComponent handleSendTodo={handleSendTodo} todo={todo} />
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
