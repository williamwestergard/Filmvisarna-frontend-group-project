import { useEffect, useState } from "react";
import { getMovies } from "../../api/moviesApi";
import { Link } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  category: string[];
  posterUrl: string;
};

type Showtime = {
  screeningId: number;
  movieId: number;
  date: string;
  time: string;
};

type MovieListProps = {
  selectedCategory: string;
  selectedDate: string;
  showtimes: Showtime[];
  searchTerm: string; 
};

export default function MovieList({
  selectedCategory,
  selectedDate,
  showtimes,
  searchTerm,
}: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAllMovies, setShowAllMovies] = useState(false);

  useEffect(() => {
    getMovies()
      .then((data: Movie[]) => {
        const titanic = data.find(
          (movie) => movie.title.toLowerCase() === "titanic"
        );
        const others = data.filter(
          (movie) => movie.title.toLowerCase() !== "titanic"
        );
        const ordered = titanic ? [titanic, ...others] : data;
        setMovies(ordered);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Filtrering efter kategori
  const filteredMovies =
  selectedCategory === "all"
    ? movies
    : movies.filter((movie) => movie.category.includes(selectedCategory));

// Filtrera på söktermen (titel eller kategori)
const searchFilteredMovies = filteredMovies.filter((movie) => {
  const lowerSearch = searchTerm.toLowerCase();
  return (
    movie.title.toLowerCase().includes(lowerSearch) ||
    movie.category.some((cat) => cat.toLowerCase().includes(lowerSearch))
  );
});

// Filtrera filmer som har en visning för valt datum
const fullyFilteredMovies = showAllMovies
  ? searchFilteredMovies
  : searchFilteredMovies.filter((movie) =>
      showtimes.some((show) => show.movieId === movie.id)
    );

  return (
    <>
    <div className="show-all-container">
    <button
      className={`show-all-button ${showAllMovies ? "active" : ""}`}
      onClick={() => setShowAllMovies((prev) => !prev)}
    >
    {showAllMovies
      ? "Visa bara filmer med visning i dag"
      : "Visa alla filmer"}
    </button>
    </div>
    <section className="movie-grid">
      {fullyFilteredMovies.map((movie) => {
        const slug = movie.title.toLowerCase().replace(/\s+/g, "-");

        return (
          <Link key={movie.id} to={`/booking/${slug}`} state={{ selectedDate }} className="movie-link">
            <article>
              <img
                className="movie-card"
                src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
                alt={movie.title}
                width={200}
              />
              <h2 className="movie-title">{movie.title}</h2>
              <p className="movie-genre">{movie.category.join(", ")}</p>
            </article>
          </Link>
        );
      })}
    </section>
    </>
  );
}
