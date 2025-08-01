import { useEffect, useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { TodoProps } from '../Todo';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { useAppContext } from '../../hooks/useAppContext';
import { Textarea } from '../shared/Textarea';

// TODO:error handler

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

  const { setTodos } = useAppContext();

  const handleCreate = async () => {
    try {
      if (name === '') return;

      const data = await ipcSignals.saveData({
        name,
        desc: description,
        done: false,
      } as saveTodoType);

      if (data) {
        setTodos(data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setName('');
      setDescription('');
      closeModal();
    }
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

  return (
    <div className="add_todo_container">
      <div className="add_todo_container_inputs">
        <h1>Добавьте дело</h1>
        <div className="add_todo_container_inputs_option">
          <p>Name:</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="add_todo_container_inputs_option">
          <p>Description:</p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleCreate}>Создать</Button>
      </div>
    </div>
  );
};
