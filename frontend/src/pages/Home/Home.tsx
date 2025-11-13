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

  // Restore saved date
  useEffect(() => {
    const savedDate = sessionStorage.getItem("selectedDate");
    if (savedDate) setSelectedDate(savedDate);
  }, []);

  // Get categories
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Get showtimes when date changes
  useEffect(() => {
    if (!selectedDate) {
      setShowtimes([]);
      return;
    }
    getShowtimes(selectedDate).then(setShowtimes);
  }, [selectedDate]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Alla dagar";
    return new Date(dateStr).toLocaleDateString("sv-SE");
  };

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

    
    <div className="date-picker-wrapper">
      <button
        type="button"
        className="custom-date-button"
        onClick={(e) =>
          (e.currentTarget.nextElementSibling as HTMLInputElement).showPicker?.()
        }
      >
        {selectedDate
          ? new Date(selectedDate).toLocaleDateString("sv-SE")
          : "Alla dagar"}
      </button>

      <input
        type="date"
        lang="sv-SE"
        className="real-date-input"
        value={selectedDate || ""}
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
    </div>

    
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

    
    {selectedDate && (
      <button
        className={`show-all-button ${
          showAllMovies ? "inactive" : "active"
        }`}
        onClick={() => setShowAllMovies((prev) => !prev)}
      >
        {showAllMovies
          ? `Visa filmer för ${new Date(selectedDate).toLocaleDateString("sv-SE")}`
          : "Visa alla filmer"}
      </button>
    )}
  </div>
</section>
    

        
        {selectedDate && (
          <p className="view-info">
            {showAllMovies
              ? "Du ser alla filmer just nu."
              : `Du ser filmer som visas ${formatDate(selectedDate)}.`}
          </p>
        )}

        
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