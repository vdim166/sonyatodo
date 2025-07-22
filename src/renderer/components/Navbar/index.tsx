import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

export const Navbar = () => {
  const loc = useLocation();

  const nav = useNavigate();

  return (
    <div className="nav_main">
      <button
        className={`nav_main_option ${loc.pathname === '/' ? 'selected' : ''}`}
        onClick={() => nav('/')}
      >
        ДЕЛА
      </button>
      <button
        className={`nav_main_option ${loc.pathname === '/alarm' ? 'selected' : ''}`}
        onClick={() => nav('/alarm')}
      >
        БУДИЛЬНИК
      </button>

      <button className={`nav_main_option`} onClick={() => nav('/alarm')}>
        РАСПИСАНИЕ ДНЯ
      </button>
      <button className={`nav_main_option`} onClick={() => nav('/alarm')}>
        ВАЖНЫЕ ДАТЫ
      </button>
    </div>
  );
};
