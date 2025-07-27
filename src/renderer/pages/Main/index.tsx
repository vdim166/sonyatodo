import { useEffect, useState } from 'react';
import { Button } from '../../components/shared/Button';
import { Navbar } from '../../components/Navbar';
import './styles.css';
import { AddTodoContainer } from '../../components/AddTodoContainer';
import { Todo, TodoProps } from '../../components/Todo';
import { useAppContext } from '../../hooks/useAppContext';
import { TodoNavbar } from '../../components/TodoNavbar';

export const TODO_NAVBAR_PAGES = {
  TODO: 'TODO',
  DONE: 'DONE',
} as const;

export const Main = () => {
  const [showTodoBtn, setShowTodoBtn] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<TodoProps | null>(null);

  const { todos } = useAppContext();

  const [currentPage, setCurrentPage] = useState<
    keyof typeof TODO_NAVBAR_PAGES
  >(TODO_NAVBAR_PAGES.TODO);

  const showAddTodo = () => {
    setShowTodoBtn((prev) => !prev);
    setTempTodo(null);
  };

  console.log('todos', todos);

  const currentTodos = todos.filter((todo) => {
    console.log('currentPage', currentPage, todo);

    if (currentPage === TODO_NAVBAR_PAGES.TODO) {
      return !todo.done;
    } else if (currentPage === TODO_NAVBAR_PAGES.DONE) {
      if (todo.done) return true;
    } else {
      return false;
    }
  });

  console.log('currentTodos', currentTodos);

  return (
    <div className="main_page">
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
          <TodoNavbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {currentPage === TODO_NAVBAR_PAGES.TODO && (
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
          )}

          {currentPage === TODO_NAVBAR_PAGES.DONE && (
            <div>
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
          )}
        </div>
      </div>
    </div>
  );
};
