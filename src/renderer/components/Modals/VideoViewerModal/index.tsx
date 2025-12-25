import { useEffect, useState } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { videoViewerType } from '../types/videoViewerType';
import './styles.css';

const Base64VideoPlayer = ({ base64Video }: { base64Video: string }) => {
  return (
    <div className="video-player">
      <video
        controls
        autoPlay={false}
        playsInline
        preload="metadata"
        style={{ maxWidth: '100%', maxHeight: '400px' }}
      >
        <source src={base64Video} type="video/mp4" />
        Ваш браузер не поддерживает видео тег.
      </video>
    </div>
  );
};

export const VideoViewerModal = ({ videoName }: videoViewerType) => {
  const { closeModal } = useModalsContext();

  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const base64 =
          await window.electron.ipcRenderer.loadTodoVideo(videoName);

        if (!base64) return;

        setVideo(`data:video/mp4;base64,${base64}`);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadVideo();
  }, []);

  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>

      <div className="image_viewer_modal">
        {video ? (
          <Base64VideoPlayer base64Video={video} />
        ) : (
          <div className="video-player-loading"></div>
        )}
      </div>
    </div>
  );
};
