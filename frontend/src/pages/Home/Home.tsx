import { useEffect, useState } from "react";
import "./Home.css";
import MoviesList from "../../components/Movies/MoviesList";
import BgOverlay from "../../assets/images/home-bg.jpg";
import { getCategories, getShowtimes } from "../../api/MoviesApi";

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

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    getShowtimes()
      .then((data) => setShowtimes(data))
      .catch((err) => console.error("Error fetching showtimes:", err));
  }, []);

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

        {/* Filter section */}
        <section className="filter-section">
          <input
            type="date"
            className="filter-dropdown"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
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

        <MoviesList
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          showtimes={showtimes}
        />
      </main>
    </>
  );
}

export default Home;
