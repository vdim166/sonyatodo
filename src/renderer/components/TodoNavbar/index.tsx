import { useAppContext } from '../../hooks/useAppContext';
import './styles.css';

export const TodoNavbar = () => {
  const { currentTab, tabs, setCurrentTab } = useAppContext();

  if (!tabs) {
    return <div>Loading...</div>;
  }
  return (
    <div className="todo_navbar">
      {tabs.map((key) => {
        return (
          <div
            className={`todo_navbar_option ${currentTab === key ? 'selected' : ''}`}
            onClick={() => {
              setCurrentTab(key);
            }}
            key={key}
          >
            <p>{key}</p>
          </div>
        );
      })}
    </div>
  );
};
