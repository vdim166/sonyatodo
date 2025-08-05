import { useEffect, useState } from 'react';
import { Button } from '../../components/shared/Button';
import { Navbar } from '../../components/Navbar';
import './styles.css';
import { AddTodoContainer } from '../../components/AddTodoContainer';
import { Todo, TodoProps } from '../../components/Todo';
import { useAppContext } from '../../hooks/useAppContext';
import { TodoNavbar } from '../../components/TodoNavbar';
import { BurgerMenu } from '../../components/BurgerMenu';

export const Main = () => {
  const [showTodoBtn, setShowTodoBtn] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<TodoProps | null>(null);

  const { todos, currentPage } = useAppContext();

  const showAddTodo = () => {
    setShowTodoBtn((prev) => !prev);
    setTempTodo(null);
  };

  if (!todos) {
    return <div>Loading....</div>;
  }

  const currentTodos = todos.filter((todo) => {
    return currentPage === todo.currentTab;
  });

  return (
    <div className="main_page">
      <BurgerMenu />
      <Navbar />
      <div className="things_to_do">
        <Button onClick={showAddTodo}>
          {!showTodoBtn ? 'Добавить дело' : 'Скрыть дело'}
        </Button>

        {showTodoBtn && (
          <AddTodoContainer
            changeTempTodo={(todo) => setTempTodo(todo)}
            closeModal={() => {
              setTempTodo(null);
            }}
          />
        )}

        <div>
          <TodoNavbar />
          <div className="todos">
            {tempTodo !== null && <Todo isTemp {...tempTodo} />}
            {currentTodos.length > 0
              ? currentTodos.map((todo) => {
                  return <Todo {...todo} key={todo.id} />;
                })
              : !tempTodo && (
                  <div className="no_todo_yet">
                    <p>У вас пока что нет дел</p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};
