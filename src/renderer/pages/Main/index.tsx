import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { Navbar } from '../../components/Navbar';
import './styles.css';
import { AddTodoContainer } from '../../components/AddTodoContainer';
import { Todo, TodoProps } from '../../components/Todo';

export const Main = () => {
  const [showTodoBtn, setShowTodoBtn] = useState<boolean>(false);

  const [tempTodo, setTempTodo] = useState<TodoProps | null>(null);

  const showAddTodo = () => {
    setShowTodoBtn((prev) => !prev);

    setTempTodo(null);
  };

  return (
    <div className="main_page">
      <Navbar />
      <div className="things_to_do">
        <Button onClick={showAddTodo}>
          {!showTodoBtn ? 'Добавить дело' : 'Скрыть дело'}
        </Button>

        {showTodoBtn && (
          <AddTodoContainer changeTempTodo={(todo) => setTempTodo(todo)} />
        )}

        <div className="todos">
          {tempTodo !== null && <Todo isTemp name={tempTodo.name} />}
          <Todo name="" />
          <Todo name="" />
          <Todo name="" />
        </div>
      </div>
    </div>
  );
};
