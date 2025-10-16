import { NavLink } from "react-router-dom";
import logoUrl from "/logo-filmvisarna.svg";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-content">
          {/* Vänster: logga och huvudlänkar */}
          <div className="navbar-left">
            <NavLink to="/" className="navbar-logo">
              <img src={logoUrl} alt="Filmvisarna" className="logo-img" />
              <span className="logo-text">FILMVISARNA</span>
            </NavLink>

            <ul className="navbar-links">
              <li>
                <NavLink
                  to="/upptack"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                >
                  Upptäck
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pa-bio-nu"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                >
                  På bio nu
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Höger: knappar */}
          <div className="navbar-right">
            <NavLink to="/login" className="btn">
              Logga in
            </NavLink>
            <NavLink to="/register" className="btn">
              Skapa konto
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}