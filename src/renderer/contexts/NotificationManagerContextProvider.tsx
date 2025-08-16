import React, { useState } from 'react';
import {
  NOTIFICATION_TYPES,
  NotificationManagerContext,
  NotificationManagerContextType,
  NotificationType,
} from './NotificationManagerContext';
import { generateRandomId } from '../../main/utils/generateRandomId';

type NotificationManagerContextProviderType = {
  children: React.ReactNode;
};

export const NotificationManagerContextProvider = ({
  children,
}: NotificationManagerContextProviderType) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (
    text: string,
    type: keyof typeof NOTIFICATION_TYPES = NOTIFICATION_TYPES.NOTE,
  ) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { text, type, id: generateRandomId() },
    ]);
  };

  const state: NotificationManagerContextType = {
    notifications,
    setNotifications,
    addNotification,
  };

  return (
    <NotificationManagerContext.Provider value={state}>
      {children}
    </NotificationManagerContext.Provider>
  );
};
