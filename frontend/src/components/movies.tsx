import { useEffect, useState } from "react";
import { getMovies } from "../api/moviesApi";

type Movie = {
  id: number;
  title: string;
  ageLimit: number;
};

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]); 

  useEffect(() => {
    getMovies()
      .then((data: Movie[]) => setMovies(data))
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  return (
    <>
      <h2>Filmer</h2>
      {movies.map(movie => (
        <div key={movie.id}>{movie.title}{movie.ageLimit}</div>
      ))}
    </>
  );
}
