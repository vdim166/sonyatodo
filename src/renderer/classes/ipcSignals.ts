import { TabType } from '../contexts/AppContext';

export type saveTodoType = {
  name: string;
  desc: string;
  id: string;

  tabs: { name: string; id: string }[];
  currentTab: string;
};

class IpcSignals {
  saveData = async (data: saveTodoType, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.saveData(
      data,
      projectName,
    );
    return result[projectName];
  };

  loadData = async (projectName = 'main') => {
    const data = await window.electron.ipcRenderer.loadData();

    return data[projectName];
  };

  deleteData = async (id: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.deleteData(
      id,
      projectName,
    );
    return result[projectName];
  };

  moveTo = async (id: string, newTab: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.moveTo(
      id,
      newTab,
      projectName,
    );
    return result[projectName];
  };

  addTab = async (tabName: string, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.addTab(
      tabName,
      projectName,
    );

    return result[projectName];
  };

  deleteTabs = async (tabs: TabType[], projectName = 'main') => {
    const result = await window.electron.ipcRenderer.deleteTabs(
      tabs,
      projectName,
    );

    return result[projectName].tabs;
  };

  changeTabsOrder = async (tabs: TabType[], projectName = 'main') => {
    const result = await window.electron.ipcRenderer.changeTabsOrder(
      tabs,
      projectName,
    );

    return result[projectName].tabs;
  };

  changeTab = async (tab: saveTodoType, projectName = 'main') => {
    const result = await window.electron.ipcRenderer.changeTab(
      tab,
      projectName,
    );

    return result[projectName].todos;
  };

  fetchProjects = async () => {
    const data = await window.electron.ipcRenderer.fetchProjects();
    return data;
  };

  addProject = async (name: string) => {
    const result = await window.electron.ipcRenderer.addProject(name);
    return result;
  };

  deleteProject = async (name: string) => {
    const result = await window.electron.ipcRenderer.deleteProject(name);
    return result;
  };
}

export const ipcSignals = new IpcSignals();
