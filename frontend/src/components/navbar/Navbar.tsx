import React, { useRef, useEffect, useState } from "react";
import './Navbar.css';
import {useNavigate,  Link } from "react-router-dom";
import logo from './navbar-logo.png'; 
import UserProfilePic from "./navbar-user-profile-picture.png"

type User = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogOutOpen, setisLogOutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

  // Gör så att "är du säker" sektionen om användaren vill logga ut stängs om man klickar utanför sektionen.
  const logoutDropdownRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      logoutDropdownRef.current &&
      !logoutDropdownRef.current.contains(event.target as Node)
    ) {
      setisLogOutOpen(false);
    }
  }

  if (isLogOutOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isLogOutOpen]);


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
    setisLogOutOpen(false);
    navigate("/");
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
          
               <li className="nav-item nav-logout">
  <div className="logout-container" style={{ position: "relative" }}>

    <button
      className="nav-button"
      onClick={() => setisLogOutOpen((prev) => !prev)}
    >
      Logga ut
    </button>

    {isLogOutOpen && (
      <div
        className="navbar-logout-dropdown"
          ref={logoutDropdownRef}>
        <p style={{ color: "#fff", marginBottom: "10px" }}>
          Är du säker?
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="navbar-logout-confirm-button"
            onClick={handleLogout}>
            Ja
          </button>
          <button
            className="navbar-logout-cancel-button"
            onClick={() => setisLogOutOpen(false)} >
            Avbryt
          </button>
        </div>
      </div>
    )}
  </div>
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
      <Link to="/" className="navbar-logo-link">
        <img src={logo} alt="Filmvisarna Logotyp" className="logo-image" />
      </Link>

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
            <Link to="/upptack" className="nav-link" onClick={closeMenu}>Veckans Film</Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>På bio nu</Link>
          </li>
          <li className="nav-item">
            <Link to="/om-oss" className="nav-link" onClick={closeMenu}>Om oss</Link>
          </li>
          <li className="nav-item">
            <Link to="/shop" className="nav-link" onClick={closeMenu}>Vår kiosk</Link>
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
