import { useEffect, useState } from "react";
import "./Home.css";
import MoviesList from "../../components/Movies/MoviesList";
import BgOverlay from "../../assets/images/home-bg.jpg";
import { getCategories, getShowtimes } from "../../api/MoviesApi";
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
  const [searchTerm, setSearchTerm] = useState(""); //nytt state

  useEffect(() => {
  const savedDate = sessionStorage.getItem("selectedDate");
  if (savedDate) {
    setSelectedDate(savedDate);
  }
}, []);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

useEffect(() => {
  if (!selectedDate) {
    setShowtimes([]); // clear or reset showtimes if no date selected
    return;
  }

  getShowtimes(selectedDate)
    .then((data) => setShowtimes(data))
    .catch((err) => console.error("Error fetching showtimes:", err));
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
        <h1 className="home-title">Aktuella filmer</h1>


        <SearchBar onSearch={(value) => setSearchTerm(value)} />

        {/* Filter section */}
        <section className="filter-section">
         <input
          type="date"
          lang="sv-SE"
          className="filter-dropdown"
          value={selectedDate || ""}
          placeholder="Välj datum"
          onChange={(event) => {
            const newDate = event.target.value;
            setSelectedDate(newDate);
            sessionStorage.setItem("selectedDate", newDate);
          }}
          min={new Date().toISOString().split("T")[0]}
          max={(() => {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            return date.toISOString().split("T")[0];
          })()}
        />

          <select
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="all">Alla kategorier</option>
          {categories.map((category) => (
          <option key={category.id} value={category.title}>
            {category.title}
          </option>
          ))}
        </select>
        </section>
        {/* {!selectedDate && (
          <p className="date-hint">Välj ett datum för att se dagens visningar</p> // HINT 
        )} */}

        {/* Movies list */}
        <MoviesList
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          showtimes={showtimes}
          searchTerm={searchTerm} 
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
