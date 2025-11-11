import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { imgViewerType } from '../types/imgViewerType';
import './style.css';

export const ImageViewerModal = ({ img }: imgViewerType) => {
  const { closeModal } = useModalsContext();
  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>

      <div className="image_viewer_modal">
        <img src={img} alt="img" />
      </div>
    </div>
  );
};
