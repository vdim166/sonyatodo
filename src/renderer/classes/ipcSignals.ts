import { DatabaseType } from '../../main/classes/Database';

export type saveTodoType = {
  name: string;
  desc: string;
  id: string;
  done: boolean;
};

class IpcSignals {
  saveData = async (data: saveTodoType, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.saveData(data);
    return result[projectName];
  };

  loadData = async (projectName = 'main') => {
    const data = await window.electron.ipcRenderer.loadData();

    if (!data[projectName]) return [];
    return data[projectName];
  };

  deleteData = async (id: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.deleteData(id);
    return result[projectName];
  };

  doneJob = async (id: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.doneJob(id);
    return result[projectName];
  };
}

export const ipcSignals = new IpcSignals();
