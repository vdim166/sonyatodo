import { createContext } from 'react';

export const NOTIFICATION_TYPES = { NOTE: 'NOTE', ERROR: 'ERROR' } as const;

export type NotificationType = {
  id: string;
  text: string;
  type: keyof typeof NOTIFICATION_TYPES;
};

export type NotificationManagerContextType = {
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
  addNotification: (
    text: string,
    type?: keyof typeof NOTIFICATION_TYPES,
  ) => void;
};

const defaultState = {
  notifications: [],
  setNotifications: () => {},
  addNotification: () => {},
};

export const NotificationManagerContext =
  createContext<NotificationManagerContextType>(defaultState);
