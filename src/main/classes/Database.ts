import { saveTodoType } from '../../renderer/classes/ipcSignals';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';

// TODO: maybe use async functions later

export type DatabaseType = {
  [key: string]: { todos: saveTodoType[]; tabs: string[] };
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
        prevData[projectName] = { todos: [data], tabs: ['TODO', 'DONE'] };
        fs.writeFileSync(this.filePath, JSON.stringify(prevData), 'utf-8');
      } else {
        prevData[projectName].todos.unshift(data);

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
      const newData = data[projectName].todos.filter((item) => item.id !== id);

      data[projectName].todos = newData;
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return data;
    } catch (error) {
      console.log('error', error);

      return {};
    }
  };

  moveTo = (id: string, tab: string, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const index = data[projectName].todos.findIndex((item) => item.id === id);

      if (index !== -1) {
        data[projectName].todos[index].currentTab = tab;
      }

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);

      return {};
    }
  };

  checkForDataFile = () => {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify({ main: {} }), 'utf-8');
      } else {
        const data = fs.readFileSync(this.filePath, 'utf-8');

        if (data.trim() === '') {
          fs.writeFileSync(
            this.filePath,
            JSON.stringify({ main: { todos: [], tabs: ['TODO', 'DONE'] } }),
            'utf-8',
          );

          return;
        }

        const parsedData = JSON.parse(data);

        if (!parsedData['main']) {
          fs.writeFileSync(
            this.filePath,
            JSON.stringify({
              main: { todos: [], tabs: ['TODO', 'DONE'] },
              ...parsedData,
            }),
            'utf-8',
          );
        }
      }
    } catch (err) {
      console.error('Ошибка при проверке файла:', err);
    }
  };

  addTab = (name: string, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      data[projectName].tabs.unshift(name);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  deleteTabs = (tabs: string[], projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const newData = data[projectName].tabs.filter(
        (todoName) => !tabs.includes(todoName),
      );

      data[projectName].tabs = newData;

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  changeTabsOrder = (tabs: string[], projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();
      data[projectName].tabs = tabs;
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  changeTab = (tab: saveTodoType, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const findIndex = data[projectName].todos.findIndex(
        (todo) => todo.id === tab.id,
      );

      if (findIndex !== -1) {
        if (data[projectName].todos[findIndex].name !== tab.name) {
          data[projectName].todos[findIndex].name = tab.name;
        }

        if (data[projectName].todos[findIndex].desc !== tab.desc) {
          data[projectName].todos[findIndex].desc = tab.desc;
        }

        fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
      }

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  fetchProjects = () => {
    try {
      const data = this.loadDataFromFile();
      return Object.keys(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  addProject = (name: string) => {
    try {
      const data = this.loadDataFromFile();

      data[name] = { todos: [], tabs: ['TODO', 'DONE'] };

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return Object.keys(this.loadDataFromFile());
    } catch (error) {
      console.log('error', error);
    }
  };

  deleteProject = (name: string) => {
    try {
      const data = this.loadDataFromFile();
      const newData: DatabaseType = {};
      const keys = Object.keys(data);

      for (let i = 0; i < keys.length; ++i) {
        if (name !== keys[i]) {
          newData[keys[i]] = data[keys[i]];
        }
      }

      fs.writeFileSync(this.filePath, JSON.stringify(newData), 'utf-8');
      return Object.keys(this.loadDataFromFile());
    } catch (error) {
      console.log('error', error);
    }
  };
}

export const database = new Database();
