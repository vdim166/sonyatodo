import {
  ScheduleDateType,
  ScheduleTodoType,
} from '../../main/classes/ScheduleDatabase';

class ScheduleDatesApi {
  addScheduleTodo = async (date: ScheduleDateType, todo: ScheduleTodoType) => {
    return await window.electron.ipcRenderer.addScheduleTodo(date, todo);
  };

  deleteScheduleTodo = async (date: ScheduleDateType, id: string) => {
    return await window.electron.ipcRenderer.deleteScheduleTodo(date, id);
  };

  changeScheduleTodo = async (
    date: ScheduleDateType,
    id: string,
    options: { name?: string; description?: string },
  ) => {
    return await window.electron.ipcRenderer.changeScheduleTodo(
      date,
      id,
      options,
    );
  };

  getScheduleTodos = async (date: ScheduleDateType) => {
    const data = await window.electron.ipcRenderer.getScheduleTodos(date);
    return data;
  };

  updateWidget = () => {
    window.electron.ipcRenderer.updateCalendarWidget();
  };
}

export const scheduleDatesApi = new ScheduleDatesApi();
