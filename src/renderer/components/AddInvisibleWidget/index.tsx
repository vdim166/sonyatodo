import { useState } from 'react';
import { Plus } from '../../icons/Plus';
import './styles.css';
import { Input } from '../shared/components/Input';
import { Button } from '../shared/components/Button';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { useAppContext } from '../../hooks/useAppContext';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';

type AddInvisibleWidgetProps = {
  currentTodo: saveTodoType;
};

export const AddInvisibleWidget = ({
  currentTodo,
}: AddInvisibleWidgetProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const { currentProjectName } = useAppContext();
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    try {
      const { data }: { data: saveTodoType } = await ipcSignals.saveData(
        {
          name: value,
          desc: '',
          currentTopic: 'TODO',
          hidden: true,
        } as saveTodoType,
        currentProjectName || 'main',
      );

      await ipcSignals.addLinkToTodo(
        currentTodo.id,
        currentTodo.currentTopic,
        currentProjectName || 'main',
        {
          projectName: currentProjectName || 'main',
          todo: data,
        },
      );

      setValue('');

      setIsClicked(false);

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <div className="edit_todo_modal_links_option_container_plus">
      {!isClicked ? (
        <div className="edit_todo_modal_links_option_container_plus_container">
          <p>Добавить новую связь</p>
          <div
            onClick={() => {
              setIsClicked(true);
            }}
          >
            <Plus />
          </div>
        </div>
      ) : (
        <>
          <div className="edit_todo_modal_links_option_container_input_container">
            <Input
              className="edit_todo_modal_links_option_container_plus_input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              autoFocus
            />

            <Button
              className="edit_todo_modal_links_option_container_input_container_btn"
              onClick={handleSubmit}
              disabled={value.length === 0}
            >
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
