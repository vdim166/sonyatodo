import { saveTodoType } from '../../renderer/classes/ipcSignals';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';
import { TabType } from '../../renderer/contexts/AppContext';
import { DatabaseType } from '../types/DatabaseType';

// TODO: maybe use async functions later

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
        prevData[projectName] = {
          allTopics: [
            {
              name: 'TODO',
              todos: [data],
            },
          ],
          tabs: [{ name: 'TODO' }, { name: 'DONE' }],
        };
        fs.writeFileSync(this.filePath, JSON.stringify(prevData), 'utf-8');
      } else {
        const findTopicIndex = prevData[projectName].allTopics.findIndex(
          (topic) => topic.name === 'TODO',
        );

        if (findTopicIndex !== -1) {
          prevData[projectName].allTopics[findTopicIndex].todos.unshift(data);
          fs.writeFileSync(this.filePath, JSON.stringify(prevData), 'utf-8');
        }
      }
      const newData = this.loadDataFromFile();
      return newData;
    } catch (err) {
      console.error('Ошибка при сохранении файла:', err);
      return {};
    }
  };

  deleteDataFromFile = (
    id: string,
    currentTab: string,
    projectName = 'main',
  ) => {
    try {
      const data = this.loadDataFromFile();

      const findTopicIndex = data[projectName].allTopics.findIndex(
        (topic) => topic.name === currentTab,
      );

      if (findTopicIndex === -1) return {};

      const newData = data[projectName].allTopics[findTopicIndex].todos.filter(
        (item) => item.id !== id,
      );
      data[projectName].allTopics[findTopicIndex].todos = newData;
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
      return data;
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  moveTo = (
    id: string,
    tab: string,
    currentTab: string,
    projectName = 'main',
  ) => {
    try {
      const data = this.loadDataFromFile();

      const findTopicIndex = data[projectName].allTopics.findIndex(
        (topic) => topic.name === currentTab,
      );

      if (findTopicIndex === -1) return {};

      const todoIndex = data[projectName].allTopics[
        findTopicIndex
      ].todos.findIndex((todo) => todo.id === id);

      if (todoIndex !== -1) {
        const secondTopicIndex = data[projectName].allTopics.findIndex(
          (topic) => topic.name === tab,
        );

        if (secondTopicIndex === -1) return {};

        data[projectName].allTopics[secondTopicIndex].todos.unshift(
          data[projectName].allTopics[findTopicIndex].todos[todoIndex],
        );

        data[projectName].allTopics[findTopicIndex].todos = data[
          projectName
        ].allTopics[findTopicIndex].todos.filter((todo) => todo.id !== id);
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

      data[projectName].tabs.unshift({ name });

      data[projectName].allTopics = [
        ...data[projectName].allTopics,
        { name, todos: [] },
      ];

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  deleteTabs = (tabs: TabType[], projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const newData = data[projectName].tabs.filter((tab) => {
        const found = tabs.find((t) => t.name === tab.name);

        return !found;
      });

      data[projectName].tabs = newData;

      data[projectName].allTopics = data[projectName].allTopics.filter(
        (topic) => {
          const found = tabs.find((t) => t.name === topic.name);

          return !found;
        },
      );

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  changeTabsOrder = (tabs: TabType[], projectName = 'main') => {
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

  changeTodo = (todoToChange: saveTodoType, projectName = 'main') => {
    try {
      const data = this.loadDataFromFile();

      const findTopicIndex = data[projectName].allTopics.findIndex(
        (topic) => topic.name === todoToChange.currentTab,
      );

      if (findTopicIndex === -1) return {};

      const findTodoIndex = data[projectName].allTopics[
        findTopicIndex
      ].todos.findIndex((todo) => todo.id === todoToChange.id);

      if (findTodoIndex === -1) return {};

      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .name !== todoToChange.name
      ) {
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].name =
          todoToChange.name;
      }

      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .desc !== todoToChange.desc
      ) {
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc =
          todoToChange.desc;
      }

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

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

      data[name] = {
        allTopics: [
          {
            name: 'TODO',
            todos: [],
          },
          {
            name: 'DONE',
            todos: [],
          },
        ],
        tabs: [{ name: 'TODO' }, { name: 'DONE' }],
      };

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
