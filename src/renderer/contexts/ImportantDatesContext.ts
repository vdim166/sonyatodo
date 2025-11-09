import { createContext } from 'react';
import { ImportantDateDto } from '../../main/classes/ImportantDatesDatabase';

export type ImportantDatesContexType = {
  dates: ImportantDateDto[] | null;
  setImportantDates: React.Dispatch<
    React.SetStateAction<ImportantDateDto[] | null>
  >;
};

const init: ImportantDatesContexType = {
  dates: null,
  setImportantDates: () => {},
};

export const ImportantDatesContext =
  createContext<ImportantDatesContexType>(init);
