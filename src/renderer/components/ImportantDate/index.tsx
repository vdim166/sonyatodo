import { useState } from 'react';
import './style.css';
import { Cross } from '../../icons/Cross';
import { ImportantDateDto } from '../../../main/classes/ImportantDatesDatabase';
import { importantDatesApi } from '../../classes/importantDatesApi';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { Pencil } from '../../icons/Pencil';
import { Check } from '../../icons/Check';
import { Textarea } from '../shared/components/Textarea';

function getMonthName(date: string) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [monthIndex, dayIndex] = date.split('-');

  return `${months[Number(monthIndex) - 1]} ${dayIndex}`;
}

type ImportantDateProps = { date: ImportantDateDto };

export const ImportantDate = ({ date }: ImportantDateProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isEditing, setIditing] = useState(false);

  const deleteHandle = async () => {
    try {
      await importantDatesApi.deleteImportantDate(date.id);

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_IMPORTANT_DATES),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const [nameEditing, setNameEditing] = useState(date.name);

  const [dateEditing, setDateEditing] = useState<string>(date.date);

  const changeHandleSubmit = async () => {
    if (date.name === nameEditing && date.date === dateEditing) {
      return setIditing(false);
    }

    try {
      const [, month, day] = dateEditing.split('-');

      await importantDatesApi.changeImportantDate(date.id, {
        name: nameEditing,
        date: `${month}-${day}`,
      });

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_IMPORTANT_DATES),
      );

      setIditing(false);
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
          <div className="important_date_content_text">{date.name}</div>
        ) : (
          <div className="important_date_content_text">
            <Textarea
              className="important_date_content_text_textarea"
              value={nameEditing}
              onChange={(e) => {
                setNameEditing(e.target.value);
              }}
            />
          </div>
        )}
      </div>

      <div className="important_date_action_menu">
        {!isEditing ? (
          <div>{getMonthName(date.date)}</div>
        ) : (
          <div>
            <input
              type="date"
              className="important_date_action_menu_change_date"
              value={dateEditing}
              onChange={(e) => {
                setDateEditing(e.target.value);
              }}
            />
          </div>
        )}
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
              onClick={changeHandleSubmit}
            >
              <Check />
            </div>
          )}
          <div
            className="important_date_action_menu_container_cross"
            onClick={deleteHandle}
          >
            <Cross />
          </div>
        </div>
      </div>
    </div>
  );
};
