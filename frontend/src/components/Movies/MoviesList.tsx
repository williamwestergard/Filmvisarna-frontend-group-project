import { useEffect, useState } from "react";
import { getMovies } from "../../api/moviesApi";
import { Link } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  category: string[];
  posterUrl: string;
};

interface MoviesListProps {
  searchTerm?: string;
}

export default function MoviesList({ searchTerm = "" }: MoviesListProps) {
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

  // Filter by search term (title or category)
  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();
    return (
      movie.title.toLowerCase().includes(term) ||
      movie.category.some((cat) => cat.toLowerCase().includes(term))
    );
  });

  return (
    <section className="movie-grid">
      {filteredMovies.length > 0 ? (
        filteredMovies.map((movie) => {
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
        })
      ) : (
        <p style={{ color: "#ccc", gridColumn: "1 / -1", textAlign: "center" }}>
          Ingen film hittades
        </p>
      )}
    </section>
  );
}

