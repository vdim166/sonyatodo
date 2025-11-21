import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPC_SIGNALS } from '../../main/consts';
import { useModalsContext } from '../hooks/useModalsContext';
import { MODALS } from '../contexts/ModalsContext';
import { ScheduleDateType } from '../../main/classes/ScheduleDatabase';
import { eventQueue } from '../utils/eventQueue';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const nav = useNavigate();

  const { openModal } = useModalsContext();

  useEffect(() => {
    const events = eventQueue.getEvents();

    for (let i = 0; i < events.length; ++i) {
      const { event, options } = events[i];

      if (event === 'open-calendar-day') {
        nav('/schedule');

        const result = options as ScheduleDateType;

        openModal({
          type: MODALS.SCHEDULE_VIEWER,
          props: {
            date: {
              day: Number(result.day),
              month: Number(result.month),
              year: Number(result.year),
            } as ScheduleDateType,
          },
        });
        eventQueue.removeEvent(event);
      }
    }
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPC_SIGNALS.OPEN_CALENDAR_DAY, (options) => {
      nav('/schedule');

      const result = options as ScheduleDateType;

      openModal({
        type: MODALS.SCHEDULE_VIEWER,
        props: {
          date: {
            day: Number(result.day),
            month: Number(result.month),
            year: Number(result.year),
          } as ScheduleDateType,
        },
      });
    });
  }, []);

  return children;
};
