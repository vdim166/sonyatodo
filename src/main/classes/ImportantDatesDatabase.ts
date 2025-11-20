import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { ImportantDatesDatabaseType } from '../types/ImportantDatesDatabase';
import { generateRandomId } from '../utils/generateRandomId';

export type ImportantDateType = {
  name: string;
  date: string;
};

export type ImportantDateDto = {
  id: string;
  name: string;
  date: string;
};

class ImportantDatesDatabase {
  private userDataPath = app.getPath('userData');
  private filePath = path.join(
    this.userDataPath,
    'sonyaTodo',
    'important_dates_data.json',
  );

  loadDataFromFile(): ImportantDatesDatabaseType {
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

  addImportantDate(date: ImportantDateType) {
    try {
      const data = this.loadDataFromFile();

      const id = generateRandomId();

      const newData = {
        ...date,
        id,
      };

      data.dates.unshift(newData);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  deleteImportantDate(id: string) {
    try {
      const data = this.loadDataFromFile();

      data.dates = data.dates.filter((d) => d.id !== id);

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  changeImportantDate(id: string, newDate: ImportantDateType) {
    try {
      const data = this.loadDataFromFile();

      const index = data.dates.findIndex((d) => d.id === id);

      if (index === -1) return null;

      if (newDate.name) data.dates[index].name = newDate.name;

      if (newDate.date) data.dates[index].date = newDate.date;

      fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.log('error', error);
    }
  }

  getAllImportantDates() {
    try {
      const data = this.loadDataFromFile();

      return data;
    } catch (error) {
      return { dates: [] };
    }
  }
}

export const importantDatesDatabase = new ImportantDatesDatabase();
