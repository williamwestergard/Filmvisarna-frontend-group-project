import "./home.css";
import MoviesList from "../components/movies"



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

<MoviesList />
    
    </main>
  );
}

export default Home;
