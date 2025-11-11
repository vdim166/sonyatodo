import { useEffect, useState } from 'react';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { Input } from '../shared/components/Input';
import './styles.css';
import { useAppContext } from '../../hooks/useAppContext';
import { Cross } from '../../icons/Cross';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { useDebounce } from '../shared/hooks/useDebounce';
import { candidateLinkType } from '../AddLinksToTodo';

type LinkToWidgetProps = {
  todo: saveTodoType;
};

type LinkedTodoProps = {
  id: string;
  currentTopic: string;
  original: saveTodoType;
};

const LinkedTodo = ({ id, currentTopic, original }: LinkedTodoProps) => {
  const { currentProjectName, setShowEditModal } = useAppContext();

  const [todo, setTodo] = useState<saveTodoType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ipcSignals.getTodoById(
          id,
          currentTopic,
          currentProjectName || 'main',
        );

        setTodo(data);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="link_to_widget_container_option"
      onClick={() => {
        if (!todo) return;
        setShowEditModal({ id: todo.id, currentTopic: todo.currentTopic });
      }}
    >
      <p>{todo?.name}</p>

      <div
        className="link_to_widget_container_option_cross"
        onClick={async (e) => {
          e.stopPropagation();
          if (!todo) return;

          try {
            await ipcSignals.deleteLinkFromTodo(
              todo.id,
              todo.currentTopic,
              currentProjectName || 'main',
              original.id,
            );

            window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
          } catch (error) {
            console.log('error', error);
          }
        }}
      >
        <Cross />
      </div>
    </div>
  );
};

export const LinkToWidget = ({ todo }: LinkToWidgetProps) => {
  const { currentProjectName } = useAppContext();
  const [value, setValue] = useState('');

  const debounceValue = useDebounce(value);

  const [isOpen, setIsOpen] = useState(false);

  const [candidates, setCandidates] = useState<candidateLinkType[]>([]);

  useEffect(() => {
    if (debounceValue) {
      const fetchData = async () => {
        const data: candidateLinkType[] =
          await ipcSignals.findTodoByPattern(debounceValue);

        let sorted = data.filter((can) => can.todo.id !== todo.id);
        if (todo.linkedTo) {
          let result: candidateLinkType[] = [];

          for (let i = 0; i < sorted.length; ++i) {
            const findIndex = todo.linkedTo.findIndex(
              (l) => l.todo.id === sorted[i].todo.id,
            );

            if (findIndex === -1) {
              result.push(sorted[i]);
            }
          }

          sorted = result;
        }

        setCandidates(sorted);
        setIsOpen(true);
      };

      fetchData();
    } else {
      setIsOpen(false);
    }
  }, [debounceValue]);

  const handlePick = async (c: candidateLinkType) => {
    setValue('');

    setCandidates([]);

    setIsOpen(false);

    await ipcSignals.addLinkToTodo(
      c.todo.id,
      c.todo.currentTopic,
      currentProjectName || 'main',
      {
        projectName: currentProjectName,
        todo: {
          id: todo.id,
          currentTopic: todo.currentTopic,
        },
      } as candidateLinkType,
    );

    window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
  };

  return (
    <div className="link_to_widget">
      <div className="link_to_widget_input">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />

        {isOpen && candidates.length > 0 && (
          <div className="link_to_widget_input_dropdown">
            {candidates.map((c) => {
              return (
                <div
                  key={c.todo.id}
                  className="link_to_widget_input_dropdown_option"
                  onClick={() => {
                    handlePick(c);
                  }}
                >
                  {c.todo.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {todo.linkedTo && (
        <div className="link_to_widget_container">
          {todo.linkedTo.map((t) => {
            return (
              <LinkedTodo
                original={todo}
                id={t.todo.id}
                currentTopic={t.todo.currentTopic}
                key={t.todo.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
