// Fil: Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import {  Link } from "react-router-dom";
import logo from './navbar-logo.png'; // Importera din logotyp
import UserProfilePic from "./navbar-user-profile-picture.png"

type User = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { setUser(null); }
    }
    function onStorage(e: StorageEvent) {
      if (e.key === "authUser") {
        const v = localStorage.getItem("authUser");
        try { setUser(v ? JSON.parse(v) : null); } catch { setUser(null); }
      }
      if (e.key === "authToken" && !localStorage.getItem("authToken")) {
        setUser(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    setUser(null);
    // Stäng öppna paneler för tydlig feedback i UI
    setIsAccountOpen(false);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const desktopNavigation = (
    <nav className="navbar navbar-desktop">
      <Link to="/" className="navbar-logo-link">
        <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
      </Link>

      <div className="nav-menu-container nav-menu-container-desktop">
        <ul className="nav-menu nav-menu-desktop">
          <li className="nav-item">
            
            <Link to="/upptack" className="nav-link">Veckans film</Link>
          </li>
          <li className="nav-item">
           <Link to="/" className="nav-link">På bio nu</Link>
          </li>
          <li
            className={`nav-item dropdown ${isDropdownOpen ? 'open' : ''}`}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="#" className="nav-link" onClick={toggleDropdown} onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}>
              Mer <span className="dropdown-arrow">▼</span>
            </Link>
            <ul className="dropdown-menu">
              <li><a href="/om-oss" className="dropdown-link">Om oss</a></li>
              <li><a href="/shop" className="dropdown-link">Vår Kiosk</a></li>
            </ul>
          </li>
        </ul>

        <ul className="nav-actions nav-actions-desktop">
          {user ? (
            <>
            
              <li className="nav-item nav-user">
                <img
                  className="nav-user-avatar"
                  src={UserProfilePic}
                  alt="Användarbild"
                  referrerPolicy="no-referrer"
                />
                <span className="nav-user-name" style={{ color: "var(--text-light)", fontWeight: 500 }}>
                <Link to="/mina-sidor" className="nav-username-link">
             {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()}{" "}
             {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase()}
             </Link>
                </span>
              </li>
              <li className="nav-item">
                <button className="nav-button" onClick={handleLogout}>Logga ut</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <a href="/login" className="nav-button">Logga in</a>
              </li>
              <li className="nav-item">
                <a href="/register" className="nav-button">Skapa konto</a>
              </li>
            </>
          )}
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
            <a href="/shop" className="nav-link" onClick={closeMenu}>Vår kiosk</a>
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

            {/* Conditional rendering based on user authentication status */}
            {user ? (
            <>
              {/* Display user profile information when logged in */}
              <div className="nav-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0.9rem" }}>
                <img
                  className="nav-user-avatar"
                   src={UserProfilePic}
                  alt="Användarbild"
                  referrerPolicy="no-referrer"
                />
                <span className="nav-user-name" style={{ color: "var(--text-light)", fontWeight: 600 }}>
                  {user.firstName} {user.lastName}
                </span>
              </div>
              {/* Logout button that both logs out and closes mobile menu */}
              <button className="nav-button" onClick={() => { handleLogout(); closeMenu(); }}>Logga ut</button>
            </>
            ) : (
            <>
              {/* Login and register links for non-authenticated users */}
              <a href="/login" className="nav-button" onClick={openAccountLink}>Logga in</a>
              <a href="/register" className="nav-button" onClick={openAccountLink}>Skapa konto</a>
            </>
            )}
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
