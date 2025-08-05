import { ipcSignals } from '../../../classes/ipcSignals';
import { MODALS } from '../../../contexts/ModalsContext';
import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { SuccessSvg } from '../../../icons/SuccessSvg';
import { SendTodoComponent } from '../SendTodoComponent';
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
        setTodos(data.todos);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      closeModal();
    }
  };

  const handleSendTodo = (tab: string) => async () => {
    try {
      const data = await ipcSignals.moveTo(id, tab);

      if (data) {
        setTodos(data.todos);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="todo_action_menu">
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
