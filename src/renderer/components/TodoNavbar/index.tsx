import { useAppContext } from '../../hooks/useAppContext';
import './styles.css';

export const TodoNavbar = () => {
  const { currentPage, tabs, setCurrentPage } = useAppContext();

  if (!tabs) {
    return <div>Loading...</div>;
  }
  return (
    <div className="todo_navbar">
      {tabs.map((key) => {
        return (
          <div
            className={`todo_navbar_option ${currentPage === key ? 'selected' : ''}`}
            onClick={() => {
              setCurrentPage(key);
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
