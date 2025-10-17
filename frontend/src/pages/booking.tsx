import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovies} from "../api/MoviesListApi";
import "./booking.css";
// import MovieBooking from "../components/MovieBooking"


type Movie = {
  id: number;
  title: string;
  category: string[]; 
  posterUrl: string;
  trailerUrl: string,
  language: string
};

function getVideoId(url: string) {
  if (!url) return "";
  if (url.includes("youtu.be")) {
    return url.split("/").pop()?.split("?")[0];
  }
  if (url.includes("youtube.com/watch?v=")) {
    return url.split("v=")[1]?.split("&")[0];
  }
  return "";
}

function BookingPage() {
  const { movieTitle } = useParams<{ movieTitle: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

useEffect(() => {
  getMovies()
    .then((data: Movie[]) => {
      console.log(data); // Check if trailerUrl and language exist
      setMovies(data);
    })
    .catch((err) => console.error("Error fetching movies:", err));
}, []);




  // Find the movie matching the URL slug
const movie = movies.find(
  (m) => m.title?.toLowerCase().replace(/\s+/g, "-") === movieTitle
);

  if (!movie) return <p></p>;
    
  return (
    <>


    <main  key={movie.id} className="booking-page">
      
    <section className="booking-page-movie-content">
      {/* <MovieBooking/> */}
       <section className="booking-page-movie-text">
      <h1 className="booking-movie-title">{movie.title}</h1>
      <p className="movie-lang-sub">Eng tal, Sve text</p>
        <p className={`movie-desc ${isExpanded ? "expanded" : ""}`}>
        
        Året är 1963. Den 17-åriga Frances "Baby" Houseman
        följer med sina föräldrar till ett pensionat i Catskillbergen
       i New York för några lediga sommarveckor innan hon ska börja på college. 
       <br/> <br/>
       Hon bråkar med sin äldre syster Lisa och passar inte riktigt in bland de andra gästerna 
       och de arrangerade aktiviteterna utan söker efter något mer genuint och stimulerande.</p>
       <p
            className="movie-toggle-desc"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Visa mindre" : "Mer information"}
          </p>
         <section className="movie-runtime-genre-container">
       <p className="movie-runtime">2 tim, 15 min</p>
     
       <p className="movie-booking-genre">Drama</p>
        <p className="movie-booking-genre">Romantik</p>
       </section>
       </section>


       <article className="booking-movie-poster">
        <img
                className="movie-card"
                src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
                alt={movie.title}
                width={200}
              />

       </article>



      </section>
<article className="trailer">
  <p>Se trailer</p>
 {movie.trailerUrl ? (
  <iframe
    width="100%"
    height="360"
    src={`https://www.youtube.com/embed/${getVideoId(movie.trailerUrl)}`}
    title={`${movie.title} Trailer`}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
) : (
  <p>Trailer not available</p>
)}
</article>

    </main>

    </>
  )
}

export default BookingPage