import { saveTodoType } from '../../renderer/classes/ipcSignals';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';

// TODO: maybe use async functions later

export type DatabaseType = {
  [key: string]: saveTodoType[];
};

class Database {
  private userDataPath = app.getPath('userData');
  private filePath = path.join(this.userDataPath, 'data.json');

  loadDataFromFile(): DatabaseType {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
      }
      return {};
    } catch (err) {
      console.error('Ошибка при чтении файла:', err);
      return {};
    }
  }

  saveDataToFile = (data: saveTodoType, projectName = 'main') => {
    try {
      const prevData = this.loadDataFromFile();
      const id = generateRandomId();

      data.id = id;

      if (!prevData[projectName]) {
        fs.writeFileSync(
          this.filePath,
          JSON.stringify({ [projectName]: [data], ...prevData }),
          'utf-8',
        );
      } else {
        const newProject = [data, ...prevData[projectName]];

        console.log('data', data);

        console.log('newProject', newProject);

        prevData[projectName] = newProject;

        console.log('prevData', prevData);

        fs.writeFileSync(this.filePath, JSON.stringify(prevData), 'utf-8');
      }

      const newData = this.loadDataFromFile();

      return newData;
    } catch (err) {
      console.error('Ошибка при сохранении файла:', err);

      return {};
    }
  };

  deleteDataFromFile = (id: string, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();
      const newData = data[projectName].filter((item) => item.id !== id);

      data[projectName] = newData;
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return data;
    } catch (error) {
      console.log('error', error);

      return {};
    }
  };

  doneJob = (id: string, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const newProject = data[projectName].map((item) => {
        if (item.id === id) {
          return {
            ...item,
            done: true,
          };
        }

        return item;
      });

      data[projectName] = newProject;
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);

      return {};
    }
  };
}

export const database = new Database();
