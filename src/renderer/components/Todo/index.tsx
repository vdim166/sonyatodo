import { useState } from 'react';
import { ArrowDown } from '../../icons/ArrowDown';
import './styles.css';
import { ActionMenu } from './ActionMenu';

export type TodoProps = {
  isTemp?: boolean;
  name: string;
  desc: string;
};

export const Todo = ({ name, desc, isTemp = false }: TodoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`${isOpen ? 'todo_open' : 'todo'} ${isTemp ? 'todo_temp' : ''}`}
      onClick={handleOpen}
    >
      <div className="todo_name">
        <p>{name}</p>
      </div>

      <div className="todo_desc">
        <p>{desc}</p>
      </div>

      {isOpen && <ActionMenu />}

      {!isTemp && (
        <div className="todo_arrow_down" onClick={handleClose}>
          <ArrowDown />
        </div>
      )}
    </div>
  );
};
