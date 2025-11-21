/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  IMPORTANT_DATES_SIGNALS,
  IPC_SIGNALS,
  LONG_TERM_AFFAIRS_SIGNALS,
  SCHEDULE_SIGNALS,
} from './consts';
import { database } from './classes/Database';
import fs from 'fs';
import { WidgetSettingsType } from './preload';
import { addTodoImageType } from './types/addTodoImageType';
import { importantDatesDatabase } from './classes/ImportantDatesDatabase';
import { longTermAffairsDatabase } from './classes/LongTermAffairsDatabase';
import { scheduleDatabase } from './classes/ScheduleDatabase';

const userDataPath = app.getPath('userData');

export const savedImagesPath = path.join(
  userDataPath,
  'sonyaTodo',
  'saved_images',
);

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let widgetWindow: BrowserWindow | null = null;
let longTermAffairsWidgetWindow: BrowserWindow | null = null;
let calendarWidgetWindow: BrowserWindow | null = null;

let dragStartPosition: {
  mouseX: number;
  mouseY: number;
  winX: number;
  winY: number;
} | null = null;

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function enableAutoLaunch() {
  if (process.env.NODE_ENV === 'production') {
    app.setLoginItemSettings({
      openAtLogin: true, // запускать при входе
      path: app.getPath('exe'), // путь к exe (на win/mac корректно работает)
      args: ['--hidden'],
    });
  }
}

// Проверить статус
function isAutoLaunchEnabled() {
  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
}

// Отключить автозагрузку
function disableAutoLaunch() {
  app.setLoginItemSettings({
    openAtLogin: false,
    path: app.getPath('exe'),
  });
}

ipcMain.handle(IPC_SIGNALS.SAVE_DATA_BASE, (_event, data, projectName) => {
  return database.saveDataToFile(data, projectName);
});

ipcMain.handle(IPC_SIGNALS.LOAD_DATA_BASE, () => {
  return database.loadDataFromFile();
});

ipcMain.handle(
  IPC_SIGNALS.DELETE_DATA,
  (_event, id, currentTab, projectName) => {
    return database.deleteDataFromFile(id, currentTab, projectName);
  },
);

ipcMain.handle(
  IPC_SIGNALS.MOVE_TO,
  (_event, id, newTab, currentTab, projectName) => {
    return database.moveTo(id, newTab, currentTab, projectName);
  },
);

ipcMain.handle(IPC_SIGNALS.ADD_TAB, (_event, name, projectName) => {
  return database.addTab(name, projectName);
});

ipcMain.handle(IPC_SIGNALS.DELETE_TABS, (_event, tabs, projectName) => {
  return database.deleteTabs(tabs, projectName);
});

ipcMain.handle(IPC_SIGNALS.CHANGE_TABS_ORDER, (_event, tabs, projectName) => {
  return database.changeTabsOrder(tabs, projectName);
});

ipcMain.handle(IPC_SIGNALS.CHANGE_TODO, (_event, todo, projectName) => {
  return database.changeTodo(todo, projectName);
});

ipcMain.handle(IPC_SIGNALS.FETCH_PROJECTS, (_event) => {
  return database.fetchProjects();
});

ipcMain.handle(IPC_SIGNALS.ADD_PROJECT, (_event, name) => {
  return database.addProject(name);
});

ipcMain.handle(IPC_SIGNALS.DELETE_PROJECT, (_event, name) => {
  return database.deleteProject(name);
});

ipcMain.handle(
  IPC_SIGNALS.SET_TODO_DEADLINE,
  (_event, options, projectName) => {
    return database.setTodoDeadLine(options, projectName);
  },
);

ipcMain.handle(IPC_SIGNALS.FIND_TODO_BY_PATTERN, (_event, pattern) => {
  return database.findTodosByPattern(pattern);
});

ipcMain.handle(
  IPC_SIGNALS.ADD_LINK_TO_TODO,
  (_event, id, topic, project, link) => {
    return database.addLinkToTodo(id, topic, project, link);
  },
);
ipcMain.handle(IPC_SIGNALS.GET_TODO_BY_ID, (_event, id, topic, project) => {
  return database.getTodoById(id, topic, project);
});

ipcMain.handle(
  IPC_SIGNALS.SAVE_TODO_IMAGE,
  (_event, { name, data, id }: addTodoImageType) => {
    if (!fs.existsSync(path.join(userDataPath, 'sonyaTodo'))) {
      fs.mkdirSync(path.join(userDataPath, 'sonyaTodo'), {
        recursive: true,
      });
    }

    const savePath = path.join(savedImagesPath, `${id}-${name}.jpg`);

    // убедимся, что папка существует
    fs.mkdirSync(path.dirname(savePath), { recursive: true });

    const buffer = Buffer.from(data); // Здесь Buffer доступен
    fs.writeFile(savePath, buffer, (err) => {
      if (err) console.error(err);
      else console.log('Saved:', savePath);
    });
  },
);
ipcMain.handle(
  IPC_SIGNALS.DELETE_LINK_FROM_TODO,
  (_event, id, topic, project, linkId) => {
    return database.deleteLinkFromTodo(id, topic, project, linkId);
  },
);

ipcMain.handle(IPC_SIGNALS.LOAD_TODO_IMAGE, async (_event, filename) => {
  if (!fs.existsSync(path.join(userDataPath, 'sonyaTodo'))) {
    fs.mkdirSync(path.join(userDataPath, 'sonyaTodo'), {
      recursive: true,
    });
  }

  const filePath = path.join(savedImagesPath, filename);

  try {
    const data = fs.readFileSync(filePath); // Buffer
    return data.toString('base64'); // отправляем как base64
  } catch (err) {
    console.error(err);
    return null;
  }
});

ipcMain.handle(IPC_SIGNALS.GET_WIDGET_SETTINGS, (_event) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'sonyaTodo', 'widget-settings.json');

  const status = fs.existsSync(filePath);

  if (status) {
    try {
      const oldSettings = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(oldSettings);
      return data;
    } catch (error) {
      console.error('Error reading widget settings:', error);
    }
  } else {
    const newSettings = {
      position: null,
      autoStart: false,
    };

    return newSettings;
  }
});

ipcMain.handle(IMPORTANT_DATES_SIGNALS.ADD_IMPORTANT_DATE, (_event, date) => {
  return importantDatesDatabase.addImportantDate(date);
});

ipcMain.handle(IMPORTANT_DATES_SIGNALS.DELETE_IMPORTANT_DATE, (_event, id) => {
  return importantDatesDatabase.deleteImportantDate(id);
});

ipcMain.handle(
  IMPORTANT_DATES_SIGNALS.CHANGE_IMPORTANT_DATE,
  (_event, id, newDate) => {
    return importantDatesDatabase.changeImportantDate(id, newDate);
  },
);

ipcMain.handle(IMPORTANT_DATES_SIGNALS.GET_ALL_IMPORTANT_DATES, () => {
  return importantDatesDatabase.getAllImportantDates();
});

ipcMain.on(IPC_SIGNALS.SET_WIDGET_AUTO_START, (_event, autoStart) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'sonyaTodo', 'widget-settings.json');
  try {
    const status = fs.existsSync(filePath);

    if (status) {
      const oldSettings = fs.readFileSync(filePath, 'utf-8');

      const parsed: WidgetSettingsType = JSON.parse(oldSettings);

      parsed.autoStart = autoStart;
      fs.writeFileSync(filePath, JSON.stringify(parsed), 'utf-8');
    } else {
      fs.writeFileSync(
        filePath,
        JSON.stringify({ position: null, autoStart }),
        'utf-8',
      );
    }
  } catch (error) {
    console.error('Error saving widget settings:', error);
  }
});

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.ADD_LONG_TERM_AFFAIR,
  (_event, data) => {
    return longTermAffairsDatabase.addNewTodo(data);
  },
);

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.DELETE_LONG_TERM_AFFAIR,
  (_event, id, state) => {
    return longTermAffairsDatabase.deleteTodo(id, state);
  },
);

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.CHANGE_LONG_TERM_AFFAIR,
  (_event, id, state, newTodo) => {
    return longTermAffairsDatabase.changeTodo(id, state, newTodo);
  },
);

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.GET_ALL_LONG_TERM_AFFAIRS,
  (_event) => {
    return longTermAffairsDatabase.getAllTodos();
  },
);

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.MOVE_LONG_TERM_AFFAIR,
  (_event, id: string, moveFrom, moveTo) => {
    return longTermAffairsDatabase.moveTodo(id, moveFrom, moveTo);
  },
);

ipcMain.handle(
  IMPORTANT_DATES_SIGNALS.UPDATE_IMPORTANT_DATE_TODOS_WIDGET,
  (_event) => {
    return widgetWindow?.webContents.send('update-widget-todo-data');
  },
);

ipcMain.handle(
  LONG_TERM_AFFAIRS_SIGNALS.UPDATE_LONG_TERM_AFFAIRS_TODOS_WIDGET,
  (_event) => {
    return longTermAffairsWidgetWindow?.webContents.send(
      'update-long-term-affairs-todo-data',
    );
  },
);

ipcMain.handle(SCHEDULE_SIGNALS.ADD_SCHEDULE_DATE, (_event, date, todo) => {
  const data = scheduleDatabase.addScheduleTodo(date, todo);

  calendarWidgetWindow?.webContents.send('update-calendar-todo-data');

  return data;
});

ipcMain.handle(SCHEDULE_SIGNALS.DELETE_SCHEDULE_DATE, (_event, date, id) => {
  const data = scheduleDatabase.deleteScheduleTodo(date, id);
  calendarWidgetWindow?.webContents.send('update-calendar-todo-data');

  return data;
});

ipcMain.handle(
  SCHEDULE_SIGNALS.CHANGE_SCHEDULE_DATE,
  (_event, date, id, options) => {
    const data = scheduleDatabase.changeScheduleTodo(date, id, options);

    calendarWidgetWindow?.webContents.send('update-calendar-todo-data');

    return data;
  },
);

ipcMain.handle(SCHEDULE_SIGNALS.GET_SCHEDULE_DATES, (_event, date) => {
  return scheduleDatabase.getScheduleTodos(date);
});

ipcMain.handle(SCHEDULE_SIGNALS.UPDATE_CALENDAR_TODOS_WIDGET, (_event) => {
  return calendarWidgetWindow?.webContents.send('update-calendar-todo-data');
});

ipcMain.handle(
  SCHEDULE_SIGNALS.OPEN_CALENDAR_DAY,
  async (_event, day, month, year) => {
    try {
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }

        mainWindow?.webContents.send(IPC_SIGNALS.OPEN_CALENDAR_DAY, {
          day,
          month,
          year,
        });
      } else {
        await createWindow();

        mainWindow!.webContents.on('did-finish-load', () => {
          console.log('Renderer is ready!');

          mainWindow?.webContents.send(IPC_SIGNALS.OPEN_CALENDAR_DAY_BEFORE, {
            day,
            month,
            year,
          });
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  },
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 1200,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // mainWindow.on('close', (event) => {
  //   event.preventDefault();
  //   mainWindow?.hide();
  // });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    await database.checkForDataFile();

    if (!app.commandLine.hasSwitch('hidden')) {
      createWindow();
    }

    if (!isAutoLaunchEnabled()) {
      enableAutoLaunch();
    }

    tray = new Tray(getAssetPath('icon.png'));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Открыть',
        click: () => {
          if (!mainWindow) {
            createWindow();
          } else {
            mainWindow.show();
          }
        },
      },
      {
        label: 'Выход',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setToolTip('Sonya Todo');
    tray.setContextMenu(contextMenu);

    // клик по иконке (например, чтобы сворачивать/разворачивать окно)
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    });

    createWidgetWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

function createWidgetWindow() {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'sonyaTodo', 'widget-settings.json');

  const status = fs.existsSync(filePath);

  if (!status) return;

  const oldSettings = fs.readFileSync(filePath, 'utf-8');

  const widgetSettings = JSON.parse(oldSettings);

  if (!widgetSettings.autoStart) return;

  if (widgetWindow) {
    widgetWindow.focus();
    return;
  }

  widgetWindow = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: false,
    skipTaskbar: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // enableRemoteModule: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  widgetWindow.loadFile(getAssetPath('html', 'widget.html'));

  widgetWindow.once('ready-to-show', () => {
    if (widgetWindow) {
      if (widgetSettings.position) {
        widgetWindow.setPosition(
          widgetSettings.position.x,
          widgetSettings.position.y,
        );
      }

      widgetWindow.show();
    }
  });

  widgetWindow.on('closed', () => {
    widgetWindow = null;
    dragStartPosition = null;
  });

  createLongTermAffairsWidget(widgetSettings);
  createCalendarWidget(widgetSettings);
}

function createLongTermAffairsWidget(widgetSettings: any) {
  if (!widgetSettings.autoStart) return;

  if (longTermAffairsWidgetWindow) {
    longTermAffairsWidgetWindow.focus();
    return;
  }

  longTermAffairsWidgetWindow = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: false,
    skipTaskbar: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // enableRemoteModule: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  longTermAffairsWidgetWindow.loadFile(
    getAssetPath('html', 'longTermAffairs.html'),
  );

  longTermAffairsWidgetWindow.once('ready-to-show', () => {
    if (longTermAffairsWidgetWindow) {
      if (widgetSettings.position) {
        longTermAffairsWidgetWindow.setPosition(
          widgetSettings.position.x - 300,
          widgetSettings.position.y,
        );
      }

      longTermAffairsWidgetWindow.show();
    }
  });

  longTermAffairsWidgetWindow.on('closed', () => {
    longTermAffairsWidgetWindow = null;
  });
}

function createCalendarWidget(widgetSettings: any) {
  if (!widgetSettings.autoStart) return;

  if (calendarWidgetWindow) {
    calendarWidgetWindow.focus();
    return;
  }

  calendarWidgetWindow = new BrowserWindow({
    width: 280,
    height: 250,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: false,
    skipTaskbar: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // enableRemoteModule: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  calendarWidgetWindow.loadFile(getAssetPath('html', 'calendarWidget.html'));

  calendarWidgetWindow.once('ready-to-show', () => {
    if (calendarWidgetWindow) {
      if (widgetSettings.position) {
        calendarWidgetWindow.setPosition(
          widgetSettings.position.x + 300,
          widgetSettings.position.y,
        );
      }

      calendarWidgetWindow.show();
    }
  });

  calendarWidgetWindow.on('closed', () => {
    calendarWidgetWindow = null;
  });
}

// Функция позиционирования у края экрана

// Обработчик начала перетаскивания
ipcMain.on('drag-start', (event, mousePosition) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const [winX, winY] = win.getPosition();
    dragStartPosition = {
      mouseX: mousePosition.x,
      mouseY: mousePosition.y,
      winX: winX,
      winY: winY,
    };
  }
});

// Обработчик перетаскивания - используем относительное смещение
ipcMain.on('window-drag', (event, mousePosition) => {
  if (!dragStartPosition) return;

  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    // Вычисляем смещение мыши от начальной точки
    const deltaX = mousePosition.x - dragStartPosition.mouseX;
    const deltaY = mousePosition.y - dragStartPosition.mouseY;

    // Новая позиция = начальная позиция окна + смещение мыши
    const newX = dragStartPosition.winX + deltaX;
    const newY = dragStartPosition.winY + deltaY;

    // Устанавливаем новую позицию
    win.setPosition(newX, newY);

    if (longTermAffairsWidgetWindow) {
      longTermAffairsWidgetWindow.setPosition(newX - 300, newY);
    }

    if (calendarWidgetWindow) {
      calendarWidgetWindow.setPosition(newX + 300, newY);
    }
  }
});

// Обработчик окончания перетаскивания
ipcMain.on('drag-end', (event, mousePosition) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (dragStartPosition) {
      const deltaX = mousePosition.x - dragStartPosition.mouseX;
      const deltaY = mousePosition.y - dragStartPosition.mouseY;

      const newX = dragStartPosition.winX + deltaX;
      const newY = dragStartPosition.winY + deltaY;

      // win.setPosition(newX, newY);

      const userDataPath = app.getPath('userData');
      const filePath = path.join(
        userDataPath,
        'sonyaTodo',
        'widget-settings.json',
      );

      const status = fs.existsSync(filePath);

      if (status) {
        const oldSettings = fs.readFileSync(filePath, 'utf-8');

        const parsed = JSON.parse(oldSettings);

        (parsed.position.x = newX),
          (parsed.position.y = newY),
          fs.writeFile(filePath, JSON.stringify(parsed), (error) => {
            if (error) {
              console.log('error', error);
            }
          });
      } else {
        const newData = {
          position: {
            x: newX,
            y: newY,
          },
        };

        fs.writeFile(filePath, JSON.stringify(newData), (error) => {
          if (error) {
            console.log('error', error);
          }
        });
      }
    }
  }

  dragStartPosition = null;
});
