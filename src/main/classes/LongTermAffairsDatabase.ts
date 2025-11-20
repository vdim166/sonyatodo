import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';

export type LongTermAffairsDTO = {
  name: string;
};

export type LongTermAffairsTodoType = {
  id: string;
  name: string;
};

export type LongTermAffairsDatabaseType = {
  todos: {
    TODO: LongTermAffairsTodoType[];
    DONE: LongTermAffairsTodoType[];
  };
};

class LongTermAffairsDatabase {
  private userDataPath = app.getPath('userData');
  private filePath = path.join(
    this.userDataPath,
    'sonyaTodo',
    'long_term_affairs_data.json',
  );

  loadDataFromFile(): LongTermAffairsDatabaseType {
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

      return {
        todos: {
          TODO: [],
          DONE: [],
        },
      };
    } catch (err) {
      console.error('Ошибка при чтении файла:', err);
      return {
        todos: {
          TODO: [],
          DONE: [],
        },
      };
    }
  }

  addNewTodo(todo: LongTermAffairsDTO) {
    try {
      const data = this.loadDataFromFile();

      const id = generateRandomId();

      const newTodo = { ...todo, id };

      data.todos['TODO'].unshift(newTodo);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');

      return newTodo;
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }

  deleteTodo(id: string, state: 'TODO' | 'DONE') {
    try {
      const data = this.loadDataFromFile();

      data.todos[state] = data.todos[state].filter((t) => t.id !== id);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
    }
  }

  changeTodo(
    id: string,
    state: 'TODO' | 'DONE',
    todoToChange: LongTermAffairsDTO,
  ) {
    try {
      const data = this.loadDataFromFile();

      const findIndex = data.todos[state].findIndex((t) => t.id === id);

      if (findIndex === -1) return null;

      data.todos[state][findIndex].name = todoToChange.name;

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
    }
  }

  getAllTodos() {
    try {
      const data = this.loadDataFromFile();

      return data.todos;
    } catch (error) {
      return { todos: [] };
    }
  }

  moveTodo(id: string, moveFrom: 'TODO' | 'DONE', moveTo: 'TODO' | 'DONE') {
    try {
      const data = this.loadDataFromFile();

      const findIndex = data.todos[moveFrom].findIndex((t) => t.id === id);

      if (findIndex === -1) return null;

      data.todos[moveTo].unshift(data.todos[moveFrom][findIndex]);

      data.todos[moveFrom] = data.todos[moveFrom].filter((t) => t.id !== id);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
    }
  }
}

export const longTermAffairsDatabase = new LongTermAffairsDatabase();
