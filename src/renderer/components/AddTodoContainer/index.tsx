import { useEffect, useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { TodoProps } from '../Todo';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { useAppContext } from '../../hooks/useAppContext';
import { CancelButton } from '../shared/CancelButton';
import { useNotificationManager } from '../../hooks/useNotificationManager';
import { TextareaWithTools } from '../shared/TextareaWithTools';

type AddTodoContainerProps = {
  changeTempTodo: (props: TodoProps | null) => void;
  closeModal: () => void;
};

export const AddTodoContainer = ({
  changeTempTodo,
  closeModal,
}: AddTodoContainerProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { setTodos, currentTab, currentProjectName } = useAppContext();

  const { addNotification } = useNotificationManager();

  const handleCreate = async () => {
    try {
      if (!currentProjectName) return;
      if (name === '') return;

      const data = await ipcSignals.saveData(
        {
          name,
          desc: description,
          currentTab,
        } as saveTodoType,
        currentProjectName,
      );

      if (data) {
        setTodos(data.todos);

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
      changeTempTodo({
        name,
        desc: description,
      } as TodoProps);
    } else {
      changeTempTodo(null);
    }
  }, [name, description]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
