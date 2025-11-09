import { useState } from 'react';
import './styles.css';
import { Check } from '../../icons/Check';

type PickDateForImportantDateProps = {
  date: string;
  setDate: (value: string) => void;
};

export const PickDateForImportantDate = ({
  date,
  setDate,
}: PickDateForImportantDateProps) => {
  const [isPicked, setIsPicked] = useState(false);

  const [localDate, setLocalDate] = useState(date);

  return (
    <div className="PickDateForImportantDate_container">
      {!isPicked ? (
        <div
          className="PickDateForImportantDate_container_date"
          onClick={() => {
            setIsPicked((prev) => !prev);
          }}
        >
          {date === '' ? 'Дата не введена' : date}
        </div>
      ) : (
        <div className="PickDateForImportantDate_container_date_picker">
          <input
            type="date"
            value={localDate}
            onChange={(e) => {
              setLocalDate(e.target.value);
            }}
          />

          <button
            className="PickDateForImportantDate_container_date_picker_check"
            disabled={localDate === ''}
            onClick={() => {
              setIsPicked(false);
              setDate(localDate);
            }}
          >
            <Check />
          </button>
        </div>
      )}
    </div>
  );
};
