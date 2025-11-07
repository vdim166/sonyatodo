import { useState } from 'react';
import { SuccessSvg } from '../../../icons/SuccessSvg';
import './styles.css';
import { useAppContext } from '../../../hooks/useAppContext';
import { saveTodoType } from '../../../classes/ipcSignals';

type SendTodoComponentType = {
  handleSendTodo: (tab: string) => () => void;
  todo: saveTodoType;
};

export const SendTodoComponent = ({
  handleSendTodo,
  todo,
}: SendTodoComponentType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { tabs } = useAppContext();

  const onClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsOpen((prev) => !prev);
  };

  if (!tabs) return <div>Loading...</div>;

  return (
    <div className="todo_success_modal_container">
      {isOpen && (
        <div className="todo_success_modal">
          {tabs
            .filter((tab) => tab.name !== todo.currentTopic)
            .map((tab) => {
              return (
                <div
                  className="todo_success_modal_option"
                  onClick={handleSendTodo(tab.name)}
                  key={tab.name}
                >
                  {tab.name}
                </div>
              );
            })}
        </div>
      )}

      <div className="todo_success" onClick={onClick}>
        <SuccessSvg />
      </div>
    </div>
  );
};
