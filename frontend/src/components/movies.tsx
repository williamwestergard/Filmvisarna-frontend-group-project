import { useEffect, useState } from "react";
import { getMovies } from "../api/moviesApi";

export default function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  return (
    <>
      <h2>Movies</h2>
      {movies.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </>
  );
}
