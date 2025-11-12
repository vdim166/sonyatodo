import { useState } from 'react';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import { Button } from '../../shared/components/Button';
import { Textarea } from '../../shared/components/Textarea';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';
import { longTermAffairsApi } from '../../../classes/longTermAffairsApi';

export const AddLongTermAffairModal = () => {
  const { closeModal } = useModalsContext();

  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      await longTermAffairsApi.addLongTermAffair({
        name,
      });
      closeModal();

      window.dispatchEvent(
        new CustomEvent(DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS),
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
        <div className="PickDateForImportantDate_container_btn">
          <Button disabled={name === ''} onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
