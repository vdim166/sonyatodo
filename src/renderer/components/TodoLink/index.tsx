import { useEffect, useState } from 'react';
import { Check } from '../../icons/Check';
import { candidateLinkType } from '../AddLinksToTodo';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { Cross } from '../../icons/Cross';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { editModalState } from '../shared/types/editModalState';

type TodoLinkProps = {
  link: candidateLinkType;
  index: number;
  original: saveTodoType;
  setShowEditModal: React.Dispatch<React.SetStateAction<editModalState | null>>;
};

export const TodoLink = ({
  link,
  index,
  original,
  setShowEditModal,
}: TodoLinkProps) => {
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
  }, []);

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
        index,
      );

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
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
          });
        }, 0);
      }}
    >
      <p className="edit_todo_modal_links_option_title">{current.name}</p>
      <div className="edit_todo_modal_links_option_deadline">
        {calcDeadline()}
      </div>

      <div className="edit_todo_modal_links_option_action_menu">
        <div
          className={`edit_todo_modal_links_option_check ${current.currentTopic === 'DONE' ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
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
