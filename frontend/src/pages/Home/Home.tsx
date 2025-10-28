import { useEffect, useState } from "react";
import "./Home.css";
import MoviesList from "../../components/Movies/MoviesList";
import BgOverlay from "../../assets/images/home-bg.jpg";
import { getCategories, getShowtimes } from "../../api/MoviesApi";
import SearchBar from "../../components/SearchBar/SearchBar"; // 👈 import
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
  const [searchTerm, setSearchTerm] = useState(""); // 👈 nytt state

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
      
      {/* AgeLimitInfo */}
       <AgeLimitInfo />
      <main className="home-container">
        <h1 className="home-title">Aktuella filmer</h1>

        {/* 🔍 SearchBar */}
        <SearchBar onSearch={(value) => setSearchTerm(value)} />

        {/* Filter section */}
        <section className="filter-section">
          <input
            type="date"
            lang="sv-SE"
            className="filter-dropdown"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks ahead
              .toISOString()
      .       split("T")[0]}
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
