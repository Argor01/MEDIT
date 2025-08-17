import React from 'react';
import { ReactComponent as Logo } from '../pics/logos/logo.svg';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-svg"><Logo aria-label="Логотип" /></span>
          <span className="logo-text">MEDIT</span>
        </div>
        <div className="user-profile">
          <span className="user-name">Пациент</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
