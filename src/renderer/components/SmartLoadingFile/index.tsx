import { useRef } from 'react';
import { FileIcon } from '../../icons/FileIcon';
import './styles.css';

type SmartLoadingFileProps = {
  link: string;
  isClickable?: boolean;
};

export const SmartLoadingFile = ({
  link,
  isClickable = false,
}: SmartLoadingFileProps) => {
  const openFile = async () => {
    try {
      await window.electron.ipcRenderer.loadTodoFile(link);
      //   if (!base64) return;
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div
      className={`todo_file ${isClickable ? 'clickable' : ''}`}
      onClick={openFile}
    >
      <FileIcon />
    </div>
  );
};
