import { useEffect, useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Textarea } from '../shared/Textarea';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { CancelButton } from '../shared/CancelButton';
import { useAppContext } from '../../hooks/useAppContext';

export type editModalState = {
  current: saveTodoType;
  forRecover: saveTodoType;
};

type EditTodoModalProps = {
  state: editModalState;
  setShowEditModal: React.Dispatch<React.SetStateAction<editModalState | null>>;
};

export const EditTodoModal = ({
  state,
  setShowEditModal,
}: EditTodoModalProps) => {
  const { setTodos, currentProjectName } = useAppContext();

  const backHandle = () => {
    setShowEditModal((prev) => {
      if (!prev) return null;
      const newState = { ...prev };
      newState.current = structuredClone(newState.forRecover);
      return newState;
    });
  };

  const handleChange = async () => {
    if (!currentProjectName) return;
    try {
      const response = await ipcSignals.changeTab(
        state.current,
        currentProjectName,
      );

      setTodos(response);

      setShowEditModal(null);
    } catch (error) {
      console.log('error', error);
    }
  };

  const isChangeDisabled =
    state.current.name === state.forRecover.name &&
    state.current.desc === state.forRecover.desc;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleChange();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state]);

  return (
    <div className="edit_todo_modal">
      <div className="add_todo_container_inputs">
        <h1>Изменить</h1>
        <div className="add_todo_container_inputs_option">
          <p>Name:</p>
          <Input
            autoFocus
            value={state.current.name}
            onChange={(e) =>
              setShowEditModal((prev) => {
                if (!prev) return null;

                const newState = { ...prev };
                newState.current.name = e.target.value;
                return newState;
              })
            }
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                handleChange();
              }
            }}
          />
        </div>
        <div className="add_todo_container_inputs_option">
          <p>Description:</p>
          <Textarea
            value={state.current.desc}
            onChange={(e) =>
              setShowEditModal((prev) => {
                if (!prev) return null;
                const newState = { ...prev };
                newState.current.desc = e.target.value;

                return newState;
              })
            }
          />
        </div>

        <Button onClick={handleChange} disabled={isChangeDisabled}>
          Сохранить
        </Button>
        <CancelButton onClick={backHandle} disabled={isChangeDisabled}>
          Вернуть обратно
        </CancelButton>
      </div>
    </div>
  );
};
