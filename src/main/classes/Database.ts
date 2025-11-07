import { saveTodoType } from '../../renderer/classes/ipcSignals';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';
import { TabType } from '../../renderer/contexts/AppContext';
import { DatabaseType } from '../types/DatabaseType';
import { setDeadlineType } from '../types/setDeadlineType';
import { candidateLinkType } from '../../renderer/components/AddLinksToTodo';

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

      const findTopicIndex = prevData[projectName].allTopics.findIndex(
        (topic) => topic.name === data.currentTopic,
      );

      if (findTopicIndex !== -1) {
        prevData[projectName].allTopics[findTopicIndex].todos.unshift(data);
        fs.writeFileSync(this.filePath, JSON.stringify(prevData), 'utf-8');
      }
      const newData = this.loadDataFromFile();
      return { database: newData, data };
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

      if (todoIndex === -1) return {};

      const secondTopicIndex = data[projectName].allTopics.findIndex(
        (topic) => topic.name === tab,
      );

      if (secondTopicIndex === -1) return {};

      data[projectName].allTopics[findTopicIndex].todos[
        todoIndex
      ].currentTopic = tab;

      data[projectName].allTopics[secondTopicIndex].todos.unshift(
        data[projectName].allTopics[findTopicIndex].todos[todoIndex],
      );

      data[projectName].allTopics[findTopicIndex].todos = data[
        projectName
      ].allTopics[findTopicIndex].todos.filter((todo) => todo.id !== id);

      if (data[projectName].allTopics[secondTopicIndex].todos[0].linkedTo) {
        for (
          let i = 0;
          i <
          data[projectName].allTopics[secondTopicIndex].todos[0].linkedTo
            .length;
          ++i
        ) {
          const tempObj =
            data[projectName].allTopics[secondTopicIndex].todos[0].linkedTo[i];

          const tempTopicIndex = data[tempObj.projectName].allTopics.findIndex(
            (t) => t.name === tempObj.todo.currentTopic,
          );

          if (tempTopicIndex !== -1) {
            const tempTodoIndex = data[tempObj.projectName].allTopics[
              tempTopicIndex
            ].todos.findIndex((t) => t.id === tempObj.todo.id);

            if (tempTodoIndex !== -1) {
              const linksTempIndex = data[tempObj.projectName].allTopics[
                tempTopicIndex
              ].todos[tempTodoIndex].links?.findIndex(
                (t) =>
                  t.todo.id ===
                  data[projectName].allTopics[secondTopicIndex].todos[0].id,
              );

              if (linksTempIndex !== undefined && linksTempIndex !== -1) {
                data[tempObj.projectName].allTopics[tempTopicIndex].todos[
                  tempTodoIndex
                ].links![linksTempIndex].todo.currentTopic = tab;
              }
            }
          }
        }
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
        (topic) => topic.name === todoToChange.currentTopic,
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

      if (todoToChange.images) {
        data[projectName].allTopics[findTodoIndex].todos[findTodoIndex].images =
          todoToChange.images;
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

  setTodoDeadLine = (options: setDeadlineType, projectName: string) => {
    try {
      const data = this.loadDataFromFile();

      const topicName = data[projectName].allTopics.findIndex(
        (t) => t.name === options.topic,
      );

      if (topicName === -1) return {};

      const todoIndex = data[projectName].allTopics[topicName].todos.findIndex(
        (t) => t.id === options.id,
      );

      console.log('todoIndex', todoIndex);

      if (todoIndex === -1) return {};

      data[projectName].allTopics[topicName].todos[todoIndex].deadline = {
        to: options.to,
        from: options.from,
      };

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
      return this.loadDataFromFile();
    } catch (error) {
      console.log('error', error);
      return {};
    }
  };

  findTodosByPattern = (pattern: string) => {
    const data = this.loadDataFromFile();

    const result = [];

    const projects = Object.keys(data);

    for (let i = 0; i < projects.length; ++i) {
      const projectName = projects[i];

      for (let j = 0; j < data[projectName].allTopics.length; ++j) {
        const topicName = data[projectName].allTopics[j].name;

        for (let k = 0; k < data[projectName].allTopics[j].todos.length; ++k) {
          const todoName = data[projectName].allTopics[j].todos[k].name;

          if (todoName.startsWith(pattern)) {
            result.push({
              projectName,
              topicName,
              todo: data[projectName].allTopics[j].todos[k],
            });
          }
        }
      }
    }

    return result;
  };

  addLinkToTodo = async (
    id: string,
    topic: string,
    project: string,
    link: candidateLinkType,
  ) => {
    const data = this.loadDataFromFile();

    const findTopicIndex = data[project].allTopics.findIndex(
      (t) => t.name === topic,
    );

    if (findTopicIndex === -1) return;

    const findTodoIndex = data[project].allTopics[
      findTopicIndex
    ].todos.findIndex((t) => t.id === id);

    if (findTodoIndex === -1) return;

    const obj = {
      projectName: link.projectName,
      todo: {
        id: link.todo.id,
        currentTopic: link.todo.currentTopic,
      },
    } as candidateLinkType;

    if (
      data[link.projectName].allTopics[findTopicIndex].todos[findTodoIndex]
        .links
    ) {
      data[link.projectName].allTopics[findTopicIndex].todos[
        findTodoIndex
      ].links?.push(obj);
    } else {
      data[link.projectName].allTopics[findTopicIndex].todos[
        findTodoIndex
      ].links = [obj];
    }

    /// link section

    const linkTopicIndex = data[link.projectName].allTopics.findIndex(
      (t) => t.name === link.todo.currentTopic,
    );

    if (linkTopicIndex === -1) return null;

    const linkTodoIndex = data[link.projectName].allTopics[
      linkTopicIndex
    ].todos.findIndex((t) => t.id === link.todo.id);

    if (linkTodoIndex === -1) return null;

    const linkObj = {
      projectName: project,
      todo: {
        id: id,
        currentTopic: topic,
      },
    } as candidateLinkType;
    if (
      data[link.projectName].allTopics[linkTopicIndex].todos[linkTodoIndex]
        .linkedTo
    ) {
      data[link.projectName].allTopics[linkTopicIndex].todos[
        linkTodoIndex
      ].linkedTo?.push(linkObj);
    } else {
      data[link.projectName].allTopics[linkTopicIndex].todos[
        linkTodoIndex
      ].linkedTo = [linkObj];
    }

    ////

    fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

    return;
  };

  getTodoById = async (id: string, topic: string, project: string) => {
    const data = this.loadDataFromFile();

    const findTopicIndex = data[project].allTopics.findIndex(
      (t) => t.name === topic,
    );

    if (findTopicIndex === -1) return null;

    const findTodoIndex = data[project].allTopics[
      findTopicIndex
    ].todos.findIndex((t) => t.id === id);

    if (findTodoIndex === -1) return null;

    return data[project].allTopics[findTopicIndex].todos[findTodoIndex];
  };

  deleteLinkFromTodo = async (
    id: string,
    topic: string,
    project: string,
    index: number,
  ) => {
    const data = this.loadDataFromFile();

    const findTopicIndex = data[project].allTopics.findIndex(
      (t) => t.name === topic,
    );

    if (findTopicIndex === -1) return null;

    const findTodoIndex = data[project].allTopics[
      findTopicIndex
    ].todos.findIndex((t) => t.id === id);

    if (findTodoIndex === -1) return null;

    if (data[project].allTopics[findTopicIndex].todos[findTodoIndex].links) {
      const tempObj =
        data[project].allTopics[findTopicIndex].todos[findTodoIndex].links[
          index
        ];

      const tempTopicIndex = data[tempObj.projectName].allTopics.findIndex(
        (t) => t.name === tempObj.todo.currentTopic,
      );

      if (tempTopicIndex === -1) return;

      const tempTodoIndex = data[tempObj.projectName].allTopics[
        tempTopicIndex
      ].todos.findIndex((t) => t.id === tempObj.todo.id);

      if (tempTodoIndex === -1) return;

      if (
        data[tempObj.projectName].allTopics[tempTopicIndex].todos[tempTodoIndex]
          .linkedTo
      ) {
        data[tempObj.projectName].allTopics[tempTopicIndex].todos[
          tempTodoIndex
        ].linkedTo = data[tempObj.projectName].allTopics[tempTopicIndex].todos[
          tempTodoIndex
        ].linkedTo?.filter(
          (t) =>
            t.todo.id !==
            data[project].allTopics[findTopicIndex].todos[findTodoIndex].id,
        );
      }

      data[project].allTopics[findTopicIndex].todos[findTodoIndex].links.splice(
        index,
        1,
      );
    }

    fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
  };
}

export const database = new Database();
