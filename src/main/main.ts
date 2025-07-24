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
import fs from 'fs';
import { IPC_SIGNALS } from './consts';
import { generateRandomId } from './utils/generateRandomId';
import { saveTodoType } from '../renderer/classes/ipcSignals';

const userDataPath = app.getPath('userData');
const filePath = path.join(userDataPath, 'data.json');

console.log('userDataPath', userDataPath);

// TODO: maybe use async functions later

function saveDataToFile(data: saveTodoType) {
  try {
    const prevData = loadDataFromFile();
    const id = generateRandomId();

    data.id = id;

    fs.writeFileSync(filePath, JSON.stringify([data, ...prevData]), 'utf-8');
    console.log('Данные успешно сохранены!');

    const newData = loadDataFromFile();

    return newData;
  } catch (err) {
    console.error('Ошибка при сохранении файла:', err);
  }
}

function loadDataFromFile() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as saveTodoType[];
    }
    return []; // или вернуть данные по умолчанию
  } catch (err) {
    console.error('Ошибка при чтении файла:', err);
    return [];
  }
}

function deleteDataFromFile(id: string) {
  try {
    const data = loadDataFromFile();
    const newData = data.filter((item) => item.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(newData), 'utf-8');
    console.log('Данные успешно удалены!');

    return newData;
  } catch (error) {
    console.log('error', error);
  }
}

ipcMain.handle(IPC_SIGNALS.SAVE_DATA_BASE, (event, data) => {
  return saveDataToFile(data);
});

ipcMain.handle(IPC_SIGNALS.LOAD_DATA_BASE, () => {
  return loadDataFromFile();
});

ipcMain.handle(IPC_SIGNALS.DELETE_DATA, (event, id) => {
  return deleteDataFromFile(id);
});

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
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
    width: 1024,
    height: 728,
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
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
