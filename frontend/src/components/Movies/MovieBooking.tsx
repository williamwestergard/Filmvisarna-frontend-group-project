import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type CastMember = {
  actorName: string;
  characterName?: string;
};

type Paketpris = {
  liten: { antal: number; pris: number };
  litenEn: { antal: number; pris: number };
};

type Movie = {
  id: number;
  title: string;
  category?: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  language: string;
  description: string;
  runtimeMin: number;
  castJson: CastMember[];
  paketpris?: Paketpris; // 🎁 Added from backend when it's Veckans film
};

type MovieBookingProps = {
  onMovieLoaded?: (movie: Movie) => void;
};

function formatRuntime(minutes: number) {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} tim${mins > 0 ? ` ${mins} min` : ""}`;
}

function getVideoId(url: string) {
  if (!url) return "";
  if (url.includes("youtu.be")) return url.split("/").pop()?.split("?")[0];
  if (url.includes("youtube.com/watch?v=")) return url.split("v=")[1]?.split("&")[0];
  return "";
}

function MovieBooking({ onMovieLoaded }: MovieBookingProps) {
  const { movieTitle } = useParams<{ movieTitle: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTrailerExpanded, setIsTrailerExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsLoading(true);

        // 🎬 Fetch the movie directly from backend by slug
        const res = await fetch(`/api/movies/slug/${movieTitle}`);
        const data = await res.json();

        setMovie(data);
        onMovieLoaded?.(data); // pass up to BookingPage
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [movieTitle, onMovieLoaded]);

  if (isLoading || !movie) return null;

  return (
    <>
      <img
        className="booking-movie-backdrop"
        src={`http://localhost:4000/images/backdrops/${movie.backdropUrl}`}
        alt={movie.title}
      />
      <main key={movie.id} className="booking-page">
        <section className="booking-page-movie-content">
          <section className="booking-page-movie-text">
            <h1 className="booking-movie-title">{movie.title}</h1>
            <p className="movie-lang-sub">{movie.language}</p>
            <p className={`movie-desc ${isExpanded ? "expanded" : ""}`}>
              {movie.description}
              <br />
              <br />
              <strong>Skådespelare:</strong>
              <br />
              {movie.castJson.map((c) => c.actorName).join(", ")}
            </p>

            <p
              className="movie-toggle-desc"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Visa mindre" : "Mer information"}
            </p>

            <section className="movie-runtime-genre-container">
              <p className="movie-runtime">{formatRuntime(movie.runtimeMin)}</p>
              {movie.category &&
                movie.category.map((genre, index) => (
                  <p key={index} className="movie-booking-genre">
                    {genre}
                  </p>
                ))}
            </section>
          </section>

          <article className="booking-movie-poster">
            <img
              className="booking-movie-card"
              src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
              alt={movie.title}
            />
          </article>
        </section>

        <article className="trailer">
          {movie.trailerUrl ? (
            <div
              className={`trailer-frame-container ${
                isTrailerExpanded ? "expanded" : ""
              }`}
            >
              {!isTrailerExpanded && <p className="trailer-text">Se trailer</p>}
              {!isTrailerExpanded ? (
                <div
                  className="trailer-overlay"
                  onClick={() => setIsTrailerExpanded(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${getVideoId(
                      movie.trailerUrl
                    )}/hqdefault.jpg`}
                    alt={`${movie.title} Trailer`}
                    className="trailer-thumbnail"
                  />
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(
                    movie.trailerUrl
                  )}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ) : (
            <p>Trailer not available</p>
          )}
        </article>
      </main>
    </>
  );
}

export default MovieBooking;