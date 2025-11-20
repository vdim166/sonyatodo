import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateRandomId } from '../utils/generateRandomId';

export type ScheduleTodoType = {
  name: string;
  description: string;
};

export type ScheduleTodoDTO = {
  id: string;
  name: string;
  description: string;
};

export type ScheduleDateType = {
  day: number;
  month: number;
  year: number;
};

type ScheduleDTO = {
  date: ScheduleDateType;
  todos: ScheduleTodoDTO[];
};

type ScheduleDatabaseType = {
  dates: ScheduleDTO[];
};

class ScheduleDatabase {
  private userDataPath = app.getPath('userData');
  private filePath = path.join(
    this.userDataPath,
    'sonyaTodo',
    'scheduleDatabase.json',
  );

  loadDataFromFile(): ScheduleDatabaseType {
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
      return { dates: [] };
    } catch (err) {
      console.error('Ошибка при чтении файла:', err);
      return { dates: [] };
    }
  }

  findDateIndex = (date: ScheduleDateType, data: ScheduleDatabaseType) => {
    return data.dates.findIndex((d) => {
      return (
        d.date.day === date.day &&
        d.date.month === date.month &&
        d.date.year === date.year
      );
    });
  };

  addScheduleTodo(date: ScheduleDateType, todo: ScheduleTodoType) {
    try {
      const data = this.loadDataFromFile();

      const newTodo: ScheduleTodoDTO = { ...todo, id: generateRandomId() };

      const index = this.findDateIndex(date, data);

      if (index === -1) {
        data.dates.push({
          date,
          todos: [newTodo],
        });
      } else {
        data.dates[index].todos.push(newTodo);
      }

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  deleteScheduleTodo = (date: ScheduleDateType, id: string) => {
    try {
      const data = this.loadDataFromFile();

      const index = this.findDateIndex(date, data);

      if (index === -1) return null;

      data.dates[index].todos = data.dates[index].todos.filter(
        (t) => t.id !== id,
      );
      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
      return null;
    }
  };

  changeScheduleTodo = (
    date: ScheduleDateType,
    id: string,
    options: { name?: string; description?: string },
  ) => {
    try {
      const data = this.loadDataFromFile();

      const index = this.findDateIndex(date, data);

      if (index === -1) return null;

      const todoIndex = data.dates[index].todos.findIndex((t) => t.id === id);

      if (todoIndex === -1) return null;

      if (options.name) {
        data.dates[index].todos[todoIndex].name = options.name;
      }

      if (options.description) {
        data.dates[index].todos[todoIndex].description = options.description;
      }

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
      return null;
    }
  };

  getScheduleTodos = (date: ScheduleDateType) => {
    try {
      const data = this.loadDataFromFile();
      const index = this.findDateIndex(date, data);

      if (index === -1) return null;

      return data.dates[index].todos;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  };
}

export const scheduleDatabase = new ScheduleDatabase();
