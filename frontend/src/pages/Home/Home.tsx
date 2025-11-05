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
  const [selectedDate, setSelectedDate] = useState(() => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
});
  const [searchTerm, setSearchTerm] = useState(""); //nytt state

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

useEffect(() => {
  if (!selectedDate) return;

  getShowtimes(selectedDate)
    .then((data) => setShowtimes(data))
    .catch((err) => console.error("Error fetching showtimes:", err));
}, [selectedDate]);

    useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // todays date is automatically selected
    setSelectedDate(today);
  }, []);

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
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
             min={new Date().toISOString().split("T")[0]} // today
            max={(() => {
            const date = new Date();
            date.setDate(date.getDate() + 14); // +14 days
            return date.toISOString().split("T")[0];
            })()} // 2 weeks ahead
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

        {/* Movies list */}
        <MoviesList
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          showtimes={showtimes}
          searchTerm={searchTerm} 
        />
      </main>
    </>
  );
}

export default Home;
