import { useContext } from 'react';
import { NotificationManagerContext } from '../contexts/NotificationManagerContext';

export const useNotificationManager = () => {
  if (!NotificationManagerContext)
    throw new Error('NotificationManagerContext is not defined');

  return useContext(NotificationManagerContext);
};
