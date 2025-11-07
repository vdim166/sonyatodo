import { useEffect, useRef, useState } from 'react';
import './styles.css';
import { Cross } from '../../icons/Cross';
import { Check } from '../../icons/Check';
import { ipcSignals, saveTodoType } from '../../classes/ipcSignals';
import { setDeadlineType } from '../../../main/types/setDeadlineType';
import { useAppContext } from '../../hooks/useAppContext';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';

type DeadlinesWidgetProps = {
  from: string | null;
  to: string | null;
  todo: saveTodoType;
};

export const DeadlinesWidget = ({
  todo,
  from: initFrom,
  to: initTo,
}: DeadlinesWidgetProps) => {
  const [isPicking, setIsPicking] = useState(false);

  const dateFromRef = useRef<HTMLInputElement>(null);
  const dateToRef = useRef<HTMLInputElement>(null);

  const [to, setTo] = useState(initTo || '');
  const [from, setFrom] = useState(initFrom || '');

  const { currentProjectName } = useAppContext();

  useEffect(() => {
    if (isPicking) {
      setTimeout(() => {
        dateToRef.current?.showPicker?.();
      }, 0);
    }
  }, [isPicking]);

  const handleSubmit = async () => {
    if (to === '') return;

    try {
      const data: setDeadlineType = {
        from: from,
        to: to,
        topic: todo.currentTopic,
        id: todo.id,
      };

      await ipcSignals.setDeadLine(data, currentProjectName || 'main');

      setIsPicking(false);

      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };

  const formWholeDate = () => {
    const separator = ' / ';

    return `${from}${from !== '' && to !== '' ? separator : ''}${to}`;
  };

  const colorizeDate = (date: string) => {
    if (date === '') return '';

    const today = new Date();
    const targetDate = new Date(date);

    if (today > targetDate) {
      return 'red';
    } else {
      return '';
    }
  };

  return (
    <div className="deadlines_main">
      {!isPicking && (
        <p
          className={`deadlines_main_date ${colorizeDate(to)}`}
          onClick={() => {
            setIsPicking(true);
          }}
        >
          {to !== '' || from !== '' ? formWholeDate() : 'Дата не указана'}
        </p>
      )}

      {isPicking && (
        <div className="deadline_input_container">
          <input
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
            ref={dateFromRef}
            type="date"
            className="deadline_input"
          />
          <input
            ref={dateToRef}
            type="date"
            value={to}
            className="deadline_input"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />

          <div
            className="deadline_input_container_cross"
            onClick={() => {
              setIsPicking(false);
            }}
          >
            <Cross />
          </div>

          <div
            className={`deadline_input_container_success ${to === '' ? 'disabled' : ''}`}
            onClick={handleSubmit}
          >
            <Check />
          </div>
        </div>
      )}
    </div>
  );
};
