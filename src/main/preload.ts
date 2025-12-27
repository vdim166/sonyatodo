// preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  IMPORTANT_DATES_SIGNALS,
  IPC_SIGNALS,
  LONG_TERM_AFFAIRS_SIGNALS,
  SCHEDULE_SIGNALS,
} from './consts';
import { saveTodoType } from '../renderer/classes/ipcSignals';
import { TabType } from '../renderer/contexts/AppContext';
import { DatabaseType } from './types/DatabaseType';
import { setDeadlineType } from './types/setDeadlineType';
import { addTodoImageType } from './types/addTodoImageType';
import { candidateLinkType } from '../renderer/components/AddLinksToTodo';
import { ImportantDateType } from './classes/ImportantDatesDatabase';
import { LongTermAffairsDTO } from './classes/LongTermAffairsDatabase';
import { ScheduleDateType, ScheduleTodoType } from './classes/ScheduleDatabase';

// Типы для каналов IPC

export type Channels = keyof typeof IPC_SIGNALS;

export type WidgetSettingsType = {
  position: {
    x: number;
    y: number;
  } | null;
  autoStart: boolean;
  imageWidget: boolean;
};

const electronHandler = {
  ipcRenderer: {
    reactDomLoaded() {
      return ipcRenderer.invoke('main-window-dom-ready');
    },
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
    saveData(data: saveTodoType, projectName: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.SAVE_DATA_BASE, data, projectName);
    },
    loadData(): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_DATA_BASE);
    },
    deleteData(
      id: string,
      currentTab: string,
      projectName: string,
    ): Promise<DatabaseType> {
      return ipcRenderer.invoke(
        IPC_SIGNALS.DELETE_DATA,
        id,
        currentTab,
        projectName,
      );
    },
    moveTo(
      id: string,
      newTab: string,
      currentTab: string,
      projectName: string,
    ): Promise<DatabaseType> {
      return ipcRenderer.invoke(
        IPC_SIGNALS.MOVE_TO,
        id,
        newTab,
        currentTab,
        projectName,
      );
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
    changeTodo(todo: saveTodoType, projectName: string): Promise<DatabaseType> {
      return ipcRenderer.invoke(IPC_SIGNALS.CHANGE_TODO, todo, projectName);
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

    findTodoByPattern(pattern: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.FIND_TODO_BY_PATTERN, pattern);
    },

    updateImportantDatesData() {
      ipcRenderer.invoke(
        IMPORTANT_DATES_SIGNALS.UPDATE_IMPORTANT_DATE_TODOS_WIDGET,
      );
    },

    updateLongTermAffairsTodoWidget() {
      ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.UPDATE_LONG_TERM_AFFAIRS_TODOS_WIDGET,
      );
    },

    updateCalendarWidget() {
      ipcRenderer.invoke(SCHEDULE_SIGNALS.UPDATE_CALENDAR_TODOS_WIDGET);
    },

    setDeadLine(options: setDeadlineType, projectName: string) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.SET_TODO_DEADLINE,
        options,
        projectName,
      );
    },
    addTodoImage(options: addTodoImageType, projectName: string) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.SAVE_TODO_IMAGE,
        options,
        projectName,
      );
    },

    addTodoVideo(options: addTodoImageType, projectName: string) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.SAVE_TODO_VIDEO,
        options,
        projectName,
      );
    },

    addTodoFile(options: addTodoImageType, projectName: string) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.SAVE_TODO_FILE,
        options,
        projectName,
      );
    },

    addLinkToTodo(
      id: string,
      topic: string,
      project: string,
      link: candidateLinkType,
    ) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.ADD_LINK_TO_TODO,
        id,
        topic,
        project,
        link,
      );
    },

    deleteLinkFromTodo(
      id: string,
      topic: string,
      project: string,
      linkId: string,
    ) {
      return ipcRenderer.invoke(
        IPC_SIGNALS.DELETE_LINK_FROM_TODO,
        id,
        topic,
        project,
        linkId,
      );
    },

    getTodoById(id: string, topic: string, project: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.GET_TODO_BY_ID, id, topic, project);
    },

    loadTodoImage(name: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_TODO_IMAGE, name);
    },

    loadTodoVideo(name: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_TODO_VIDEO, name);
    },

    loadTodoFile(name: string) {
      return ipcRenderer.invoke(IPC_SIGNALS.LOAD_TODO_FILE, name);
    },

    addImportantDate(date: ImportantDateType) {
      return ipcRenderer.invoke(
        IMPORTANT_DATES_SIGNALS.ADD_IMPORTANT_DATE,
        date,
      );
    },

    deleteImportantDate(id: string) {
      return ipcRenderer.invoke(
        IMPORTANT_DATES_SIGNALS.DELETE_IMPORTANT_DATE,
        id,
      );
    },

    changeImportantDate(id: string, newDate: ImportantDateType) {
      return ipcRenderer.invoke(
        IMPORTANT_DATES_SIGNALS.CHANGE_IMPORTANT_DATE,
        id,
        newDate,
      );
    },

    getAllImportantDates() {
      return ipcRenderer.invoke(
        IMPORTANT_DATES_SIGNALS.GET_ALL_IMPORTANT_DATES,
      );
    },

    addLongTermAffair(data: LongTermAffairsDTO) {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.ADD_LONG_TERM_AFFAIR,
        data,
      );
    },

    deleteLongTermAffair(id: string, state: 'TODO' | 'DONE') {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.DELETE_LONG_TERM_AFFAIR,
        id,
        state,
      );
    },

    changeLongTermAffair(
      id: string,
      state: 'TODO' | 'DONE',
      newData: LongTermAffairsDTO,
    ) {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.CHANGE_LONG_TERM_AFFAIR,
        id,
        state,
        newData,
      );
    },

    getAllLongTermAffairs() {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.GET_ALL_LONG_TERM_AFFAIRS,
      );
    },

    fetchHideButtonData() {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.FETCH_HIDE_BUTTON_DATA,
      );
    },

    toggleHideButtonData() {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.TOGGLE_HIDE_BUTTON_DATA,
      );
    },

    selectImageForImageWidget() {
      return ipcRenderer.invoke('select-image-for-image-widget');
    },

    getImagesForImageWidget() {
      return ipcRenderer.invoke('get-images-for-image-widget');
    },

    deteleImageForImageWidget(index: number) {
      return ipcRenderer.invoke('delet-image-for-image-widget', index);
    },

    moveLongTermAffair(
      id: string,
      moveFrom: 'TODO' | 'DONE',
      moveTo: 'TODO' | 'DONE',
    ) {
      return ipcRenderer.invoke(
        LONG_TERM_AFFAIRS_SIGNALS.MOVE_LONG_TERM_AFFAIR,
        id,
        moveFrom,
        moveTo,
      );
    },

    addScheduleTodo(date: ScheduleDateType, todo: ScheduleTodoType) {
      return ipcRenderer.invoke(SCHEDULE_SIGNALS.ADD_SCHEDULE_DATE, date, todo);
    },

    deleteScheduleTodo(date: ScheduleDateType, id: string) {
      return ipcRenderer.invoke(
        SCHEDULE_SIGNALS.DELETE_SCHEDULE_DATE,
        date,
        id,
      );
    },

    changeScheduleTodo(
      date: ScheduleDateType,
      id: string,
      options: { name?: string; description?: string },
    ) {
      return ipcRenderer.invoke(
        SCHEDULE_SIGNALS.CHANGE_SCHEDULE_DATE,
        date,
        id,
        options,
      );
    },

    getScheduleTodos(date: ScheduleDateType) {
      return ipcRenderer.invoke(SCHEDULE_SIGNALS.GET_SCHEDULE_DATES, date);
    },

    openCalendarDay(day: number, month: number, year: number) {
      return ipcRenderer.invoke(
        SCHEDULE_SIGNALS.OPEN_CALENDAR_DAY,
        day,
        month,
        year,
      );
    },

    setAutoStartWidget(state: boolean) {
      ipcRenderer.send(IPC_SIGNALS.SET_WIDGET_AUTO_START, state);
    },

    setImageWidget(state: boolean) {
      ipcRenderer.send(IPC_SIGNALS.SET_IMAGE_WIDGET, state);
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
