import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

type Tab = {
  name: string;
  path: string;
};

const tabs: { [key: string]: Tab } = {
  todos: { name: 'ДЕЛА', path: '/' },
  alarm: {
    name: 'БУДИЛЬНИК',
    path: '/alarm',
  },
  schedule: {
    name: 'РАСПИСАНИЕ ДНЯ',
    path: '/schedule',
  },
  importantDates: {
    name: 'ВАЖНЫЕ ДАТЫ',
    path: '/importantDates',
  },
};

export const Navbar = () => {
  const loc = useLocation();

  const nav = useNavigate();

  const currentKey =
    Object.keys(tabs).find((key) => tabs[key].path === loc.pathname) || 'todos';

  return (
    <div>
      <div className="nav_main">
        {Object.keys(tabs).map((key) => {
          return (
            <button
              key={key}
              className={`nav_main_option ${loc.pathname === tabs[key].path ? 'selected' : ''}`}
              onClick={() => {
                nav(tabs[key].path);
              }}
            >
              {tabs[key].name}
            </button>
          );
        })}
      </div>
      <div className="navbar_title">
        <p>{tabs[currentKey].name}</p>
      </div>
    </div>
  );
};
