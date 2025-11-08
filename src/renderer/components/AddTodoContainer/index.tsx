import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Input } from '../shared/components/Input';
import { TodoProps } from '../Todo';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { useAppContext } from '../../hooks/useAppContext';
import { CancelButton } from '../shared/components/CancelButton';
import { useNotificationManager } from '../../hooks/useNotificationManager';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { imagesToAddType } from '../EditTodoModal';
import { Cross } from '../../icons/Cross';
import { TextareaWithTools } from '../shared/components/TextareaWithTools';

type AddTodoContainerProps = {
  changeTempTodo: (name: string, desc: string) => void;
  closeModal: () => void;
};

export const AddTodoContainer = ({
  changeTempTodo,
  closeModal,
}: AddTodoContainerProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { currentProjectName, currentTab } = useAppContext();

  const [imagesToAdd, setImagesToAdd] = useState<imagesToAddType[]>([]);
  const { addNotification } = useNotificationManager();

  const handleCreate = async () => {
    try {
      if (!currentProjectName) return;
      if (name === '') return;

      const { data: todo }: { data: saveTodoType } = await ipcSignals.saveData(
        {
          name,
          desc: description,
          currentTopic: currentTab,
        } as saveTodoType,
        currentProjectName,
      );

      if (todo) {
        for (let i = 0; i < imagesToAdd.length; ++i) {
          const imageToAdd = imagesToAdd[i];

          const data = {
            id: todo.id,
            name: imageToAdd.name,
            data: imageToAdd.buffer,
            topic: currentTab || 'TODO',
          };

          window.electron.ipcRenderer.addTodoImage(data, currentProjectName);
        }

        window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
        addNotification('Задача добавлена');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setName('');
      setDescription('');
    }
  };

  const clearHandle = () => {
    setName('');
    setDescription('');
  };

  useEffect(() => {
    if (name !== '' || description !== '') {
      changeTempTodo(name, description);
    }
  }, [name, description]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey) return;

      if (event.key === 'Enter') {
        handleCreate();
      } else if (event.key === 'Escape') {
        console.log('event.key', event.key);
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [name, description]);

  return (
    <div className="add_todo_container">
      <div className="add_todo_container_inputs">
        <div className="add_todo_container_inputs_cross" onClick={closeModal}>
          <Cross />
        </div>
        <h1>Добавьте дело</h1>
        <div className="add_todo_container_inputs_option">
          <p>Name:</p>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="add_todo_container_inputs_option">
          <p>Description:</p>
          <TextareaWithTools
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            setValue={setDescription}
            addFile={(fileObj) => {
              setImagesToAdd((prev) => {
                const newState = [...prev, fileObj];

                return newState;
              });
            }}
          />
        </div>

        <Button onClick={handleCreate} disabled={name.length === 0}>
          Создать
        </Button>
        <CancelButton
          onClick={clearHandle}
          disabled={name.length === 0 && description.length === 0}
        >
          Очистить
        </CancelButton>
      </div>
    </div>
  );
};
