import { memo, useEffect } from 'react';
import { NotificationType } from '../../contexts/NotificationManagerContext';
import './styles.css';
import { useNotificationManager } from '../../hooks/useNotificationManager';

export const Note = memo(({ text, id }: NotificationType) => {
  const { notifications, setNotifications } = useNotificationManager();

  useEffect(() => {
    setTimeout(() => {
      setNotifications((prev) => {
        const newState = [...prev];
        return newState.filter((note) => note.id !== id);
      });
    }, 2000);
  }, [notifications]);

  return <div className="notification">{text}</div>;
});
