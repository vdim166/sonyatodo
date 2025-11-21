import { useState } from 'react';
import { ArrowLeft } from '../../icons/ArrowLeft';
import './styles.css';
import { CalendarDay } from '../CalendarDay';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type DayCell = { day: number; month: number; year: number };

/**
 * month: 1-12
 * year: 4-digit year
 * week starts from Monday
 */
export function generateCalendar(month: number, year: number) {
  // вычисления исходя из month: 1-12
  const firstDayJS = new Date(year, month - 1, 1).getDay(); // 0..6, 0 = Sunday
  // переводим в индекс где 0 = Monday, 6 = Sunday
  const startIndex = (firstDayJS + 6) % 7;

  const daysInMonth = new Date(year, month, 0).getDate(); // дней в текущем месяце
  const prevMonthDays = new Date(year, month - 1, 0).getDate(); // дней в предыдущем месяце

  const calendar: DayCell[][] = [];
  let week: DayCell[] = [];

  // вспомогательная функция для нормализации месяца/года в объекте (1-12, корректный год)
  const normalize = (m: number, y: number) => {
    if (m < 1) {
      return { month: 12 + m, year: y - 1 }; // m будет 0 -> 12 prev year
    }
    if (m > 12) {
      return { month: ((m - 1) % 12) + 1, year: y + Math.floor((m - 1) / 12) };
    }
    return { month: m, year: y };
  };

  // заполняем дни предыдущего месяца перед началом месяца
  for (let i = startIndex; i > 0; i--) {
    const day = prevMonthDays - i + 1;
    const norm = normalize(month - 1, year);
    week.push({ day, month: norm.month, year: norm.year });
  }

  // текущий месяц
  for (let d = 1; d <= daysInMonth; d++) {
    week.push({ day: d, month, year });
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // заполнить последнюю неделю днями следующего месяца (если неполная)
  let nextMonthDay = 1;
  if (week.length > 0) {
    while (week.length < 7) {
      const norm = normalize(month + 1, year);
      week.push({ day: nextMonthDay++, month: norm.month, year: norm.year });
    }
    calendar.push(week);
    week = [];
  }

  // если нужно всегда вернуть 6 строк (некоторые дизайны календарей требуют 6 рядов),
  // то добавляем ещё одну неделю из дней следующего месяца.
  // Если ты не хочешь всегда 6 рядов — убери этот блок.
  if (calendar.length === 5) {
    const extraWeek: DayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const norm = normalize(month + 1, year);
      extraWeek.push({
        day: nextMonthDay++,
        month: norm.month,
        year: norm.year,
      });
    }
    calendar.push(extraWeek);
  }

  return { calendar };
}

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();

    const month = now.getMonth();

    return month + 1;
  });

  const [currentYear, setCurrentYear] = useState(() => {
    const now = new Date();

    const year = now.getFullYear(); // e.g. 2025
    return year;
  });

  const days = generateCalendar(currentMonth, currentYear);

  return (
    <div className="calendar_main">
      <div className="calendar_action_menu">
        <div className="calendar_action_menu_year">
          <div
            className="calendar_action_menu_arrow_left"
            onClick={() => {
              setCurrentYear((prev) => {
                return prev - 1;
              });
            }}
          >
            <ArrowLeft />
          </div>

          <div>
            <div className="calendar_current_month">{currentYear}</div>
          </div>

          <div
            className="calendar_action_menu_arrow_right"
            onClick={() => {
              setCurrentYear((prev) => {
                return prev + 1;
              });
            }}
          >
            <ArrowLeft />
          </div>
        </div>
        <div className="calendar_action_menu_month">
          <div
            className="calendar_action_menu_arrow_left"
            onClick={() => {
              setCurrentMonth((prev) => {
                if (prev - 1 === 0) return 12;

                return prev - 1;
              });
            }}
          >
            <ArrowLeft />
          </div>

          <div>
            <div className="calendar_current_month">
              {months[currentMonth - 1]}
            </div>
          </div>

          <div
            className="calendar_action_menu_arrow_right"
            onClick={() => {
              setCurrentMonth((prev) => {
                if (prev + 1 === 13) return 1;

                return prev + 1;
              });
            }}
          >
            <ArrowLeft />
          </div>
        </div>
      </div>

      <div className="calendar_container">
        <div className="calendar_month_names">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((m) => {
            return (
              <div className="calendar_month_name" key={m}>
                {m}
              </div>
            );
          })}
        </div>

        <div className="calendar_days">
          {days.calendar.map((i, index) => {
            return (
              <div className="calendar_days_row" key={index}>
                {i.map((d) => {
                  return (
                    <div
                      className="calendar_day_container"
                      key={`${d.day}-${d.month}-${d.year}`}
                    >
                      <div className="calendar_day">
                        <CalendarDay date={d} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
