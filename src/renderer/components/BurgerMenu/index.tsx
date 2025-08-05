import { useState } from 'react';
import './styles.css';

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="burger-menu">
      <div
        className="burger-menu-container"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="burger-menu-line"></div>
        <div className="burger-menu-line"></div>
        <div className="burger-menu-line"></div>
      </div>

      {isOpen && <div className="burger-menu-modal"></div>}
    </div>
  );
};
