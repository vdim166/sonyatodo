import { useState } from 'react';
import { Button } from '../../components/shared/components/Button';
import { Navbar } from '../../components/Navbar';
import './styles.css';
import { AddTodoContainer } from '../../components/AddTodoContainer';
import { Todo, TodoProps } from '../../components/Todo';
import { useAppContext } from '../../hooks/useAppContext';
import { TodoNavbar } from '../../components/TodoNavbar';
import { BurgerMenu } from '../../components/BurgerMenu';
import { EditTodoModal } from '../../components/EditTodoModal';
import { ProjectsHolder } from '../../components/ProjectsHolder';
import { sortTodosByDeadline } from '../../components/shared/functions/sortTodosByDeadline';
import { TodoSearch } from '../../components/TodoSearch';

export const Main = () => {
  const { setShowEditModal } = useAppContext();

  const [showTodoBtn, setShowTodoBtn] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<TodoProps | null>(null);

  const { todos } = useAppContext();

  const showAddTodo = () => {
    setShowEditModal(null);
    setShowTodoBtn((prev) => !prev);
    setTempTodo(null);
  };

  if (!todos) {
    return <div>Loading....</div>;
  }

  return (
    <div className="main_page">
      <BurgerMenu />
      <ProjectsHolder />
      <Navbar />
      <TodoSearch />
      <div className="things_to_do">
        <Button onClick={showAddTodo} className="add_button">
          {!showTodoBtn ? 'Добавить дело' : 'Скрыть дело'}
        </Button>

        {showTodoBtn && (
          <AddTodoContainer
            changeTempTodo={(name, desc) =>
              setTempTodo((prev) => {
                if (!prev) return null;
                const newState = { ...prev };

                newState.todo.name = name;
                newState.todo.desc = desc;

                return newState;
              })
            }
            closeModal={() => {
              setTempTodo(null);
              setShowTodoBtn(false);
            }}
          />
        )}

        <EditTodoModal />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%)',
            top: '180px',
          }}
        >
          <TodoNavbar />
          <div className="todos">
            {tempTodo !== null && <Todo isTemp {...tempTodo} />}
            {todos.length > 0
              ? sortTodosByDeadline(todos.filter((t) => t.hidden !== true)).map(
                  (todo) => {
                    return (
                      <Todo
                        openEditModal={() => {
                          setShowTodoBtn(false);
                          setShowEditModal({
                            id: todo.id,
                            currentTopic: todo.currentTopic,
                          });
                        }}
                        todo={todo}
                        key={todo.id}
                      />
                    );
                  },
                )
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
