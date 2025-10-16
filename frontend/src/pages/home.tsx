import "./home.css";


function Startpage() {

  return (
    <>
      <main className="home-container">
      {/* Header section with title and desc */}
      <header>
        <h1 className="home-title">Filmvisarna</h1>
        <p> Din lokala bio i Småstad!</p>
      </header>

      {/* Filter section */}
      <section className="filter-section">
        <select className="filter-dropdown">
          <option>Alla dagar</option>
        </select>
        <select className="filter-dropdown">
          <option>Kategorier</option>
        </select>
      </section>

      {/* Movie grid section */}
      <section className="movie-grid">
        <article className="movie-card placeholder"></article>
        <article className="movie-card placeholder"></article>
        <article className="movie-card placeholder"></article>
        <article className="movie-card placeholder"></article>
      </section>
      </main>
    </>
  )
}

export default Startpage
