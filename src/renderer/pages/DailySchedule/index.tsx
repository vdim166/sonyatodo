import { Calendar } from '../../components/Calendar';
import { Navbar } from '../../components/Navbar';
import './styles.css';

export const DailySchedule = () => {
  return (
    <div className="daily_schedule_main">
      <Navbar />
      <Calendar />
    </div>
  );
};
