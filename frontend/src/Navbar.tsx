import { NavLink } from "react-router-dom";
import logoUrl from "/logo-filmvisarna.svg"; // byta bild senare till popcorn logga

export default function Navbar() {
  const base = "px-4 py-2 rounded-full";
  const btn  = base + " bg-[rgba(79,70,92,0.9)] text-white hover:opacity-90";

  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto mt-6 max-w-7xl rounded-2xl bg-[#b8252a] shadow-lg">
        <div className="flex items-center justify-between px-4">
          {/* Vänster: logga och huvudlänkar */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-3 py-3">
              <img src={logoUrl} alt="Filmvisarna" className="h-12 w-12" />
              <span className="text-white text-2xl font-semibold tracking-wide">
                FILMVISARNA
              </span>
            </NavLink>

            <ul className="hidden md:flex items-center gap-8 text-white/95 text-xl">
              <li><NavLink to="/upptack" className={({isActive}) => isActive ? "font-semibold" : undefined}>Upptäck</NavLink></li>
              <li><NavLink to="/pa-bio-nu" className={({isActive}) => isActive ? "font-semibold" : undefined}>På bio nu</NavLink></li>
            </ul>
          </div>

          {/* Höger: CTA-knappar */}
          <div className="flex items-center gap-3 py-3">
            <NavLink to="/login" className={btn}>Logga in</NavLink>
            <NavLink to="/register" className={btn}>Skapa konto</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}