import { useEffect, useMemo, useState } from 'react';
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

  const [components, setComponents] = useState<React.ReactNode[] | null>(null);

  const [cacheImg, setCacheImg] = useState<{ [key: string]: string }>({});

  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const calcName = useMemo(() => {
    const name = todo.name;

    if (isOpen) {
      return name;
    }

    if (!isOpen) return name.substring(0, 30);
    return name;
  }, [isOpen, todo]);

  const findTag = (value: string) => {
    const linkStart = value.indexOf('<a>');
    const imgStart = value.indexOf('<img>');

    // Find which tag comes first
    let tagType: 'link' | 'img' | null = null;
    let start = -1;
    let end = -1;
    let content = '';

    if (linkStart !== -1 && (imgStart === -1 || linkStart < imgStart)) {
      start = linkStart;
      end = value.indexOf('</a>', start);
      tagType = 'link';
      if (end !== -1) {
        content = value.substring(start + 3, end);
      }
    } else if (imgStart !== -1) {
      start = imgStart;
      end = value.indexOf('</img>', start);
      tagType = 'img';
      if (end !== -1) {
        content = value.substring(start + 5, end);
      }
    }

    if (tagType && start !== -1 && end !== -1) {
      const textBefore = value.substring(0, start);
      const newValue = value.substring(end + (tagType === 'link' ? 4 : 6)); // skip closing tag
      return { tagType, content, textBefore, value: newValue };
    }

    return null;
  };

  const parseDesc = () => {
    const components: React.ReactNode[] = [];
    let currentValue = todo.desc;

    while (currentValue.length > 0) {
      const result = findTag(currentValue);

      if (!result) {
        components.push(currentValue);
        break;
      }

      if (result.textBefore) {
        components.push(result.textBefore);
      }

      if (result.tagType === 'link') {
        components.push(
          <span
            key={Math.random()}
            className="todo_link"
            onClick={() => window.open(result.content, '_blank')}
          >
            {result.content}
          </span>,
        );
      } else if (result.tagType === 'img') {
        components.push(<br key={Math.random()} />);
        components.push(
          <SmartLoadingImg
            key={`${todo.id}-${result.content}.jpg`}
            link={`${todo.id}-${result.content}.jpg`}
            isClickable={isOpen}
            setCache={(value) => {
              setCacheImg((prev) => {
                const newCache = { ...prev };
                newCache[`${todo.id}-${result.content}.jpg`] = value;

                return newCache;
              });
            }}
            alreadyHave={
              cacheImg[`${todo.id}-${result.content}.jpg`] || undefined
            }
          />,
        );
        components.push(<br key={Math.random()} />);
      }

      currentValue = result.value;
    }

    setComponents(components);
  };

  useEffect(() => {
    parseDesc();
  }, [todo, isOpen]);

  if (!components) return <div>Loading...</div>;
  return (
    <>
      <div className="todo_main">
        <div>
          <div
            className={`${isOpen ? 'todo_open' : 'todo'} ${isTemp ? 'todo_temp' : ''}`}
            onClick={handleOpen}
          >
            <div className="todo_name">
              <p>{calcName}</p>
            </div>

            <div className="todo_desc">
              <p>{components}</p>
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
