import { ImportantDateType } from '../../main/classes/ImportantDatesDatabase';

class ImportantDatesApi {
  addImportantDate = async (importantDate: ImportantDateType) => {
    const data =
      await window.electron.ipcRenderer.addImportantDate(importantDate);
    return data;
  };

  deleteImportantDate = async (id: string) => {
    const data = await window.electron.ipcRenderer.deleteImportantDate(id);
    return data;
  };

  changeImportantDate = async (
    id: string,
    importantDate: ImportantDateType,
  ) => {
    const data = await window.electron.ipcRenderer.changeImportantDate(
      id,
      importantDate,
    );
    return data;
  };

  getImportantDates = async () => {
    const data = await window.electron.ipcRenderer.getAllImportantDates();
    return data;
  };

  updateWidgetTodos = () => {
    window.electron.ipcRenderer.updateImportantDatesData();
  };
}

export const importantDatesApi = new ImportantDatesApi();
