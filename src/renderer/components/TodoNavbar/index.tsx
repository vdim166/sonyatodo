import './styles.css';
import { TODO_NAVBAR_PAGES } from '../../pages/Main';

type TodoNavbarProps = {
  currentPage: keyof typeof TODO_NAVBAR_PAGES;
  setCurrentPage: (key: keyof typeof TODO_NAVBAR_PAGES) => void;
};

export const TodoNavbar = ({
  currentPage,
  setCurrentPage,
}: TodoNavbarProps) => {
  return (
    <div className="todo_navbar">
      {Object.keys(TODO_NAVBAR_PAGES).map((key) => {
        return (
          <div
            className={`todo_navbar_option ${currentPage === TODO_NAVBAR_PAGES[key as keyof typeof TODO_NAVBAR_PAGES] ? 'selected' : ''}`}
            onClick={() => {
              setCurrentPage(
                TODO_NAVBAR_PAGES[key as keyof typeof TODO_NAVBAR_PAGES],
              );
            }}
          >
            <p>{key}</p>
          </div>
        );
      })}
    </div>
  );
};
