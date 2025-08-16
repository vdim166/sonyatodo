import { useEffect } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import './styles.css';

type UniversalWrapperProps = {
  children: React.ReactNode;
};

export const UniversalWrapper = ({ children }: UniversalWrapperProps) => {
  const { closeModal } = useModalsContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="universal_wrapper">
      <div className="universal_wrapper_window">{children}</div>
    </div>
  );
};
