import { useContext } from 'react';
import { ImportantDatesContext } from '../contexts/ImportantDatesContext';

export const useImportantDatesContext = () => {
  const data = useContext(ImportantDatesContext);

  return data;
};
