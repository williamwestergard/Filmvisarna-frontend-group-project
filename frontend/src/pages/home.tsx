import "./home.css";

// Sample movie data
const movies = [
  {
    id: 17,
    title: "Dirty Dancing",
    releaseYear: 1987,
    ageLimit: 11,
    kategorier: "Drama, Romantik"
  },
  {
    id: 14,
    title: "Good Will Hunting",
    releaseYear: 1997,
    ageLimit: 11,
    kategorier: "Drama"
  },
  {
    id: 19,
    title: "Jurassic Park",
    releaseYear: 1993,
    ageLimit: 11,
    kategorier: "Äventyr, Sci-Fi"
  },
  {
    id: 13,
    title: "The Land Before Time",
    releaseYear: 1988,
    ageLimit: 7,
    kategorier: "Animerad/familj, Äventyr"
  },
  {
    id: 18,
    title: "Titanic",
    releaseYear: 1997,
    ageLimit: 15,
    kategorier: "Drama, Romantik"
  },
  {
    id: 15,
    title: "Toy Story",
    releaseYear: 1995,
    ageLimit: 7,
    kategorier: "Animerad/familj, Äventyr"
  }
];

function Startpage() {
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
          <article key={movie.id} className="movie-card">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-genre">{movie.kategorier}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Startpage;