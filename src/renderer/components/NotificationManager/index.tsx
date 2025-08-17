import { useNotificationManager } from '../../hooks/useNotificationManager';
import './styles.css';
import { Note } from '../Note';
import { useEffect } from 'react';
import { NOTIFICATION_TYPES } from '../../contexts/NotificationManagerContext';

export const NotificationManager = () => {
  const { notifications, addNotification } = useNotificationManager();

  return (
    <div className="notification_manager">
      {notifications.map((note) => {
        return <Note {...note} key={note.id} />;
      })}
    </div>
  );
};
