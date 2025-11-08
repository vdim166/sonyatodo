import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Input } from '../shared/components/Input';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { CancelButton } from '../shared/components/CancelButton';
import { useAppContext } from '../../hooks/useAppContext';
import { useNotificationManager } from '../../hooks/useNotificationManager';
import { Cross } from '../../icons/Cross';
import { AddLinksToTodo } from '../AddLinksToTodo';
import { TextareaWithTools } from '../shared/components/TextareaWithTools';
import { ActionMenu } from '../Todo/ActionMenu';
import { DeadlinesWidget } from '../DeadlinesWidget';
import { BackArrow } from '../../icons/BackArrow';
import { LinkToWidget } from '../LinkToWidget';

export type imagesToAddType = {
  name: string;
  buffer: Uint8Array<ArrayBuffer>;
};

export const EditTodoModal = () => {
  const { showEditModal, setShowEditModal, setTodos, currentProjectName } =
    useAppContext();

  const [imagesToAdd, setImagesToAdd] = useState<imagesToAddType[]>([]);

  const [state, setState] = useState<{
    current: saveTodoType;
    forRecovery: saveTodoType;
  } | null>(null);

  const { addNotification } = useNotificationManager();

  const handleChange = async () => {
    if (!currentProjectName) return;
    if (state === null) return;
    try {
      for (let i = 0; i < imagesToAdd.length; ++i) {
        const imageToAdd = imagesToAdd[i];

        const data = {
          id: state.current.id,
          name: imageToAdd.name,
          data: imageToAdd.buffer,
          topic: state.current.currentTopic,
        };

        window.electron.ipcRenderer.addTodoImage(data, currentProjectName);
      }

      const response = await ipcSignals.changeTodo(
        { ...state.current },
        currentProjectName,
      );

      setTodos(response);

      setShowEditModal(null);
      addNotification('Задача изменена');
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey) return;
      if (event.key === 'Enter') {
        handleChange();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state]);

  useEffect(() => {
    if (showEditModal) {
      const getTodo = async () => {
        try {
          const todo = await ipcSignals.getTodoById(
            showEditModal.id,
            showEditModal.currentTopic,
            currentProjectName || 'main',
          );

          if (todo === null) return setState(null);

          setState({
            current: structuredClone(todo),
            forRecovery: structuredClone(todo),
          });
        } catch (error) {
          console.log('error', error);
        }
      };

      getTodo();
    } else {
      setState(null);
    }
  }, [showEditModal]);

  if (state === null) return;

  if (state.current === null) return;

  const backHandle = () => {
    setState((prev) => {
      if (!prev) return null;
      const newState = { ...prev };
      newState.current = structuredClone(newState.forRecovery);
      return newState;
    });
  };

  const isChangeDisabled =
    state.current.name === state.forRecovery.name &&
    state.current.desc === state.forRecovery.desc;

  return (
    <div className="edit_todo_modal">
      <div
        className="add_todo_container_inputs"
        style={{
          minWidth: '250px',
        }}
      >
        <div
          className="add_todo_container_inputs_cross"
          onClick={() => {
            setShowEditModal(null);
          }}
        >
          <Cross />
        </div>

        {showEditModal?.original && (
          <div
            className="add_todo_container_inputs_back"
            onClick={() => {
              setShowEditModal(null);

              setTimeout(() => {
                if (!showEditModal.original) return;
                setShowEditModal({
                  id: showEditModal.original.id,
                  currentTopic: showEditModal.original.currentTopic,
                });
              }, 0);
            }}
          >
            <BackArrow />
          </div>
        )}
        <h1 className="edit_todo_modal_title">Изменить</h1>
        <div className="add_todo_container_inputs_option">
          <p>Name:</p>
          <Input
            autoFocus
            value={state.current.name}
            onChange={(e) =>
              setState((prev) => {
                if (!prev) return null;

                const newState = { ...prev };
                newState.current.name = e.target.value;
                return newState;
              })
            }
          />
        </div>
        <div className="add_todo_container_inputs_option">
          <p>Description:</p>
          <TextareaWithTools
            value={state.current.desc}
            onChange={(e) =>
              setState((prev) => {
                if (!prev) return null;
                const newState = { ...prev };
                newState.current.desc = e.target.value;

                return newState;
              })
            }
            setValue={(value) => {
              setState((prev) => {
                if (!prev) return null;
                const newState = { ...prev };
                newState.current.desc = value;

                return newState;
              });
            }}
            addFile={(fileObj) => {
              setImagesToAdd((prev) => {
                const newState = [...prev, fileObj];

                return newState;
              });
            }}
          />
        </div>

        <div className="edit_todo_modal_action_menu">
          <ActionMenu todo={state.current} />
        </div>

        <div className="edit_todo_modal_deadline_widget">
          <DeadlinesWidget
            todo={state.current}
            to={state.current.deadline?.to || null}
            from={state.current.deadline?.from || null}
          />
        </div>

        <div className="edit_todo_modal_links">
          <p className="edit_todo_modal_links_title">Привязать к</p>
          <LinkToWidget todo={state.current} />
        </div>

        <div className="edit_todo_modal_links">
          <p className="edit_todo_modal_links_title">Связи</p>

          <AddLinksToTodo
            todo={state.current}
            setShowEditModal={setShowEditModal}
          />
        </div>

        <Button onClick={handleChange} disabled={isChangeDisabled}>
          Сохранить
        </Button>
        <CancelButton onClick={backHandle} disabled={isChangeDisabled}>
          Вернуть обратно
        </CancelButton>
        <CancelButton onClick={() => setShowEditModal(null)}>
          Закрыть
        </CancelButton>
      </div>
    </div>
  );
};
