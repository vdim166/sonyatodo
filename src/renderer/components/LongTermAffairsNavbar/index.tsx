import { useLongTermAffairsContext } from '../../hooks/useLongTermAffairsContext';
import './styles.css';

const tabs: { name: 'TODO' | 'DONE' }[] = [
  {
    name: 'TODO',
  },
  {
    name: 'DONE',
  },
];

export const LongTermAffairsNavbar = () => {
  const { currentTab, setTab } = useLongTermAffairsContext();

  return (
    <div className="todo_navbar LongTermAffairsNavbar">
      {tabs.map((key) => {
        return (
          <div
            className={`todo_navbar_option ${currentTab === key.name ? 'selected' : ''}`}
            onClick={() => {
              setTab(key.name);
            }}
            key={key.name}
          >
            <p>{key.name}</p>
          </div>
        );
      })}
    </div>
  );
};
