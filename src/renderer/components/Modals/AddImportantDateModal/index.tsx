import { useState } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { PickDateForImportantDate } from '../../PickDateForImportantDate';
import { Button } from '../../shared/components/Button';
import { Textarea } from '../../shared/components/Textarea';
import './styles.css';
import { importantDatesApi } from '../../../classes/importantDatesApi';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';

export const AddImportantDateModal = () => {
  const { closeModal } = useModalsContext();

  const [name, setName] = useState('');
  const [date, setDate] = useState<string>('');

  const handleSubmit = async () => {
    try {
      await importantDatesApi.addImportantDate({
        name,
        date,
      });
      closeModal();

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_IMPORTANT_DATES),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>
      <div className="widget_settings_modal_container">
        <p className="widget_settings_modal_textarea_title">Название</p>
        <Textarea
          className="widget_settings_modal_textarea"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div
        className="widget_settings_modal_container"
        style={{
          marginTop: '10px',
        }}
      >
        <p
          style={{
            marginBottom: '10px',
          }}
        >
          Введите дату
        </p>

        <PickDateForImportantDate date={date} setDate={setDate} />

        <div className="PickDateForImportantDate_container_btn">
          <Button disabled={date === '' || name === ''} onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
