// preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_SIGNALS } from './consts';
import { saveTodoType } from '../renderer/classes/ipcSignals';
import { DatabaseType } from './classes/Database';

// Типы для каналов IPC

export type Channels = keyof typeof IPC_SIGNALS;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },

    // Новые методы для работы с JSON
    saveData(data: saveTodoType): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.SAVE_DATA_BASE, data);
    },
    loadData(): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_DATA_BASE);
    },
    deleteData(id: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.DELETE_DATA, id);
    },
    moveTo(id: string, newTab: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.MOVE_TO, id, newTab);
    },
  },
};

// Экспортируем API в глобальную область видимости Renderer-процесса
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
