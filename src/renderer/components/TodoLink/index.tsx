import { useEffect, useState } from 'react';
import { Check } from '../../icons/Check';
import { candidateLinkType } from '../AddLinksToTodo';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { Cross } from '../../icons/Cross';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { editModalState } from '../shared/types/editModalState';
import { useAppContext } from '../../hooks/useAppContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { MODALS } from '../../contexts/ModalsContext';

type TodoLinkProps = {
  link: candidateLinkType;
  original: saveTodoType;
  setShowEditModal: React.Dispatch<React.SetStateAction<editModalState | null>>;
};

export const TodoLink = ({
  link,
  original,
  setShowEditModal,
}: TodoLinkProps) => {
  const { currentProjectName } = useAppContext();
  const { openModal } = useModalsContext();
  const [current, setCurrent] = useState<saveTodoType | null>(null);

  useEffect(() => {
    const loadTodo = async () => {
      try {
        const todo = await ipcSignals.getTodoById(
          link.todo.id,
          link.todo.currentTopic,
          link.projectName,
        );

        setCurrent(todo);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadTodo();
  }, [link]);

  if (current === null) {
    return <div>Loading...</div>;
  }

  const calcDeadline = () => {
    if (!current.deadline) return 'none';

    const separator = ` / `;
    return `${current.deadline.from}${current.deadline.from && current.deadline.to && separator}${current.deadline.to}`;
  };

  const handleDelete = async () => {
    try {
      await ipcSignals.deleteLinkFromTodo(
        original.id,
        original.currentTopic,
        link.projectName,
        link.todo.id,
      );

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };

  const changeDeadLine = () => {
    openModal({
      type: MODALS.CHANGE_TODO_DEADLINE,
      props: {
        id: link.todo.id,
        topic: link.todo.currentTopic,
      },
    });
  };

  return (
    <div
      className="edit_todo_modal_links_option"
      onClick={() => {
        setShowEditModal(null);

        setTimeout(() => {
          setShowEditModal({
            id: link.todo.id,
            currentTopic: link.todo.currentTopic,
            original,
          });
        }, 0);
      }}
    >
      <p className="edit_todo_modal_links_option_title">{current.name}</p>
      <div
        className="edit_todo_modal_links_option_deadline"
        onClick={(e) => {
          e.stopPropagation();
          changeDeadLine();
        }}
      >
        {calcDeadline()}
      </div>

      <div className="edit_todo_modal_links_option_action_menu">
        <div
          className={`edit_todo_modal_links_option_check ${current.currentTopic === 'DONE' ? 'checked' : ''}`}
          onClick={async (e) => {
            e.stopPropagation();

            if (current.currentTopic === 'DONE') {
              await ipcSignals.moveTo(
                current.id,
                'TODO',
                current.currentTopic,
                currentProjectName || 'main',
              );
            } else {
              await ipcSignals.moveTo(
                current.id,
                'DONE',
                current.currentTopic,
                currentProjectName || 'main',
              );
            }

            window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
          }}
        >
          <Check />
        </div>
        <div
          className="edit_todo_modal_links_option_delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Cross />
        </div>
      </div>
    </div>
  );
};
