import { useEffect, useState } from 'react';
import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import './styles.css';
import { scheduleDatesApi } from '../../classes/scheduleDatesApi';
import { ScheduleTodoDTO } from '../../../main/classes/ScheduleDatabase';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';

type CalendarDayProps = {
  date: {
    day: number;
    month: number;
    year: number;
  };

  impDates: {
    name: string;
    date: string;
    id: string;
  }[];

  holidays: {
    date: {
      day: number;
      month: number;
    };
    name: string;
    id: string;
  }[];
};

export const CalendarDay = ({ date, impDates, holidays }: CalendarDayProps) => {
  const { openModal } = useModalsContext();

  const [dates, setDates] = useState<ScheduleTodoDTO[] | null>(null);

  useEffect(() => {
    const loadDate = async () => {
      try {
        const data = await scheduleDatesApi.getScheduleTodos(date);

        if (data) {
          setDates(data);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadDate();

    const fetchCalendarDay = (event: Event) => {
      const customEvent = event as CustomEvent;

      if (customEvent.detail) {
        if (customEvent.detail) {
          const { day, month, year } = customEvent.detail;

          if (day === date.day && month === date.month && year === date.year) {
            loadDate();
          }
        }
      }
    };

    window.addEventListener(
      DISPATCH_EVENTS.FETCH_CALENDAR_DAY,
      fetchCalendarDay,
    );

    return () => {
      window.removeEventListener(
        DISPATCH_EVENTS.FETCH_CALENDAR_DAY,
        fetchCalendarDay,
      );
    };
  }, []);

  return (
    <div
      className="calendar_day_day"
      onClick={() => {
        openModal({
          type: MODALS.SCHEDULE_VIEWER,
          props: {
            date,
          },
        });
      }}
    >
      <p className="calendar_day_day_p">{date.day}</p>
      {(dates || impDates.length > 0 || holidays.length > 0) && (
        <div className="calendar_day_day_dates">
          {[...(dates || []), ...impDates, ...holidays].map((d) => {
            return (
              <div className="calendar_day_day_dates_option" key={d.id}>
                <p>{d.name[0].toLowerCase()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
