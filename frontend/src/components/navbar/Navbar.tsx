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

  const toggleDropdown = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault(); // Förhindra att sidan hoppar till toppen
    setIsDropdownOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
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
  const desktopNavigation = (
    <nav className="navbar navbar-desktop">
      <a href="/" className="navbar-logo-link">
        <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
      </a>

      <div className="nav-menu-container nav-menu-container-desktop">
        <ul className="nav-menu nav-menu-desktop">
          <li className="nav-item">
            <a href="/upptack" className="nav-link">Upptäck</a>
          </li>
          <li className="nav-item">
            <a href="/bio-nu" className="nav-link">På bio nu</a>
          </li>
          <li className="nav-item dropdown">
            <a href="#" className="nav-link" onClick={toggleDropdown} onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}>
              Mer <span className="dropdown-arrow">▼</span>
            </a>
            <ul className="dropdown-menu">
              <li><a href="/om-oss" className="dropdown-link">Om oss</a></li>
              <li><a href="/shop" className="dropdown-link">Vår Kiosk</a></li>
            </ul>
          </li>
        </ul>

        <ul className="nav-actions nav-actions-desktop">
          <li className="nav-item">
            <a href="/login" className="nav-button">Logga in</a>
          </li>
          <li className="nav-item">
            <a href="/register" className="nav-button">Skapa konto</a>
          </li>
        </ul>
      </div>
    </nav>
  );

  const mobileNavigation = (
    <nav className="navbar navbar-mobile">
      <a href="/" className="navbar-logo-link">
        <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
      </a>

      <button
        type="button"
        className={`menu-icon ${isMenuOpen ? 'is-open' : ''}`}
        onClick={toggleMenu}
        aria-label="Öppna meny"
        aria-expanded={isMenuOpen}
      >
        <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
        <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
        <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
      </button>

      <div className={isMenuOpen ? 'mobile-menu-panel active' : 'mobile-menu-panel'}>
        <ul className="nav-menu nav-menu-mobile">
          <li className="nav-item">
            <a href="/upptack" className="nav-link" onClick={closeMenu}>Upptäck</a>
          </li>
          <li className="nav-item">
            <a href="/bio-nu" className="nav-link" onClick={closeMenu}>På bio nu</a>
          </li>
          <li className={`nav-item dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown()}
              aria-expanded={isDropdownOpen}
            >
              Mer <span className="dropdown-arrow">▼</span>
            </button>
            <ul className="dropdown-menu">
              <li><a href="/om-oss" className="dropdown-link" onClick={closeMenu}>Om oss</a></li>
              <li><a href="/shop" className="dropdown-link" onClick={closeMenu}>Vår Kiosk</a></li>
            </ul>
          </li>
        </ul>

        <ul className="nav-actions nav-actions-mobile">
          <li className="nav-item">
            <a href="/login" className="nav-button" onClick={closeMenu}>Logga in</a>
          </li>
          <li className="nav-item">
            <a href="/register" className="nav-button" onClick={closeMenu}>Skapa konto</a>
          </li>
        </ul>
      </div>
    </nav>
  );

  return (
    <header className="site-header">
      {desktopNavigation}
      {mobileNavigation}
    </header>
  );
};

export default Navbar;
