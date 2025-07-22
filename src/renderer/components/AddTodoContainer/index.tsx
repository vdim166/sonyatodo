import { useEffect, useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { TodoProps } from '../Todo';
import './styles.css';

type AddTodoContainerProps = {
  changeTempTodo: (props: TodoProps | null) => void;
};

export const AddTodoContainer = ({ changeTempTodo }: AddTodoContainerProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {};

  useEffect(() => {
    if (name !== '' || description !== '') {
      changeTempTodo({
        name,
      });
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
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleCreate}>Создать</Button>
      </div>
    </div>
  );
};
