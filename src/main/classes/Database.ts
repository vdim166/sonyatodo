import { saveTodoType } from '../../renderer/classes/ipcSignals';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';
import { TabType } from '../../renderer/contexts/AppContext';
import { DatabaseType } from '../types/DatabaseType';
import { setDeadlineType } from '../types/setDeadlineType';
import { candidateLinkType } from '../../renderer/components/AddLinksToTodo';
import { savedFilesPath, savedImagesPath, savedVideosPath } from '../main';
import { findImgs } from '../utils/findImgs';
import { findVideos } from '../utils/findVideos';
import { findFiles } from '../utils/findFiles';

// TODO: maybe use async functions later

class Database {
  private userDataPath = app.getPath('userData');
  private filePath = path.join(this.userDataPath, 'sonyaTodo', 'data.json');

  loadDataFromFile(): DatabaseType {
    try {
      if (!fs.existsSync(path.join(this.userDataPath, 'sonyaTodo'))) {
        fs.mkdirSync(path.join(this.userDataPath, 'sonyaTodo'), {
          recursive: true,
        });
      }

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

      data.createdAt = Date.now().toString();

      data.history = [
        {
          text: `Was created in ${data.currentTopic}`,
          date: Date.now().toString(),
        },
      ];

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

      const findTodoIndex = data[projectName].allTopics[
        findTopicIndex
      ].todos.findIndex((t) => t.id === id);

      // deleteImages
      if (findTodoIndex !== -1) {
        const t =
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex];

        if (t.desc) {
          const imgMatches = findImgs(t.desc);

          for (let i = 0; i < imgMatches.length; ++i) {
            try {
              const filePath = path.join(
                savedImagesPath,
                `${t.id}-${imgMatches[i]}.jpg`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }

          const videoMatches = findVideos(t.desc);

          for (let i = 0; i < videoMatches.length; ++i) {
            try {
              const filePath = path.join(
                savedVideosPath,
                `${t.id}-${videoMatches[i]}.mp4`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }

          const filesMatches = findFiles(t.desc);

          for (let i = 0; i < filesMatches.length; ++i) {
            try {
              const filePath = path.join(
                savedFilesPath,
                `${t.id}-${filesMatches[i]}`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }
        }

        if (t.linkedTo) {
          for (let i = 0; i < t.linkedTo.length; ++i) {
            // @ts-ignore
            const linktedTo = t.linkedTo[i];

            const findLocalTopic = data[
              linktedTo.projectName
            ].allTopics.findIndex(
              (item) => item.name === linktedTo.todo.currentTopic,
            );

            if (findLocalTopic !== -1) {
              const findLocalTodo = data[linktedTo.projectName].allTopics[
                findLocalTopic
              ].todos.findIndex((item) => item.id === linktedTo.todo.id);

              if (findLocalTodo !== -1) {
                if (
                  data[linktedTo.projectName].allTopics[findLocalTopic].todos[
                    findLocalTodo
                  ].links
                ) {
                  data[linktedTo.projectName].allTopics[findLocalTopic].todos[
                    findLocalTodo
                  ].links = data[linktedTo.projectName].allTopics[
                    findLocalTopic
                  ].todos[findLocalTodo].links?.filter(
                    (item) => item.todo.id !== id,
                  );
                }
              }
            }
          }
        }
      }

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

      if (
        data[projectName].allTopics[findTopicIndex].todos[todoIndex].history
      ) {
        data[projectName].allTopics[findTopicIndex].todos[
          todoIndex
        ].history.push({
          date: Date.now().toString(),
          text: 'Was moved to ' + tab + ' from ' + currentTab,
        });
      } else {
        data[projectName].allTopics[findTopicIndex].todos[todoIndex].history = [
          {
            date: Date.now().toString(),
            text: 'Was moved to ' + tab + ' from ' + currentTab,
          },
        ];
      }

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
          const tempObj = data[projectName].allTopics[secondTopicIndex].todos[0]
            .linkedTo[i] as candidateLinkType;

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
        if (!fs.existsSync(path.join(this.userDataPath, 'sonyaTodo'))) {
          fs.mkdirSync(path.join(this.userDataPath, 'sonyaTodo'), {
            recursive: true,
          });
        }

        fs.writeFileSync(
          this.filePath,
          JSON.stringify({
            main: {
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
              tabs: ['TODO', 'DONE'],
            },
          }),
          'utf-8',
        );
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
        if (
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
            .history
        ) {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history.push({
            text: `Name was changed to ${todoToChange.name} from ${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].name}`,
            date: Date.now().toString(),
          });
        } else {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history = [
            {
              text: `Name was changed to ${todoToChange.name} from ${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].name}`,
              date: Date.now().toString(),
            },
          ];
        }

        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].name =
          todoToChange.name;
      }

      // images
      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .desc !== todoToChange.desc
      ) {
        // delete images

        const matches = findImgs(
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc,
        );

        const newMatches = findImgs(todoToChange.desc);

        for (let i = 0; i < matches.length; ++i) {
          const status = newMatches.includes(matches[i]);

          if (!status) {
            try {
              const filePath = path.join(
                savedImagesPath,
                `${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].id}-${matches[i]}.jpg`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      }

      // videos
      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .desc !== todoToChange.desc
      ) {
        const matches = findVideos(
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc,
        );

        const newMatches = findVideos(todoToChange.desc);
        for (let i = 0; i < matches.length; ++i) {
          const status = newMatches.includes(matches[i]);

          if (!status) {
            try {
              const filePath = path.join(
                savedVideosPath,
                `${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].id}-${matches[i]}.mp4`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      }

      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .desc !== todoToChange.desc
      ) {
        const matches = findFiles(
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc,
        );

        const newMatches = findFiles(todoToChange.desc);
        for (let i = 0; i < matches.length; ++i) {
          const status = newMatches.includes(matches[i]);

          if (!status) {
            try {
              const filePath = path.join(
                savedFilesPath,
                `${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].id}-${matches[i]}`,
              );

              fs.unlinkSync(filePath);
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      }

      if (todoToChange.images) {
        data[projectName].allTopics[findTodoIndex].todos[findTodoIndex].images =
          todoToChange.images;
      }

      if (
        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
          .desc !== todoToChange.desc
      ) {
        if (
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
            .history
        ) {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history.push({
            text: `Desc was changed to ${todoToChange.desc} from ${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc}`,
            date: Date.now().toString(),
          });
        } else {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history = [
            {
              text: `Desc was changed to ${todoToChange.desc} from ${data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc}`,
              date: Date.now().toString(),
            },
          ];
        }

        data[projectName].allTopics[findTopicIndex].todos[findTodoIndex].desc =
          todoToChange.desc;
      }

      if (todoToChange.hidden !== undefined) {
        if (
          data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
            .history
        ) {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history.push({
            date: Date.now().toString(),
            text: `Hidden was changed to ${todoToChange.hidden} from ${
              data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
                .hidden
            }`,
          });
        } else {
          data[projectName].allTopics[findTopicIndex].todos[
            findTodoIndex
          ].history = [
            {
              date: Date.now().toString(),
              text: `Hidden was changed to ${todoToChange.hidden} from ${
                data[projectName].allTopics[findTopicIndex].todos[findTodoIndex]
                  .hidden
              }`,
            },
          ];
        }

        data[projectName].allTopics[findTopicIndex].todos[
          findTodoIndex
        ].hidden = todoToChange.hidden;
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

      if (todoIndex === -1) return {};

      const deadLine = {
        to: options.to,
        from: options.from,
      };

      if (data[projectName].allTopics[topicName].todos[todoIndex].history) {
        data[projectName].allTopics[topicName].todos[todoIndex].history.push({
          date: Date.now().toString(),
          text: `Deadline was changed to ${JSON.stringify(deadLine)} from ${JSON.stringify(data[projectName].allTopics[topicName].todos[todoIndex].deadline)}`,
        });
      } else {
        data[projectName].allTopics[topicName].todos[todoIndex].history = [
          {
            date: Date.now().toString(),
            text: `Deadline was changed to ${JSON.stringify(deadLine)} from ${JSON.stringify(data[projectName].allTopics[topicName].todos[todoIndex].deadline)}`,
          },
        ];
      }

      data[projectName].allTopics[topicName].todos[todoIndex].deadline =
        deadLine;

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

          if (todoName.includes(pattern)) {
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

    if (
      data[link.projectName].allTopics[findTopicIndex].todos[findTodoIndex]
        .history
    ) {
      data[link.projectName].allTopics[findTopicIndex].todos[
        findTodoIndex
      ].history?.push({
        date: Date.now().toString(),
        text: `Link was added to ${JSON.stringify(obj)}`,
      });
    } else {
      data[link.projectName].allTopics[findTopicIndex].todos[
        findTodoIndex
      ].history = [
        {
          date: Date.now().toString(),
          text: `Link was added to ${JSON.stringify(obj)}`,
        },
      ];
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
    linkId: string,
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
      const findLinkIndex = data[project].allTopics[findTopicIndex].todos[
        findTodoIndex
      ].links.findIndex((t) => t.todo.id === linkId);

      if (findLinkIndex === -1) return null;

      const tempObj =
        data[project].allTopics[findTopicIndex].todos[findTodoIndex].links[
          findLinkIndex
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

      if (
        data[project].allTopics[findTopicIndex].todos[findTodoIndex].history
      ) {
        data[project].allTopics[findTopicIndex].todos[
          findTodoIndex
        ].history.push({
          date: Date.now().toString(),
          text: `Link was deleted ${JSON.stringify(data[project].allTopics[findTopicIndex].todos[findTodoIndex].links[findLinkIndex])}`,
        });
      } else {
        data[project].allTopics[findTopicIndex].todos[findTodoIndex].history = [
          {
            date: Date.now().toString(),
            text: `Link was deleted ${JSON.stringify(data[project].allTopics[findTopicIndex].todos[findTodoIndex].links[findLinkIndex])}`,
          },
        ];
      }

      data[project].allTopics[findTopicIndex].todos[findTodoIndex].links.splice(
        findLinkIndex,
        1,
      );
    }

    fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
  };
}

export const database = new Database();
