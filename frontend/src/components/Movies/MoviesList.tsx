import { useEffect, useState } from "react";
import { getMovies } from "../../api/MoviesApi";
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
};

export default function MovieList({ selectedCategory, selectedDate, showtimes }: MovieListProps) {
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
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const filteredMovies =
    selectedCategory === "all"
      ? movies
      : movies.filter((movie) => movie.category.includes(selectedCategory));

  // Keep local variables referenced to avoid unused warnings.
  void selectedDate;
  void showtimes;

  const fullyFilteredMovies = filteredMovies;

  return (
    <>
      <section className="movie-grid">
        {fullyFilteredMovies.map((movie) => {
          // Convert title to URL-friendly slug (e.g. "The Shining" -> "the-shining")
          const slug = movie.title.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link key={movie.id} to={`/booking/${slug}`} className="movie-link">
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
