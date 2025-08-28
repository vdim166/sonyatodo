// preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_SIGNALS } from './consts';
import { saveTodoType } from '../renderer/classes/ipcSignals';
import { DatabaseType } from './classes/Database';
import { TabType } from '../renderer/contexts/AppContext';

// Типы для каналов IPC

export type Channels = keyof typeof IPC_SIGNALS;

export type WidgetSettingsType = {
  position: {
    x: number;
    y: number;
  } | null;
  autoStart: boolean;
};

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
    saveData(data: saveTodoType, projectName: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.SAVE_DATA_BASE, data, projectName);
    },
    loadData(): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_DATA_BASE);
    },
    deleteData(id: string, projectName: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.DELETE_DATA, id, projectName);
    },
    moveTo(
      id: string,
      newTab: string,
      projectName: string,
    ): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.MOVE_TO, id, newTab, projectName);
    },
    addTab(name: string, projectName: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.ADD_TAB, name, projectName);
    },
    deleteTabs(tabs: TabType[], projectName: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.DELETE_TABS, tabs, projectName);
    },
    changeTabsOrder(
      tabs: TabType[],
      projectName: string,
    ): Promise<DatabaseType> {
      return ipcRenderer.invoke(
        IPC_SIGNALS.CHANGE_TABS_ORDER,
        tabs,
        projectName,
      );
    },
    changeTab(
      todo: { name: string; desc: string },
      projectName: string,
    ): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.CHANGE_TAB, todo, projectName);
    },

    fetchProjects(): Promise<string[]> {
      return ipcRenderer.invoke(IPC_SIGNALS.FETCH_PROJECTS);
    },

    addProject(name: string): Promise<string[]> {
      return ipcRenderer.invoke(IPC_SIGNALS.ADD_PROJECT, name);
    },

    deleteProject(name: string): Promise<string[]> {
      return ipcRenderer.invoke(IPC_SIGNALS.DELETE_PROJECT, name);
    },

    getWidgetSettings(): Promise<WidgetSettingsType> {
      return ipcRenderer.invoke(IPC_SIGNALS.GET_WIDGET_SETTINGS);
    },

    setAutoStartWidget(state: boolean) {
      ipcRenderer.send(IPC_SIGNALS.SET_WIDGET_AUTO_START, state);
    },

    startDrag: (mouseX: number, mouseY: number) => {
      ipcRenderer.send('drag-start', { x: mouseX, y: mouseY });
    },

    dragWindow: (mouseX: number, mouseY: number) => {
      ipcRenderer.send('window-drag', { x: mouseX, y: mouseY });
    },

    endDrag: (mouseX: number, mouseY: number) => {
      ipcRenderer.send('drag-end', { x: mouseX, y: mouseY });
    },

    setIgnoreMouseEvents: (ignore: boolean, options: any) => {
      ipcRenderer.send('set-ignore-mouse-events', ignore, options);
    },

    closeWidget: () => {
      ipcRenderer.send('close-widget');
    },

    minimizeWidget: () => {
      ipcRenderer.send('minimize-widget');
    },
  },
};

// Экспортируем API в глобальную область видимости Renderer-процесса
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
