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

  const findLink = (value: string) => {
    const first = value.indexOf('<a>');

    if (first === -1) null;

    const second = value.indexOf('</a>');
    if (second === -1) null;
    if (first < second) {
      const word = value.substring(first + 3, second);

      const textBefore = value.substring(0, first);

      const newValue = value.replace(`<a>${word}</a>`, '');

      return {
        word,
        value: newValue,
        first,
        second,
        textBefore,
      };
    } else {
      return null;
    }
  };

  const parseDesc = (desc: string) => {
    const components = [];

    let currentValue = desc;

    while (true) {
      const result = findLink(currentValue);

      if (!result) {
        if (currentValue) {
          components.push(currentValue);
        }

        break;
      }

      components.push(result.textBefore);
      components.push(
        <span
          className="todo_link"
          onClick={() => {
            window.open(result.word, '_blank');
          }}
        >
          {result.word}
        </span>,
      );

      currentValue = result.value;
    }

    return components;
  };

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
        {editState && editState.forRecover.id === id ? (
          <p>{editState.current.desc}</p>
        ) : (
          <p>{parseDesc(desc)}</p>
        )}
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
