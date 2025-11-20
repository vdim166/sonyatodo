import { useState } from 'react';
import { MODALS } from '../../../contexts/ModalsContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { BackArrow } from '../../../icons/BackArrow';
import { Cross } from '../../../icons/Cross';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Textarea } from '../../shared/components/Textarea';
import { scheduleDateChangerType } from '../types/scheduleDateChangerType';
import './styles.css';
import { scheduleDatesApi } from '../../../classes/scheduleDatesApi';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';

export const ScheduleDateChangerModal = ({
  date,
  origin,
}: scheduleDateChangerType) => {
  const { closeModal, openModal } = useModalsContext();

  const [name, setName] = useState(date.name);

  const [desc, setDesc] = useState(date.description);

  const isDisabled = name === date.name && desc === date.description;

  const update = async () => {
    window.dispatchEvent(
      new CustomEvent(DISPATCH_EVENTS.FETCH_CALENDAR_DAY, { detail: origin }),
    );
  };
  const goBack = () => {
    openModal({
      type: MODALS.SCHEDULE_VIEWER,
      props: {
        date: origin,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const result: {
        name?: string;
        description?: string;
      } = {};

      if (name !== date.name) {
        result.name = name;
      } else if (desc !== date.description) {
        result.description = desc;
      }

      await scheduleDatesApi.changeScheduleTodo(origin, date.id, result);

      await update();
      goBack();
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>

      <div className="widget_settings_modal_back" onClick={goBack}>
        <BackArrow />
      </div>

      <div className="ScheduleDateChangerModal_main">
        <p className="ScheduleDateChangerModal_title">Изменить</p>

        <div className="ScheduleDateChangerModal_container">
          <div>
            <p>Name</p>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <p>Desc</p>
            <Textarea
              className="ScheduleViewerModal_inputs_input"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />
          </div>

          <Button disabled={isDisabled} onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
