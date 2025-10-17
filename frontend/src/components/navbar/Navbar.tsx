// Fil: Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from './navbar-logo.png'; // Importera din logotyp

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault(); // Förhindra att sidan hoppar till toppen
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Effekt för att förhindra scrolling av body när mobilmenyn är öppen
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      // Stäng även dropdown när huvudmenyn stängs
      setIsDropdownOpen(false);
    }

    // Cleanup-funktion för att ta bort klassen om komponenten tas bort
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <nav className="navbar">
        {/* Logotyp som är en länk till startsidan */}
        <a href="/" className="navbar-logo-link">
          <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
        </a>

        {/* Hamburgarikon för mobil */}
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
            <li className={`nav-item dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <a href="#" className="nav-link" onClick={toggleDropdown}>
                Mer <span className="dropdown-arrow">▼</span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="/om-oss" className="dropdown-link">Om oss</a></li>
                <li><a href="/shop" className="dropdown-link">Vår Kiosk</a></li>
              </ul>
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