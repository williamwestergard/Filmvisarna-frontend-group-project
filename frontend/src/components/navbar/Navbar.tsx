// Fil: Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from './navbar-logo.png'; // Importera din logotyp

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

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
    setIsAccountOpen(false);
  };

  // Effekt för att förhindra scrolling av body när mobilmenyn är öppen
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      // Stäng även dropdown och konto-panel när huvudmenyn stängs
      setIsDropdownOpen(false);
      setIsAccountOpen(false);
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
            <a href="/upptack" className="nav-link">Veckans Film</a>
          </li>
          <li className="nav-item">
            <a href="/" className="nav-link">På bio nu</a>
          </li>
          <li
            className={`nav-item dropdown ${isDropdownOpen ? 'open' : ''}`}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
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

  const toggleAccountPanel = () => {
    setIsAccountOpen((prev) => !prev);
  };

  const openAccountLink = () => {
    setIsAccountOpen(false);
    closeMenu();
  };

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
        <button
          type="button"
          className={`nav-button nav-button-account ${isAccountOpen ? 'open' : ''}`}
          onClick={toggleAccountPanel}
          aria-expanded={isAccountOpen}
        >
          Ditt konto
        </button>

        <ul className="nav-menu nav-menu-mobile">
          <li className="nav-item">
            <a href="/upptack" className="nav-link" onClick={closeMenu}>Veckans Film</a>
          </li>
          <li className="nav-item">
            <a href="/" className="nav-link" onClick={closeMenu}>På bio nu</a>
          </li>
          <li className="nav-item">
            <a href="/om-oss" className="nav-link" onClick={closeMenu}>Om oss</a>
          </li>
          <li className="nav-item">
            <a href="/shop" className="nav-link" onClick={closeMenu}>Vår Kiosk</a>
          </li>
        </ul>
        <div className={isAccountOpen ? 'mobile-account-panel open' : 'mobile-account-panel'}>
          <button
            type="button"
            className="nav-link nav-link-back"
            onClick={() => setIsAccountOpen(false)}
          >
            ‹ Tillbaka
          </button>
          <a href="/login" className="nav-button" onClick={openAccountLink}>Logga in</a>
          <a href="/register" className="nav-button" onClick={openAccountLink}>Skapa konto</a>
        </div>
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
