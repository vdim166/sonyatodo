import { LongTermAffairsDTO } from '../../main/classes/LongTermAffairsDatabase';

class LongTermAffairsApi {
  addLongTermAffair = async (longTermAffair: LongTermAffairsDTO) => {
    const data =
      await window.electron.ipcRenderer.addLongTermAffair(longTermAffair);
    return data;
  };

  deleteLongTermAffair = async (id: string, state: 'TODO' | 'DONE') => {
    const data = await window.electron.ipcRenderer.deleteLongTermAffair(
      id,
      state,
    );
    return data;
  };

  changeLongTermAffair = async (
    id: string,
    state: 'TODO' | 'DONE',
    newData: LongTermAffairsDTO,
  ) => {
    const data = await window.electron.ipcRenderer.changeLongTermAffair(
      id,
      state,
      newData,
    );
    return data;
  };

  getAllLongTermAffairs = async () => {
    const data = await window.electron.ipcRenderer.getAllLongTermAffairs();
    return data;
  };

  moveLongTermAffair = async (
    id: string,
    moveFrom: 'TODO' | 'DONE',
    moveTo: 'TODO' | 'DONE',
  ) => {
    const data = await window.electron.ipcRenderer.moveLongTermAffair(
      id,
      moveFrom,
      moveTo,
    );
    return data;
  };

  updateWidgetData = () => {
    window.electron.ipcRenderer.updateLongTermAffairsTodoWidget();
  };
}

export const longTermAffairsApi = new LongTermAffairsApi();
