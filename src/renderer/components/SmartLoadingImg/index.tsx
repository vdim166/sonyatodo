import { useEffect, useState } from 'react';
import './styles.css';
import { useModalsContext } from '../../hooks/useModalsContext';
import { MODALS } from '../../contexts/ModalsContext';

type SmartLoadingImgProps = {
  link: string;
  isClickable?: boolean;

  alreadyHave?: string;

  setCache: (value: string) => void;
};

export const SmartLoadingImg = ({
  link,
  isClickable = false,
  alreadyHave,
  setCache,
}: SmartLoadingImgProps) => {
  const [img, setImg] = useState<string | null>(alreadyHave || null);

  const { openModal } = useModalsContext();

  useEffect(() => {
    if (alreadyHave) return;

    async function loadImage(filename: string) {
      const base64 = await window.electron.ipcRenderer.loadTodoImage(filename);
      if (!base64) return;

      const imgSrc = `data:image/png;base64,${base64}`; // формируем data URL

      setImg(imgSrc);
      setCache(imgSrc);
    }

    loadImage(link);
  }, []);

  if (!img) {
    return <p>Loading image...</p>;
  }

  const handleOpenImg = () => {
    if (!isClickable) return;
    if (!img) return;

    openModal({
      type: MODALS.IMG_VIEWER,
      props: {
        img,
      },
    });
  };

  return (
    <img
      src={img}
      className={`todo_img ${isClickable ? 'clickable' : ''}`}
      onClick={handleOpenImg}
    ></img>
  );
};
