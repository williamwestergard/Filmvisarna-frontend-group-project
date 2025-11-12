import { useEffect, useState } from "react";
import { getMovies } from "../../api/moviesApi";
import { Link } from "react-router-dom";
import "../../pages/Home/Home.css";

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
  showAllMovies: boolean;
};

export default function MovieList({
  selectedCategory,
  selectedDate,
  showtimes,
  searchTerm,
  showAllMovies,
}: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

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
  }, []);

  
  const filteredMovies =
  selectedCategory === "all"
    ? movies
    : movies.filter((movie) => movie.category.includes(selectedCategory));


const searchFilteredMovies = filteredMovies.filter((movie) => {
  const lowerSearch = searchTerm.toLowerCase();
  return (
    movie.title.toLowerCase().includes(lowerSearch) ||
    movie.category.some((cat) => cat.toLowerCase().includes(lowerSearch))
  );
});

const fullyFilteredMovies =
  showAllMovies
    ? searchFilteredMovies 
    : selectedDate
    ? searchFilteredMovies.filter((movie) =>
        showtimes.some((show) => show.movieId === movie.id)
      )
    : searchFilteredMovies;

  return (
    <>
    <section
  className={`movie-grid ${
    selectedDate && !showAllMovies ? "centered-mode" : ""
  }`}
>

      {fullyFilteredMovies.map((movie) => {
        const slug = movie.title.toLowerCase().replace(/\s+/g, "-");

        return (
          <Link key={movie.id} to={`/booking/${slug}`} state={{ selectedDate }} className="movie-link">
            <article>
              <img
                className="movie-card"
                src={`/images/posters/${movie.posterUrl}`}
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
