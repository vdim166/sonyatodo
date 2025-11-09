import { useEffect, useState } from 'react';
import {
  ImportantDatesContext,
  ImportantDatesContexType,
} from './ImportantDatesContext';
import { ImportantDateDto } from '../../main/classes/ImportantDatesDatabase';
import { importantDatesApi } from '../classes/importantDatesApi';
import { DISPATCH_EVENTS } from '../consts/dispatchEvents';
import { ImportantDatesDatabaseType } from '../../main/types/ImportantDatesDatabase';

type ImportantDatesContextProviderProps = {
  children: React.ReactNode;
};

export const ImportantDatesContextProvider = ({
  children,
}: ImportantDatesContextProviderProps) => {
  const [importantDates, setImportantDates] = useState<
    ImportantDateDto[] | null
  >(null);

  const value: ImportantDatesContexType = {
    dates: importantDates,
    setImportantDates,
  };

  useEffect(() => {
    const loadDates = async () => {
      try {
        const data: ImportantDatesDatabaseType =
          await importantDatesApi.getImportantDates();

        setImportantDates(data.dates);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadDates();

    window.addEventListener(DISPATCH_EVENTS.FETCH_IMPORTANT_DATES, loadDates);

    return () => {
      window.removeEventListener(
        DISPATCH_EVENTS.FETCH_IMPORTANT_DATES,
        loadDates,
      );
    };
  }, []);

  return (
    <ImportantDatesContext.Provider value={value}>
      {children}
    </ImportantDatesContext.Provider>
  );
};
