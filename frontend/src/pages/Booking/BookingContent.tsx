import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBooking } from "../../Context/BookingContext";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import Auditorium from "../../components/Auditorium/Auditorium";
import "./booking.css";

type Paketpris = {
  liten: { antal: number; pris: number };
  litenEn: { antal: number; pris: number };
};

type Movie = {
  id: number;
  title: string;
  paketpris?: Paketpris;
};
function BookingContent() {
  const { movie, setMovie } = useBooking(); 
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const location = useLocation();

  // Paketpris passed from "Boka nu" (if user came via WeeklyMovie)
  const paketprisFromState = location.state?.paketpris;

  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  const isWeekly = movie && weeklyMovie && movie.id === weeklyMovie.id;

  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          {/* Movie selection */}
          <MovieBooking
            onMovieLoaded={(loadedMovie) => {
              setMovie(loadedMovie);
              setMovieLoaded(true);
            }}
          />

          {/* Available dates */}
          {movie && <AvailableDates movieId={movie.id} />}

          <TicketsAmount />

       <Auditorium />

          {/* Paketpris info */}
          {paketprisToShow && (
            <section className="paketpris-info">
              <h3>Veckans film – Paketpris</h3>
              <p>
                {paketprisToShow.liten.antal} liten popcorn för{" "}
                {paketprisToShow.liten.pris} kr
              </p>
              <p>
                {paketprisToShow.litenEn.antal} liten popcorn för{" "}
                {paketprisToShow.litenEn.pris} kr
              </p>
              <p className="paketpris-note">
                (Erbjudandet gäller vid betalning i kassan)
              </p>
            </section>
          )}
        </section>
      </section>

      {/* Price summary */}
      {movieLoaded && (
        <article className="booking-price-card-top">
          <BookingPriceCard />
        </article>
      )}
    </main>
  );
}

export default BookingContent;
