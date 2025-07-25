// preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_SIGNALS } from './consts';

// Типы для каналов IPC
export type Channels = 'ipc-example' | 'save-json' | 'load-json';

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
    saveData(data: unknown) {
      return ipcRenderer.invoke(IPC_SIGNALS.SAVE_DATA_BASE, data);
    },
    loadData() {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_DATA_BASE);
    },
    deleteData(id: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.DELETE_DATA, id);
    },
  },
};

// Экспортируем API в глобальную область видимости Renderer-процесса
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
