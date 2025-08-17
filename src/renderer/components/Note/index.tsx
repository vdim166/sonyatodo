import { memo, useEffect } from 'react';
import {
  NOTIFICATION_TYPES,
  NotificationType,
} from '../../contexts/NotificationManagerContext';
import './styles.css';
import { useNotificationManager } from '../../hooks/useNotificationManager';

export const Note = memo(({ text, id, type }: NotificationType) => {
  const { notifications, setNotifications } = useNotificationManager();

  useEffect(() => {
    setTimeout(() => {
      setNotifications((prev) => {
        const newState = [...prev];
        return newState.filter((note) => note.id !== id);
      });
    }, 2000);
  }, [notifications]);

  return (
    <div
      className={`notification ${type === NOTIFICATION_TYPES.ERROR ? 'error' : ''}`}
    >
      {text}
    </div>
  );
});
