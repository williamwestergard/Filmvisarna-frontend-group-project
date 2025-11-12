import { useEffect, useState } from "react";
import "./Home.css";
import MoviesList from "../../components/Movies/MoviesList";
import BgOverlay from "../../assets/images/home-bg.jpg";
import { getCategories, getShowtimes } from "../../api/moviesApi";
import SearchBar from "../../components/SearchBar/SearchBar";
import AgeLimitInfo from "../../components/AgeLimitInfo/AgeLimitInfo";

type Category = {
  id: number;
  title: string;
};

type Showtime = {
  screeningId: number;
  movieId: number;
  date: string;
  time: string;
};

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllMovies, setShowAllMovies] = useState(false);

  // Restore date from sessionStorage
  useEffect(() => {
    const savedDate = sessionStorage.getItem("selectedDate");
    if (savedDate) setSelectedDate(savedDate);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setShowtimes([]);
      return;
    }
    getShowtimes(selectedDate)
      .then(setShowtimes)
  }, [selectedDate]);

  return (
    <>
      <img
        className="bg-overlay"
        src={BgOverlay}
        alt="Image of a man and woman watching a movie"
      />

      <main className="home-container">
        <AgeLimitInfo />
        <h1 className="home-title">På bio nu</h1>

        <SearchBar onSearch={setSearchTerm} />

        <section className="filter-section">
          <div className="filter-controls">
           
            <input
              type="date"
              lang="sv-SE"
              className="filter-dropdown"
              value={selectedDate || ""}
              onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
              onChange={(e) => {
                const newDate = e.target.value;
                setSelectedDate(newDate);
                sessionStorage.setItem("selectedDate", newDate);
                setShowAllMovies(false); 
              }}
              min={new Date().toISOString().split("T")[0]}
              max={(() => {
                const d = new Date();
                d.setDate(d.getDate() + 14);
                return d.toISOString().split("T")[0];
              })()}
            />

           
            <select
              className="filter-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Alla kategorier</option>
              {categories.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          
          {selectedDate && (
            <div className="show-all-container">
              <button
                className={`show-all-button ${
                  showAllMovies ? "inactive" : "active"
                }`}
                onClick={() => setShowAllMovies((prev) => !prev)}
              >
                {showAllMovies ? "Visa dagens filmer" : "Visa alla filmer"}
              </button>
            </div>
          )}
        </section>

        <MoviesList
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          showtimes={showtimes}
          searchTerm={searchTerm}
          showAllMovies={showAllMovies}
        />

        
        {selectedDate && showtimes.length === 0 && (
          <p className="no-screenings-message">
            Inga visningar finns för valt datum.
          </p>
        )}
      </main>
    </>
  );
}

export default Home;