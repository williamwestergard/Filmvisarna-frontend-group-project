import "./home.css";

// All movies (placeholders for now)
const movies = [
  { id: 12, title: "The Shining", kategorier: "Horror" },
  { id: 13, title: "The Land Before Time", kategorier: "Animerad/familj, Äventyr" },
  { id: 14, title: "Good Will Hunting", kategorier: "Drama" },
  { id: 15, title: "Toy Story", kategorier: "Animerad/familj, Äventyr" },
  { id: 16, title: "Scream", kategorier: "Horror" },
  { id: 17, title: "Dirty Dancing", kategorier: "Drama, Romantik" },
  { id: 18, title: "Titanic", kategorier: "Drama, Romantik" },
  { id: 19, title: "Jurassic Park", kategorier: "Äventyr, Sci-Fi" }
];

function Home() {
  return (
    <main className="home-container">
      {/* Page title */}
      <h1 className="home-title">Aktuella filmer</h1>

      {/* Filter section */}
      <section className="filter-section">
        <select className="filter-dropdown">
          <option>Alla dagar</option>
        </select>
        <select className="filter-dropdown">
          <option>Kategorier</option>
        </select>
      </section>

      {/* Movie grid */}
      <section className="movie-grid">
        {movies.map((movie) => (
          <article key={movie.id} className="movie-card placeholder">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-genre">{movie.kategorier}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Home;