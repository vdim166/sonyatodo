import { useEffect, useState } from 'react';
import { changeTodoDeadlineType } from '../types/changeTodoDeadlineType';
import './styles.css';
import { ipcSignals, saveTodoType } from '../../../classes/ipcSignals';
import { useAppContext } from '../../../hooks/useAppContext';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { DISPATCH_EVENTS } from '../../../consts/dispatchEvents';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';

export const ChangeTodoDeadline = ({ id, topic }: changeTodoDeadlineType) => {
  const { currentProjectName } = useAppContext();

  const { closeModal } = useModalsContext();

  const [isLoading, setIsLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const loadTodo = async () => {
      try {
        setIsLoading(true);
        const data: saveTodoType = await ipcSignals.getTodoById(
          id,
          topic,
          currentProjectName || 'main',
        );

        setDateFrom(data.deadline?.from || '');
        setDateTo(data.deadline?.to || '');
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodo();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isBlocked = dateTo === '';

  const handleSubmit = async () => {
    try {
      await ipcSignals.setDeadLine(
        {
          id,
          topic,
          from: dateFrom,
          to: dateTo,
        },
        currentProjectName || 'main',
      );

      closeModal();
      window.dispatchEvent(new CustomEvent(DISPATCH_EVENTS.FETCH_TODOS));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>
      <h1>Введите дату</h1>
      <div className="change_todo_deadline_input_container">
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
          }}
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
          }}
        />
      </div>

      <Button disabled={isBlocked} onClick={handleSubmit}>
        Сохранить
      </Button>
    </div>
  );
};
