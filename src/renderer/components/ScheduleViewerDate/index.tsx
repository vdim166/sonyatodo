import {
  ScheduleDateType,
  ScheduleTodoDTO,
} from '../../../main/classes/ScheduleDatabase';
import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import { Cross } from '../../icons/Cross';
import './styles.css';

type ScheduleViewerDateProps = {
  handleDelete: () => void;
  date: ScheduleTodoDTO;
  origin: ScheduleDateType;
};

export const ScheduleViewerDate = ({
  date,
  handleDelete,
  origin,
}: ScheduleViewerDateProps) => {
  const { openModal } = useModalsContext();

  return (
    <div
      className="ScheduleViewerModal_date"
      onClick={() => {
        openModal({
          type: MODALS.SCHEDULE_DATE_CHANGER,
          props: {
            date,
            origin,
          },
        });
      }}
    >
      <p>{date.name}</p>
      <div
        className="ScheduleViewerModal_date_cross"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        <Cross />
      </div>
    </div>
  );
};
