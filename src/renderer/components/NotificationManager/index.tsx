import { useNotificationManager } from '../../hooks/useNotificationManager';
import './styles.css';
import { Note } from '../Note';

export const NotificationManager = () => {
  const { notifications } = useNotificationManager();

  return (
    <div className="notification_manager">
      {notifications.map((note) => {
        return <Note {...note} key={note.id} />;
      })}
    </div>
  );
};
