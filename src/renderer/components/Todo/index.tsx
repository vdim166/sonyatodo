import { useMemo, useState } from 'react';
import { ArrowDown } from '../../icons/ArrowDown';
import './styles.css';
import { ActionMenu } from './ActionMenu';
import { editModalState } from '../EditTodoModal';

export type TodoProps = {
  isTemp?: boolean;
  name: string;
  desc: string;
  id: string;

  editState: editModalState | null;
  openEditModal: () => void;
};

export const Todo = ({
  name,
  desc,
  isTemp = false,
  id,
  editState,
  openEditModal,
}: TodoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const calcName = useMemo(() => {
    if (editState) {
      if (editState.forRecover.id === id) {
        return editState.current.name;
      }
    }

    if (isOpen) {
      return name;
    }

    if (hover) {
      return name.substring(0, 40);
    }

    if (!isOpen) return name.substring(0, 30);
    return name;
  }, [isOpen, hover, name, editState]);

  return (
    <div
      className={`${isOpen ? 'todo_open' : 'todo'} ${isTemp ? 'todo_temp' : ''} ${!isOpen && hover ? 'todo_hover_open' : ''}`}
      onClick={handleOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="todo_name">
        <p>{calcName}</p>
      </div>

      <div className="todo_desc">
        <p>
          {editState && editState.forRecover.id === id
            ? editState.current.desc
            : desc}
        </p>
      </div>

      {!isTemp && isOpen && (
        <ActionMenu id={id} openEditModal={openEditModal} />
      )}

      {!isTemp && (
        <div className="todo_arrow_down" onClick={handleClose}>
          <ArrowDown />
        </div>
      )}
    </div>
  );
};
