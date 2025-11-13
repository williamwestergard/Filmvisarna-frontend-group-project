import React, { useRef, useEffect, useState } from "react";
import './Navbar.css';
import {useNavigate,  Link, useLocation } from "react-router-dom";
import logo from './navbar-logo.png'; 
import UserProfilePic from "./navbar-user-profile-picture.png"

type User = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

type NavbarProps = {
  onOpenLogin?: () => void; // open for login modal
  onOpenRegister?: () => void; // open for register modal
};

const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogOutOpen, setisLogOutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeBookingsCount, setActiveBookingsCount] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

    // Removes navbar animation on page change
    useEffect(() => {
      const navbar = document.querySelector(".site-header") as HTMLElement;
      if (!navbar) return;

      navbar.classList.add("no-transition");
      navbar.classList.remove("navbar-hidden");
      navbar.style.transform = "translateY(0)";
      void navbar.offsetHeight;
      navbar.style.transform = "";
      requestAnimationFrame(() => {
        navbar.classList.remove("no-transition");
      });
    }, [location.pathname]);

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

  // Säkerställ att paneler stängs när menyn stängs utan att låsa sidscroll
  useEffect(() => {
    if (!isMenuOpen) {
      setIsDropdownOpen(false);
      setIsAccountOpen(false);
    }
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

  useEffect(() => {
    if (!user?.id) {
      setActiveBookingsCount(null);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/users/${user.id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.bookings)) {
          const now = new Date();
          const activeCount = data.bookings.filter((booking: { screeningTime: string }) => {
            return new Date(booking.screeningTime) > now;
          }).length;
          setActiveBookingsCount(activeCount);
        } else {
          setActiveBookingsCount(0);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Unable to fetch user bookings:", err);
          setActiveBookingsCount(null);
        }
      });

    return () => controller.abort();
  }, [user?.id]);

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

useEffect(() => {
  const navbar = document.querySelector('.site-header') as HTMLElement;
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let scrollUpDistance = 0;
  const scrollUpThreshold = 140; // px

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (scrollingDown) {
      scrollUpDistance = 0;

      if (currentScrollY > 50) {
        navbar.classList.add('navbar-hidden');
      }
    } else {
      scrollUpDistance += lastScrollY - currentScrollY;

      if (scrollUpDistance > scrollUpThreshold) {
        navbar.classList.remove('navbar-hidden');
        scrollUpDistance = 0; 
      }
    }

    if (currentScrollY <= 0) {
      navbar.classList.remove('navbar-hidden');
      scrollUpDistance = 0;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

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
              <li><a href="/shop" className="dropdown-link">Vår kiosk</a></li>
              {user && (
                <li><a href="/mina-sidor" className="dropdown-link">Mina bokningar</a></li>
              )}
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
               {/*Login button triggers login modal opener*/} 
                <button type="button" className="nav-button" onClick={onOpenLogin}>
                  Logga in
                </button>
              </li>
              <li className="nav-item">
                {/* Register button triggers register modal opener */} {/* <-- CHANGED */}
                <button type="button" className="nav-button" onClick={onOpenRegister}>
                  Skapa konto
                </button>
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
          {user && (
            <li className="nav-item">
              <Link to="/mina-sidor" className="nav-link" onClick={closeMenu}>Mina bokningar</Link>
            </li>
          )}
        </ul>
          <div className={isAccountOpen ? 'mobile-account-panel open' : 'mobile-account-panel'}>
            {/* Display user profile when logged in */}
            {user && (
              <div className="mobile-account-user">
                <img
                  className="nav-user-avatar"
                  src={UserProfilePic}
                  alt="Användarbild"
                  referrerPolicy="no-referrer"
                />
                <Link to="/mina-sidor" className="nav-user-name mobile">
                  {user.firstName} {user.lastName}
                </Link>
              </div>
            )}

            <button
              type="button"
              className="nav-link nav-link-back"
              onClick={() => setIsAccountOpen(false)}
            >
              ‹ Tillbaka
            </button>

            <Link
              to="/mina-sidor"
              className="nav-link nav-link-bookings"
              onClick={() => { closeMenu(); setIsAccountOpen(false); }}
            >
              Bokningar
            </Link>

            {typeof activeBookingsCount === "number" && (
              <p className="mobile-booking-count">
                {activeBookingsCount} {activeBookingsCount === 1 ? "aktiv bokning" : "aktiva bokningar"}
              </p>
            )}

            {/* Conditional rendering based on authentication status */}
            {user ? (
              <>
                <button className="nav-button" onClick={() => { handleLogout(); closeMenu(); }}>Logga ut</button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={() => { onOpenLogin?.(); openAccountLink(); }}>Logga in</button>
              <button className="nav-button" onClick={() => { onOpenRegister?.(); openAccountLink(); }}>Skapa konto</button>
            </>
          )}
        </div>
          </div>
        </nav>
        );

        return (
        <header className="site-header">
            <div className="site-header-inner">
          {desktopNavigation}
          {mobileNavigation}
          </div>
        </header>
        );
      };

      export default Navbar;
