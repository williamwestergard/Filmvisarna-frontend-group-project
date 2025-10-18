import { useEffect, useState } from "react";
import { getMovies } from "../../api/MoviesApi";
import { Link } from "react-router-dom";

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
    .then((data: Movie[]) => {
      const titanic = data.find(movie => movie.title.toLowerCase() === "titanic");
      const others = data.filter(movie => movie.title.toLowerCase() !== "titanic");
      const ordered = titanic ? [titanic, ...others] : data;

      setMovies(ordered);
    })
    .catch(err => console.error("Error fetching movies:", err));
}, []);

  return (
    <>

      <section className="movie-grid">
  {movies.map((movie) => {
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
