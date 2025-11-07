import { useMemo, useState } from 'react';
import { ArrowDown } from '../../icons/ArrowDown';
import './styles.css';
import { ActionMenu } from './ActionMenu';
import { DeadlinesWidget } from '../DeadlinesWidget';
import { SmartLoadingImg } from '../SmartLoadingImg';
import { saveTodoType } from '../../classes/ipcSignals';

export type TodoProps = {
  isTemp?: boolean;

  todo: saveTodoType;

  openEditModal: () => void;
};

export const Todo = ({ isTemp = false, todo, openEditModal }: TodoProps) => {
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
    // TODO:
    // if (editState) {
    //   if (editState.forRecover.id === id) {
    //     return editState.current.name;
    //   }
    // }

    const name = todo.name;

    if (isOpen) {
      return name;
    }

    if (hover) {
      return name.substring(0, 40);
    }

    if (!isOpen) return name.substring(0, 30);
    return name;
  }, [isOpen, hover, todo]);

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

  const findImage = (value: string) => {
    const first = value.indexOf('<img>');

    if (first === -1) null;

    const second = value.indexOf('</img>');
    if (second === -1) null;
    if (first < second) {
      const imgLink = value.substring(first + 5, second);
      const textBefore = value.substring(0, first);

      const newValue = value.replace(`<img>${imgLink}</img>`, '');

      return {
        imgLink,
        value: newValue,
        first,
        second,
        textBefore,
      };
    }

    return null;
  };

  const parseDesc = (desc: string) => {
    const components = [];

    let currentValue = desc;

    while (true) {
      const result = findLink(currentValue);

      if (result) {
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
      } else {
        if (currentValue) {
          // components.push(currentValue);

          while (true) {
            const resultImage = findImage(currentValue);

            // {resultImage.imgLink}
            if (resultImage) {
              components.push(resultImage.textBefore);
              components.push(<br />);
              components.push(
                <SmartLoadingImg
                  link={`${todo.id}-${resultImage.imgLink}.jpg`}
                />,
              );
              components.push(<br />);

              currentValue = resultImage.value;
            } else {
              if (currentValue) {
                components.push(currentValue);
              }

              break;
            }
          }
        }

        break;
      }
    }

    return components;
  };

  return (
    <>
      <div className="todo_main">
        <div>
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
              <p>{parseDesc(todo.desc)}</p>
            </div>

            {!isTemp && (
              <div className="todo_arrow_down" onClick={handleClose}>
                <ArrowDown />
              </div>
            )}
          </div>

          <DeadlinesWidget
            todo={todo}
            to={todo.deadline?.to || null}
            from={todo.deadline?.from || null}
          />
        </div>
        {!isTemp && isOpen && (
          <div className="todo_action_menu_container">
            <ActionMenu todo={todo} openEditModal={openEditModal} />
          </div>
        )}
      </div>
    </>
  );
};
