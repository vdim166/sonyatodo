import { useEffect, useState } from 'react';
import './styles.css';
import { useModalsContext } from '../../hooks/useModalsContext';
import { MODALS } from '../../contexts/ModalsContext';
import { Video } from '../../icons/Video';

type SmartLoadingVideoProps = {
  link: string;
  isClickable?: boolean;
};
const createVideoThumbnail = (base64Video: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Валидация Base64
    if (!base64Video || typeof base64Video !== 'string') {
      reject(new Error('Invalid video data'));
      return;
    }

    // 2. Проверяем формат data URL
    if (!base64Video.startsWith('data:video/')) {
      // Пытаемся исправить формат
      if (base64Video.startsWith('data:')) {
        // Это другой MIME type
        reject(new Error('Not a video data URL'));
        return;
      } else {
        // Добавляем video MIME type если отсутствует
        base64Video = `data:video/mp4;base64,${base64Video}`;
      }
    }

    // 3. Проверяем размер Base64
    const base64Length =
      base64Video.split(',')[1]?.length || base64Video.length;
    if (base64Length < 100) {
      reject(new Error('Video data too short'));
      return;
    }

    // 4. Очищаем Base64 от лишних символов
    const cleanBase64Video = base64Video.replace(/\s/g, '');

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', ''); // Для iOS

    // Таймаут
    const timeout = setTimeout(() => {
      video.onerror = null;
      video.onloadeddata = null;
      video.onseeked = null;
      reject(new Error('Video loading timeout'));
    }, 8000); // 8 секунд таймаут

    // Обработчики событий
    video.onloadeddata = () => {
      clearTimeout(timeout);

      // Пытаемся установить время для кадра
      try {
        if (video.duration > 0) {
          video.currentTime = Math.min(0.1, video.duration / 10);
        } else {
          video.currentTime = 0;
        }
      } catch (e) {
        video.currentTime = 0;
      }
    };

    video.onseeked = () => {
      clearTimeout(timeout);

      try {
        const canvas = document.createElement('canvas');
        // Ограничиваем размер для производительности
        const maxDimension = 400;

        let width = video.videoWidth || 320;
        let height = video.videoHeight || 180;

        // Если видео не загрузило размеры, используем дефолтные
        if (width === 0 || height === 0) {
          width = 320;
          height = 180;
        }

        // Масштабируем если нужно
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Заполняем фон на случай прозрачности
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, width, height);

          // Рисуем видео
          ctx.drawImage(video, 0, 0, width, height);

          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } else {
          reject(new Error('Canvas not supported'));
        }
      } catch (error) {
        reject(new Error(`Canvas error: ${(error as Error).message}`));
      }
    };

    video.onerror = (event) => {
      clearTimeout(timeout);
      console.error('Video loading error details:', {
        error: event,
        videoSrc: cleanBase64Video.substring(0, 100) + '...',
        videoReadyState: video.readyState,
        videoError: video.error,
      });

      // Пробуем альтернативные методы
      //   tryAlternativeMethods(cleanBase64Video)
      //     .then(resolve)
      //     .catch(() => {
      //       reject(new Error(`Video failed to load. Code: ${video.error?.code}`));
      //     });
    };

    // Пытаемся загрузить видео
    try {
      video.src = cleanBase64Video;
      video.load();
    } catch (error) {
      clearTimeout(timeout);
      reject(
        new Error(`Failed to set video source: ${(error as Error).message}`),
      );
    }
  });
};

export const SmartLoadingVideo = ({
  link,
  isClickable = false,
}: SmartLoadingVideoProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const { openModal } = useModalsContext();

  useEffect(() => {
    async function loadVideo(filename: string) {
      const base64 = await window.electron.ipcRenderer.loadTodoVideo(filename);

      if (!base64) return;

      const thumbnail = await createVideoThumbnail(base64);

      setThumbnail(thumbnail);
    }

    loadVideo(link);
  }, []);

  if (!thumbnail) {
    return <p>Loading video...</p>;
  }

  const handleOpenVideo = () => {
    if (!isClickable) return;

    openModal({
      type: MODALS.VIDEO_VIEWER,
      props: {
        videoName: link,
      },
    });
  };

  return (
    <div
      className={`todo_video_container ${isClickable ? 'clickable' : ''}`}
      onClick={handleOpenVideo}
    >
      <img src={thumbnail} className={`todo_img`}></img>

      <div className="todo_video_video_svg">
        <Video />
      </div>
    </div>
  );
};
