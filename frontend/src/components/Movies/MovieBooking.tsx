import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovies, getMoviesInformation } from "../../api/moviesApi";
import { useBooking } from "../../Context/BookingContext";
import AgeLimitInfo from "../AgeLimitInfo/AgeLimitInfo";

type Movie = {
  id: number;
  title: string;
  category: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  language: string;
  description: string;
  runtimeMin: number;
  ageLimit?: number | string;
  castJson: CastMember[];
};

type MovieBookingProps = {
  onMovieLoaded?: (movie: Movie) => void; //it accepts a movie
};

type CastMember = {
  actorName: string;
  characterName?: string; // optional if ew don’t have character names yet
};

function formatRuntime(minutes: number) {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ${hours === 1 ? "tim" : "tim"}${mins > 0 ? ` ${mins} min` : ""}`;
}

function getVideoId(url: string) {
  if (!url) return "";
  if (url.includes("youtu.be")) return url.split("/").pop()?.split("?")[0];
  if (url.includes("youtube.com/watch?v=")) return url.split("v=")[1]?.split("&")[0];
  return "";
}

/** Format age label to show as a pill */
function formatAgeLabel(age?: number | string) {
  if (age == null) return null;
  const s = String(age).trim().toLowerCase();
  if (s.includes("barn") || s === "0" || s === "bt") return "Barntillåten";
  const n = parseInt(s, 10);
  if (!Number.isNaN(n) && n > 0) return `${n}+`; // age limit and format like 7+
  return String(age); // fallback
}

function MovieBooking({ onMovieLoaded }: MovieBookingProps) {
  const { movieTitle } = useParams<{ movieTitle: string }>();
  const { setMovie } = useBooking();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTrailerExpanded, setIsTrailerExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ageOpen, setAgeOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getMovies(), getMoviesInformation()])
      .then(([moviesData, trailersData]) => {
        const merged = moviesData.map((movie: Movie) => {
          const infoMatch = trailersData.find(
            (t: { posterUrl?: string }) =>
              t.posterUrl && t.posterUrl.trim() === movie.posterUrl.trim()
          );

        return {
            ...movie,
            trailerUrl: infoMatch?.trailerUrl || "",
            backdropUrl: infoMatch?.backdropUrl || movie.backdropUrl,
            description: infoMatch?.description || movie.description,
            runtimeMin: infoMatch?.runtimeMin || movie.runtimeMin,
            language: infoMatch?.language || movie.language,
            castJson: infoMatch?.castJson || movie.castJson || [],
            ageLimit: infoMatch?.ageLimit,
          } as Movie;
        });

        setMovies(merged);
      })
      .catch((err) => console.error("Error fetching movie or trailer data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const movie = movies.find(
    (m) => m.title?.toLowerCase().replace(/\s+/g, "-") === movieTitle
  );

  useEffect(() => {
    if (movie && !isLoading) {
      onMovieLoaded?.(movie); // optional, still notify parent
      setMovie(movie); // store movie in context
    }
  }, [movie, isLoading, onMovieLoaded, setMovie]);

  // Don’t render anything while loading
  if (isLoading || !movie) return null;

  return (
    <>
      <img
        className="booking-movie-backdrop"
        src={`/images/backdrops/${movie.backdropUrl}`}
        alt={movie.title}
      />
      <main key={movie.id} className="booking-page">
        <section className="booking-page-movie-content">
          <section className="booking-page-movie-text">
            <Link to="/" className="booking-back-link">
              ← Tillbaka
            </Link>
            <h1 className="booking-movie-title">{movie.title}</h1>
            <p className="movie-lang-sub">{movie.language}</p>
            <p className={`movie-desc ${isExpanded ? "expanded" : ""}`}>
              {movie.description}
              <br />
              <br />
              <br />
              <strong>Skådespelare:</strong>{" "}
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

              {/* Age limit pill */}
              {formatAgeLabel(movie.ageLimit) && (
                <button
                  type="button"
                  className="agepill-button"
                  onClick={() => setAgeOpen(true)}
                  aria-haspopup="dialog"
                  title="Visa info om åldersgränser"
                >
                  {formatAgeLabel(movie.ageLimit)}
                </button>
              )}

              {movie.category.map((genre, index) => (
                <p key={index} className="movie-booking-genre">
                  {genre}
                </p>
              ))}

              {/* Shows the popup here (parent can control it) */}
              <AgeLimitInfo
                hideTrigger
                externalOpen={ageOpen}
                onRequestClose={() => setAgeOpen(false)}
              />
               <AgeLimitInfo />
            </section>
          </section>

          <article className="booking-movie-poster">
            <img
              className="booking-movie-card"
              src={`/images/posters/${movie.posterUrl}`}
              alt={movie.title}
            />
          </article>
        </section>

        <article className="trailer">
          {movie.trailerUrl ? (
            <div
              className={`trailer-frame-container ${isTrailerExpanded ? "expanded" : ""}`}
            >
              {!isTrailerExpanded && <p className="trailer-text">Se trailer</p>}

              {!isTrailerExpanded ? (
                <div
                  className="trailer-overlay"
                  onClick={() => setIsTrailerExpanded(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${getVideoId(movie.trailerUrl)}/hqdefault.jpg`}
                    alt={`${movie.title} Trailer`}
                    className="trailer-thumbnail"
                  />
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(movie.trailerUrl)}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3`}
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