// Fil: Navbar.tsx
import React, { useState } from 'react';
import './Navbar.css';
import logo from './navbar-logo.png'; // Importera din logotyp

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        {/* Logotyp som är en länk till startsidan */}
        <a href="/" className="navbar-logo-link">
        <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
          {/* <span className="logo-text">FILMVISARNA</span> */}
        </a>

        {/* Hamburgarikon för mobil (visas bara på mindre skärmar) */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isMenuOpen ? 'bar open' : 'bar'}></div>
          <div className={isMenuOpen ? 'bar open' : 'bar'}></div>
          <div className={isMenuOpen ? 'bar open' : 'bar'}></div>
        </div>

        {/* Behållare för alla länkar och knappar */}
        <div className={isMenuOpen ? 'nav-menu-container active' : 'nav-menu-container'}>
          {/* Primära navigationslänkar */}
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="/upptack" className="nav-link">Upptäck</a>
            </li>
            <li className="nav-item">
              <a href="/bio-nu" className="nav-link">På bio nu</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Mer <span className="dropdown-arrow">▼</span>
              </a>
            </li>
          </ul>

          {/* Knappar för inloggning/registrering */}
          <ul className="nav-actions">
            <li className="nav-item">
              <a href="/login" className="nav-button">Logga in</a>
            </li>
            <li className="nav-item">
              <a href="/register" className="nav-button">Skapa konto</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;