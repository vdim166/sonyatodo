import { useEffect, useState } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { scheduleViewerModalType } from '../types/scheduleViewerModalType';
import './styles.css';
import { scheduleDatesApi } from '../../../classes/scheduleDatesApi';
import { ScheduleTodoDTO } from '../../../../main/classes/ScheduleDatabase';
import { Input } from '../../shared/components/Input';
import { Textarea } from '../../shared/components/Textarea';
import { Button } from '../../shared/components/Button';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';
import { ScheduleViewerDate } from '../../ScheduleViewerDate';

export const ScheduleViewerModal = ({ date }: scheduleViewerModalType) => {
  const { closeModal } = useModalsContext();

  const [dates, setDates] = useState<ScheduleTodoDTO[] | null>(null);

  const [name, setName] = useState('');

  const [desc, setDesc] = useState('');

  useEffect(() => {
    const loadDate = async () => {
      try {
        const data = await scheduleDatesApi.getScheduleTodos(date);

        if (data) {
          setDates(data);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadDate();
  }, []);

  const update = async () => {
    window.dispatchEvent(
      new CustomEvent(DISPATCH_EVENTS.FETCH_CALENDAR_DAY, { detail: date }),
    );

    const data = await scheduleDatesApi.getScheduleTodos(date);
    if (data) {
      setDates(data);
    }
  };

  const handleSubmit = async () => {
    try {
      await scheduleDatesApi.addScheduleTodo(date, {
        name,
        description: desc,
      });

      setName('');
      setDesc('');

      await update();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>
      <div className="ScheduleViewerModal_main">
        <p className="ScheduleViewerModal_title">
          {date.day}-{date.month}-{date.year}
        </p>
        <div className="ScheduleViewerModal_container">
          <div className="ScheduleViewerModal_inputs">
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

            <Button onClick={handleSubmit} disabled={name === ''}>
              Сохранить
            </Button>
          </div>
          <div className="ScheduleViewerModal_dates_container">
            <p>Добавленные даты</p>

            {dates ? (
              <div className="ScheduleViewerModal_dates">
                {dates.map((d) => {
                  return (
                    <ScheduleViewerDate
                      key={d.id}
                      handleDelete={async () => {
                        try {
                          await scheduleDatesApi.deleteScheduleTodo(date, d.id);

                          await update();
                        } catch (error) {
                          console.log('error', error);
                        }
                      }}
                      date={d}
                      origin={date}
                    />
                  );
                })}
              </div>
            ) : (
              <div>Пока ничего нет</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
