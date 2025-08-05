import { useState } from 'react';
import { SuccessSvg } from '../../../icons/SuccessSvg';
import './styles.css';
import { useAppContext } from '../../../hooks/useAppContext';

type SendTodoComponentType = {
  handleSendTodo: (tab: string) => () => void;
};

export const SendTodoComponent = ({
  handleSendTodo,
}: SendTodoComponentType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { tabs, currentPage } = useAppContext();

  const onClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsOpen((prev) => !prev);
  };

  if (!tabs) return <div>Loading...</div>;

  return (
    <div className="todo_success_modal_container">
      {isOpen && (
        <div className="todo_success_modal">
          {tabs
            .filter((tab) => tab !== currentPage)
            .map((tab) => {
              return (
                <div
                  className="todo_success_modal_option"
                  onClick={handleSendTodo(tab)}
                >
                  {tab}
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
