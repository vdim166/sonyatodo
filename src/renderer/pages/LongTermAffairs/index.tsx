import { useEffect, useState } from 'react';
import { LongTermAffairsTodoType } from '../../../main/classes/LongTermAffairsDatabase';
import { LongTermAffairsTodo } from '../../components/LongTermAffairsTodo';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/shared/components/Button';
import { MODALS } from '../../contexts/ModalsContext';
import { useModalsContext } from '../../hooks/useModalsContext';
import './styles.css';
import { longTermAffairsApi } from '../../classes/longTermAffairsApi';
import { DISPATCH_EVENTS } from '../../consts/dispatchEvents';
import { LongTermAffairsNavbar } from '../../components/LongTermAffairsNavbar';
import { useLongTermAffairsContext } from '../../hooks/useLongTermAffairsContext';

export const LongTermAffairs = () => {
  const { openModal } = useModalsContext();
  const { currentTab } = useLongTermAffairsContext();

  const [longTermAffairs, setLongTermAffairs] = useState<
    LongTermAffairsTodoType[] | null
  >(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await longTermAffairsApi.getAllLongTermAffairs();

        setLongTermAffairs(data[currentTab]);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadTodos();

    window.addEventListener(DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS, loadTodos);

    return () => {
      window.removeEventListener(
        DISPATCH_EVENTS.FETCH_LONG_TERM_AFFAIRS,
        loadTodos,
      );
    };
  }, [currentTab]);

  return (
    <div className="longTermAffairs_main">
      <Navbar />

      <div className="important_dates_container">
        <Button
          onClick={() => {
            openModal({
              type: MODALS.ADD_LONG_TERM_AFFAIR,
              props: null,
            });
          }}
        >
          Добавить дело
        </Button>
        <LongTermAffairsNavbar />
        <div className="longTermAffairss_container_dates">
          {longTermAffairs && longTermAffairs.length > 0 ? (
            longTermAffairs.map((todo) => {
              return <LongTermAffairsTodo todo={todo} key={todo.id} />;
            })
          ) : (
            <div
              style={{
                textAlign: 'center',
                fontSize: '20px',
              }}
            >
              Пока ничего нет
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
