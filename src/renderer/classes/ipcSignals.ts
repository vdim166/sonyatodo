export type saveTodoType = {
  name: string;
  desc: string;
  id: string;
};

class IpcSignals {
  saveData = async (data: saveTodoType) => {
    const result: saveTodoType[] =
      await window.electron.ipcRenderer.saveData(data);
    return result;
  };

  loadData = async () => {
    const data: saveTodoType[] = await window.electron.ipcRenderer.loadData();
    return data;
  };
}

export const ipcSignals = new IpcSignals();
