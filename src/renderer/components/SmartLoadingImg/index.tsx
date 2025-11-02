import { useEffect, useState } from 'react';
import './styles.css';

type SmartLoadingImgProps = {
  link: string;
};

export const SmartLoadingImg = ({ link }: SmartLoadingImgProps) => {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage(filename: string) {
      const base64 = await window.electron.ipcRenderer.loadTodoImage(filename);
      if (!base64) return;

      const imgSrc = `data:image/png;base64,${base64}`; // формируем data URL

      setImg(imgSrc);
    }

    loadImage(link);
  }, []);

  if (!img) {
    return <p>Loading image...</p>;
  }

  return <img src={img} className="todo_img"></img>;
};
