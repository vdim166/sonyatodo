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

  deleteData = async (id: string) => {
    try {
      const result: saveTodoType[] =
        await window.electron.ipcRenderer.deleteData(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}

export const ipcSignals = new IpcSignals();
