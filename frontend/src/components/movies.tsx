import { useEffect, useState } from "react";
import { getMovies } from "../api/moviesApi";

type Movie = {
  id: number;
  title: string;
  category: string[]; 
  posterUrl: string;

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

      <section className="movie-grid">
        {movies.map((movie) => (
          <article key={movie.id} >
             <img className="movie-card"
            src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
            alt={movie.title}
            width={200}
            
          />
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-genre">{movie.category.join(", ")}</p>
          </article>
        ))}
      </section>




    </>
  );
}
