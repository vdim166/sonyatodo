import { useState } from 'react';
import './styles.css';
import { Textarea } from '../shared/components/Textarea';
import { Pencil } from '../../icons/Pencil';
import { Check } from '../../icons/Check';
import { Cross } from '../../icons/Cross';
import { LongTermAffairsTodoType } from '../../../main/classes/LongTermAffairsDatabase';
import { longTermAffairsApi } from '../../classes/longTermAffairsApi';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { useLongTermAffairsContext } from '../../hooks/useLongTermAffairsContext';
import { SuccessSvg } from '../../icons/SuccessSvg';
import { BackArrow } from '../../icons/BackArrow';

type LongTermAffairsTodoProps = {
  todo: LongTermAffairsTodoType;
};

export const LongTermAffairsTodo = ({ todo }: LongTermAffairsTodoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isEditing, setIditing] = useState(false);
  const [name, setName] = useState(todo.name);

  const { currentTab } = useLongTermAffairsContext();

  const handleDelete = async () => {
    try {
      await longTermAffairsApi.deleteLongTermAffair(todo.id, currentTab);

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS),
      );

      longTermAffairsApi.updateWidgetData();
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleChange = async () => {
    try {
      await longTermAffairsApi.changeLongTermAffair(todo.id, currentTab, {
        name,
      });

      setIditing(false);

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS),
      );

      longTermAffairsApi.updateWidgetData();
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleMove = async () => {
    try {
      const moveTo = currentTab === 'TODO' ? 'DONE' : 'TODO';

      await longTermAffairsApi.moveLongTermAffair(todo.id, currentTab, moveTo);

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS),
      );

      longTermAffairsApi.updateWidgetData();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div
      className={`important_date ${!isEditing && isOpen ? 'open' : ''} ${isEditing ? 'open' : ''}`}
    >
      <div
        className={`important_date_content`}
        onClick={() => {
          if (isEditing) {
            return;
          }

          setIsOpen((prev) => !prev);
        }}
      >
        {!isEditing ? (
          <div className="important_date_content_text">{todo.name}</div>
        ) : (
          <div className="important_date_content_text">
            <Textarea
              className="important_date_content_text_textarea"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        )}
      </div>

      <div className="important_date_action_menu">
        <div className="important_date_action_menu_container">
          {!isEditing ? (
            <div
              className="important_date_action_menu_container_edit"
              onClick={() => {
                setIditing(true);
              }}
            >
              <Pencil />
            </div>
          ) : (
            <div
              className="important_date_action_menu_container_check"
              onClick={handleChange}
            >
              <Check />
            </div>
          )}
          <div className="LongTermAffairsTodo_check" onClick={handleMove}>
            {currentTab === 'TODO' ? <SuccessSvg /> : <BackArrow />}
          </div>
          <div
            className="important_date_action_menu_container_cross"
            onClick={handleDelete}
          >
            <Cross />
          </div>
        </div>
      </div>
    </div>
  );
};
