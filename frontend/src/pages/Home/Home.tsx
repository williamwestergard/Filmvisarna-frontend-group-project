import { useState } from "react";
import "./Home.css";
import MoviesList from "../../components/Movies/MoviesList";
import BgOverlay from "../../assets/images/home-bg.jpg";

function Home() {
  const [searchTerm, setSearchTerm] = useState(""); // store current search text

  return (
    <>
      <img
        className="bg-overlay"
        src={BgOverlay}
        alt="Image of a man and woman watching a movie"
      />

      <main className="home-container">
        {/* Page title */}
        <h1 className="home-title">Aktuella filmer</h1>

        {/* Search + Filter section */}
        <section className="filter-section" style={{ flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "0.5rem", fontWeight: "500" }}>Sök film</p>
            <input
              type="text"
              className="search-input"
              placeholder="Sök film eller genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <select className="filter-dropdown">
              <option>Alla dagar</option>
            </select>
            <select className="filter-dropdown">
              <option>Kategorier</option>
            </select>
          </div>
        </section>

        {/* Movie list gets the search term */}
        <MoviesList searchTerm={searchTerm} />
      </main>
    </>
  );
}

export default Home;
