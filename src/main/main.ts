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
import { IPC_SIGNALS } from './consts';
import { database } from './classes/Database';
import fs from 'fs';
import { WidgetSettingsType } from './preload';
import { addTodoImageType } from './types/addTodoImageType';

const savedImagesPath = path.join(process.cwd(), 'saved_images');

let tray: Tray | null = null;

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

let mainWindow: BrowserWindow | null = null;

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
  (_event, { name, data, id, topic }: addTodoImageType) => {
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
  (_event, id, topic, project, index) => {
    return database.deleteLinkFromTodo(id, topic, project, index);
  },
);

ipcMain.handle(IPC_SIGNALS.LOAD_TODO_IMAGE, async (_event, filename) => {
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
  const filePath = path.join(userDataPath, 'widget-settings.json');

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

ipcMain.on(IPC_SIGNALS.SET_WIDGET_AUTO_START, (_event, autoStart) => {
  console.log('autoStart', autoStart);

  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'widget-settings.json');
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

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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
    height: 900,
    icon: getAssetPath('icon.png'),
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

    tray.setToolTip('Моё Electron-приложение');
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

let widgetWindow: BrowserWindow | null = null;

let dragStartPosition: {
  mouseX: number;
  mouseY: number;
  winX: number;
  winY: number;
} | null = null;

function createWidgetWindow() {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'widget-settings.json');

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

  // widgetWindow.loadFile(
  //   path.join(__dirname, '..', '..', 'html', 'widget.html'),
  // );
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
      const filePath = path.join(userDataPath, 'widget-settings.json');

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
