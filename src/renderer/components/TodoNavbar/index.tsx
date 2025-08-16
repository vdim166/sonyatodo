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
            className={`todo_navbar_option ${currentTab === key.name ? 'selected' : ''}`}
            onClick={() => {
              setCurrentTab(key.name);
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
