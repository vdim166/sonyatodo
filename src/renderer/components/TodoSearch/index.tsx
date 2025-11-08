import { useEffect, useState } from 'react';
import { Input } from '../shared/components/Input';
import './styles.css';
import { useDebounce } from '../shared/hooks/useDebounce';
import { ipcSignals } from '../../classes/ipcSignals';
import { candidateLinkType } from '../AddLinksToTodo';
import { useAppContext } from '../../hooks/useAppContext';

export const TodoSearch = () => {
  const [value, setValue] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const [candidates, setCandidates] = useState<candidateLinkType[]>([]);

  const debounceValue = useDebounce(value, 500);

  const { setShowEditModal } = useAppContext();

  useEffect(() => {
    if (debounceValue) {
      const findTodoByPattern = async () => {
        try {
          const data: candidateLinkType[] =
            await ipcSignals.findTodoByPattern(debounceValue);

          setCandidates(data);
        } catch (error) {
          console.log(error);
        }

        setIsOpen(true);
      };

      findTodoByPattern();
    } else {
      setIsOpen(false);
    }
  }, [debounceValue]);

  const handlePick = (c: candidateLinkType) => () => {
    setCandidates([]);
    setIsOpen(false);

    setValue('');

    setShowEditModal(null);

    setTimeout(() => {
      setShowEditModal({
        id: c.todo.id,
        currentTopic: c.todo.currentTopic,
      });
    }, 0);
  };

  return (
    <div className="todo_search">
      <div className="todo_search_input">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>

      {isOpen && (
        <div className="todo_search_input_dropdown">
          {candidates.length > 0 &&
            candidates.map((c) => {
              return (
                <div
                  className="todo_search_input_dropdown_option"
                  onClick={handlePick(c)}
                >
                  <p>{c.todo.name}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
