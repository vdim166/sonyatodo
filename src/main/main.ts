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
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { IPC_SIGNALS } from './consts';
import { database } from './classes/Database';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle(IPC_SIGNALS.SAVE_DATA_BASE, (event, data, projectName) => {
  return database.saveDataToFile(data, projectName);
});

ipcMain.handle(IPC_SIGNALS.LOAD_DATA_BASE, () => {
  return database.loadDataFromFile();
});

ipcMain.handle(IPC_SIGNALS.DELETE_DATA, (event, id, projectName) => {
  return database.deleteDataFromFile(id, projectName);
});

ipcMain.handle(IPC_SIGNALS.MOVE_TO, (event, id, newTab, projectName) => {
  return database.moveTo(id, newTab, projectName);
});

ipcMain.handle(IPC_SIGNALS.ADD_TAB, (event, name, projectName) => {
  return database.addTab(name, projectName);
});

ipcMain.handle(IPC_SIGNALS.DELETE_TABS, (event, tabs, projectName) => {
  return database.deleteTabs(tabs, projectName);
});

ipcMain.handle(IPC_SIGNALS.CHANGE_TABS_ORDER, (event, tabs, projectName) => {
  return database.changeTabsOrder(tabs, projectName);
});

ipcMain.handle(IPC_SIGNALS.CHANGE_TAB, (event, todo, projectName) => {
  return database.changeTab(todo, projectName);
});

ipcMain.handle(IPC_SIGNALS.FETCH_PROJECTS, (_event) => {
  return database.fetchProjects();
});

ipcMain.handle(IPC_SIGNALS.ADD_PROJECT, (event, name) => {
  return database.addProject(name);
});

ipcMain.handle(IPC_SIGNALS.DELETE_PROJECT, (event, name) => {
  return database.deleteProject(name);
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

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

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
    createWindow();

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
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  widgetWindow.loadFile(
    path.join(__dirname, '..', '..', 'html', 'widget.html'),
  );

  widgetWindow.once('ready-to-show', () => {
    if (widgetWindow) widgetWindow.show();
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
ipcMain.on('drag-end', () => {
  dragStartPosition = null;
});
