import { useEffect, useState } from 'react';
import { Button } from '../../components/shared/Button';
import { Navbar } from '../../components/Navbar';
import './styles.css';
import { AddTodoContainer } from '../../components/AddTodoContainer';
import { Todo, TodoProps } from '../../components/Todo';
import { useAppContext } from '../../hooks/useAppContext';
import { TodoNavbar } from '../../components/TodoNavbar';
import { BurgerMenu } from '../../components/BurgerMenu';
import { editModalState, EditTodoModal } from '../../components/EditTodoModal';
import { ProjectsHolder } from '../../components/ProjectsHolder';

export const Main = () => {
  const [showTodoBtn, setShowTodoBtn] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<TodoProps | null>(null);

  const [showEditModal, setShowEditModal] = useState<editModalState | null>(
    null,
  );

  const { todos, currentTab } = useAppContext();

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
      <div className="things_to_do">
        <Button onClick={showAddTodo} className="add_button">
          {!showTodoBtn ? 'Добавить дело' : 'Скрыть дело'}
        </Button>

        {showTodoBtn && (
          <AddTodoContainer
            changeTempTodo={(todo) => setTempTodo(todo)}
            closeModal={() => {
              setTempTodo(null);
              setShowTodoBtn(false);
            }}
          />
        )}

        {showEditModal && (
          <EditTodoModal
            state={showEditModal}
            setShowEditModal={setShowEditModal}
          />
        )}

        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%)',
            top: '140px',
          }}
        >
          <TodoNavbar />
          <div className="todos">
            {tempTodo !== null && <Todo isTemp {...tempTodo} />}
            {todos.length > 0
              ? todos.map((todo) => {
                  return (
                    <Todo
                      {...todo}
                      openEditModal={() => {
                        setShowTodoBtn(false);
                        setShowEditModal({
                          current: structuredClone(todo),
                          forRecover: structuredClone(todo),
                        });
                      }}
                      editState={showEditModal}
                      key={todo.id}
                    />
                  );
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
