import { useEffect, useState } from 'react';
import { Input } from '../shared/components/Input';
import './style.css';
import { useDebounce } from '../shared/hooks/useDebounce';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { useAppContext } from '../../hooks/useAppContext';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { TodoLink } from '../TodoLink';
import { editModalState } from '../shared/types/editModalState';

export type candidateLinkType = {
  projectName: string;
  todo: saveTodoType;
};

type AddLinksToTodoProps = {
  todo: saveTodoType;
  setShowEditModal: React.Dispatch<React.SetStateAction<editModalState | null>>;
};

export const AddLinksToTodo = ({
  todo,
  setShowEditModal,
}: AddLinksToTodoProps) => {
  const { todos, currentProjectName } = useAppContext();

  const [value, setValue] = useState('');
  const debouncedQuery = useDebounce(value, 500);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [candidates, setCandidates] = useState<candidateLinkType[] | null>(
    null,
  );

  useEffect(() => {
    if (debouncedQuery) {
      setIsDropdownOpen(true);

      const findTodoByPattern = async () => {
        if (!todos) return;
        try {
          const data: candidateLinkType[] =
            await ipcSignals.findTodoByPattern(debouncedQuery);

          let sorted = data.filter((can) => can.todo.id !== todo.id);
          if (todo.links) {
            let result: candidateLinkType[] = [];

            for (let i = 0; i < sorted.length; ++i) {
              const findIndex = todo.links.findIndex(
                (l) => l.todo.id === sorted[i].todo.id,
              );

              if (findIndex === -1) {
                result.push(sorted[i]);
              }
            }

            sorted = result;
          }

          setCandidates(sorted);
        } catch (error) {
          console.log('error', error);
        }
      };

      findTodoByPattern();
    } else {
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery]);

  if (!todos) return;

  const addLinkToTodo = async (candidate: candidateLinkType) => {
    try {
      await ipcSignals.addLinkToTodo(
        todo.id,
        todo.currentTopic,
        currentProjectName || 'main',
        candidate,
      );

      setValue('');

      setCandidates(null);

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="edit_todo_modal_links_container">
      <div className="edit_todo_modal_links_container_add_link_container">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onClick={() => {
            setIsDropdownOpen((prev) => !prev);
          }}
        />
        {isDropdownOpen && candidates && candidates.length > 0 && (
          <div className="edit_todo_modal_links_container_add_link_container_dropdown">
            {candidates &&
              candidates.map((candidate) => {
                return (
                  <div
                    className="edit_todo_modal_links_container_add_link_container_dropdown_option"
                    onClick={() => {
                      addLinkToTodo(candidate);
                    }}
                  >
                    <p>{candidate.todo.name}</p>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="edit_todo_modal_links_option_container">
        {todo.links &&
          todo.links.map((link) => {
            return (
              <TodoLink
                original={todo}
                link={link}
                key={link.todo.id}
                setShowEditModal={setShowEditModal}
              />
            );
          })}
      </div>
    </div>
  );
};
