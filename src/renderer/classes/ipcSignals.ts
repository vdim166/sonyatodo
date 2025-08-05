import { DatabaseType } from '../../main/classes/Database';

export type saveTodoType = {
  name: string;
  desc: string;
  id: string;

  tabs: string[];
  currentTab: string;
};

class IpcSignals {
  saveData = async (data: saveTodoType, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.saveData(data);
    return result[projectName];
  };

  loadData = async (projectName = 'main') => {
    const data = await window.electron.ipcRenderer.loadData();

    return data[projectName];
  };

  deleteData = async (id: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.deleteData(id);
    return result[projectName];
  };

  moveTo = async (id: string, newTab: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.moveTo(id, newTab);
    return result[projectName];
  };
}

export const ipcSignals = new IpcSignals();
