import { useState } from 'react';
import { BurgerMenu } from '../../components/BurgerMenu';
import { Navbar } from '../../components/Navbar';
import { ProjectsHolder } from '../../components/ProjectsHolder';
import { Button } from '../../components/shared/components/Button';
import './style.css';
import { ImportantDate } from '../../components/ImportantDate';
import { useModalsContext } from '../../hooks/useModalsContext';
import { MODALS } from '../../contexts/ModalsContext';
import { useImportantDatesContext } from '../../hooks/useImportantDatesContext';

export const ImportantDates = () => {
  const { dates } = useImportantDatesContext();

  const { openModal } = useModalsContext();

  if (!dates) return <div>Loading...</div>;

  return (
    <div className="important_dates_main">
      <Navbar />
      <div className="important_dates_container">
        <Button
          onClick={() => {
            openModal({
              type: MODALS.ADD_IMPORTANT_DATE,
              props: null,
            });
          }}
        >
          Добавить дату
        </Button>
        <div className="important_dates_container_dates">
          {dates.length > 0 ? (
            dates.map((date) => {
              return <ImportantDate date={date} key={date.id} />;
            })
          ) : (
            <div
              style={{
                textAlign: 'center',
                fontSize: '20px',
              }}
            >
              Покачто ничего нет
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
